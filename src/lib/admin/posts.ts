import matter from "gray-matter";
import { runChecks, scoreChecks } from "@/lib/admin/checks";
import {
  CONTENT_PATH, MEDIA_PATH, SKIP_DEPLOY_TAG, commitMessage, countWords, isValidSlug,
  normalizeFrontmatter, postStatus, serializePost, todayInChile,
  type AdminPost, type AdminPostSummary, type Frontmatter, type SaveResult,
} from "@/lib/admin/shared";
import { getStorage, postPath, StorageError, type FileChange } from "@/lib/admin/storage";

function parse(slug: string, sha: string, text: string): AdminPost {
  const { data, content } = matter(text);
  return { slug, sha, content: content.replace(/^\n+/, ""), ...normalizeFrontmatter(data, slug) };
}

export async function listPosts(): Promise<AdminPostSummary[]> {
  const files = await getStorage().listTexts(CONTENT_PATH);
  const today = todayInChile();
  return files
    .filter((f) => f.path.endsWith(".mdx"))
    .map((f) => {
      const slug = f.path.slice(CONTENT_PATH.length + 1).replace(/\.mdx$/, "");
      const { content, ...p } = parse(slug, f.sha, f.text);
      return { ...p, words: countWords(content), status: postStatus(p, today), score: scoreChecks(runChecks(p, slug, content)) };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export async function getAdminPost(slug: string): Promise<AdminPost | null> {
  if (!isValidSlug(slug)) return null;
  const f = await getStorage().readFile(postPath(slug));
  return f ? parse(slug, f.sha, f.text) : null;
}

export interface SaveInput {
  slug: string;
  originalSlug?: string | null;
  sha?: string | null;
  frontmatter: Frontmatter;
  content: string;
}

export async function savePost(input: SaveInput): Promise<SaveResult> {
  const storage = getStorage();
  const { slug, originalSlug } = input;
  if (!isValidSlug(slug)) throw new StorageError("La URL (slug) solo puede tener minúsculas, números y guiones.", 400);
  const fm = input.frontmatter;
  if (!fm.title.trim()) throw new StorageError("Falta el título.", 400);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fm.date)) throw new StorageError("La fecha debe ser AAAA-MM-DD.", 400);
  if (/!\[Subiendo[^\]]*\]\(\)/.test(input.content)) throw new StorageError("Espera a que terminen de subir las imágenes.", 400);

  const renamed = Boolean(originalSlug && originalSlug !== slug);
  const previous = originalSlug ? await storage.readFile(postPath(originalSlug)) : null;
  if (originalSlug && !previous) throw new StorageError("El artículo ya no existe en el repositorio. Recarga el panel.", 409);
  if (previous && input.sha && previous.sha !== input.sha) {
    throw new StorageError("El artículo cambió en GitHub desde que lo abriste. Copia tus cambios y recarga.", 409);
  }
  if (!originalSlug || renamed) {
    if (await storage.readFile(postPath(slug))) throw new StorageError(`Ya existe un artículo con la URL /blog/${slug}.`, 409);
  }

  const prevStatus = previous ? postStatus(normalizeFrontmatter(matter(previous.text).data, originalSlug!)) : "borrador";
  const today = todayInChile();
  const status = postStatus(fm, today);
  const wasPublic = prevStatus === "publicado";
  const isPublic = status === "publicado";

  const finalFm: Frontmatter = { ...fm, tags: [...new Set(fm.tags.map((t) => t.trim()).filter(Boolean))] };
  // Fecha de actualización solo cuando editas algo que ya estaba publicado.
  if (wasPublic && isPublic && fm.date < today) finalFm.updated = today;
  if (!finalFm.draft) delete finalFm.draft;

  const text = serializePost(finalFm, input.content);
  const changes: FileChange[] = [{ path: postPath(slug), text }];
  if (renamed) changes.push({ path: postPath(originalSlug!), delete: true });

  // Solo desplegamos cuando cambia algo visible en el sitio.
  const deploys = wasPublic || isPublic;
  const kind = status === "borrador" ? (wasPublic ? "despublica" : "borrador")
    : status === "programado" ? "programa"
    : wasPublic ? "actualiza" : "publica";
  const extra = [status === "programado" ? `para ${fm.date}` : "", deploys ? "" : SKIP_DEPLOY_TAG].filter(Boolean).join(" ");
  const commit = await storage.commit(changes, commitMessage(kind, finalFm.title, extra));

  const saved = await storage.readFile(postPath(slug));
  return { slug, sha: saved?.sha ?? "", commitUrl: commit.url, deploys: deploys && storage.mode === "github", status };
}

export async function deletePost(slug: string, sha?: string): Promise<SaveResult> {
  const storage = getStorage();
  const current = await storage.readFile(postPath(slug));
  if (!current) throw new StorageError("El artículo no existe.", 404);
  if (sha && current.sha !== sha) throw new StorageError("El artículo cambió desde que lo abriste. Recarga antes de borrarlo.", 409);
  const fm = normalizeFrontmatter(matter(current.text).data, slug);
  const status = postStatus(fm);
  const deploys = status === "publicado";

  // También se borran las imágenes de su carpeta.
  const media = (await storage.listMedia()).filter((m) => m.folder === slug);
  const changes: FileChange[] = [{ path: postPath(slug), delete: true }, ...media.map((m) => ({ path: m.path, delete: true }))];
  const commit = await storage.commit(changes, commitMessage("elimina", fm.title, deploys ? "" : SKIP_DEPLOY_TAG));
  return { slug, sha: "", commitUrl: commit.url, deploys: deploys && storage.mode === "github", status };
}

const EXT_BY_TYPE: Record<string, string> = {
  "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/avif": "avif", "image/svg+xml": "svg",
};

export async function uploadMedia(folder: string, filename: string, type: string, base64: string) {
  const ext = EXT_BY_TYPE[type];
  if (!ext) throw new StorageError("Formato no permitido. Usa JPG, PNG, WebP, GIF, AVIF o SVG.", 400);
  const bytes = Math.floor((base64.length * 3) / 4);
  if (bytes > 3.5 * 1024 * 1024) throw new StorageError("La imagen pesa más de 3,5 MB.", 413);
  const safeFolder = isValidSlug(folder) ? folder : "sin-articulo";
  const base = filename.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "imagen";
  const stamp = Date.now().toString(36).slice(-5);
  const filePath = `${MEDIA_PATH}/${safeFolder}/${base}-${stamp}.${ext}`;
  // Las imágenes no disparan un deploy: salen con el siguiente artículo publicado.
  await getStorage().commit([{ path: filePath, base64 }], `blog: sube imagen ${base}.${ext} ${SKIP_DEPLOY_TAG}`);
  return { path: filePath, url: `/${filePath.replace(/^public\//, "")}` };
}

export async function deleteMedia(filePath: string) {
  if (!filePath.startsWith(`${MEDIA_PATH}/`) || filePath.includes("..")) throw new StorageError("Ruta no permitida.", 400);
  await getStorage().commit([{ path: filePath, delete: true }], `blog: elimina imagen ${filePath.split("/").pop()} ${SKIP_DEPLOY_TAG}`);
}

export async function triggerDeploy(): Promise<boolean> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) return false;
  const res = await fetch(hook, { method: "POST", cache: "no-store" });
  if (!res.ok) throw new StorageError(`Vercel respondió ${res.status} al deploy hook.`, 502);
  return true;
}
