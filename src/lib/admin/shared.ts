// Utilidades del panel que funcionan en servidor y navegador.
import { ACCENTS, postStatus, todayInChile, type AccentName, type PostStatus } from "@/lib/blogShared";

export { ACCENTS, postStatus, todayInChile };
export type { AccentName, PostStatus };

export const CONTENT_PATH = "src/content";
export const MEDIA_PATH = "public/media/blog";
export const MEDIA_URL = "/media/blog";
/** Marca que Vercel usa para saltarse el build (ver vercel.json). */
export const SKIP_DEPLOY_TAG = "[sin-deploy]";

export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  cover?: string;
  color: AccentName;
  tags: string[];
  draft?: boolean;
}

export interface AdminPost extends Frontmatter {
  slug: string;
  sha: string;
  content: string;
}

export interface AdminPostSummary extends Frontmatter {
  slug: string;
  sha: string;
  words: number;
  status: PostStatus;
  score: number;
}

export interface MediaItem {
  path: string; // public/media/blog/slug/archivo.webp
  url: string; // /media/blog/slug/archivo.webp
  folder: string;
  name: string;
  size: number;
}

export interface SaveResult {
  slug: string;
  sha: string;
  commitUrl?: string;
  deploys: boolean;
  status: PostStatus;
}

export const COLOR_NAMES = Object.keys(ACCENTS) as AccentName[];

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!,:;«»"'()[\]{}]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export const isValidSlug = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= 80;

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : "";
}

/** Normaliza lo que venga del frontmatter (gray-matter) a nuestro formato. */
export function normalizeFrontmatter(data: Record<string, unknown>, slug: string): Frontmatter {
  const color = typeof data.color === "string" && data.color in ACCENTS ? (data.color as AccentName) : "cian";
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const fm: Frontmatter = {
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: toDateString(data.date),
    cover: typeof data.cover === "string" ? data.cover : "",
    color,
    tags,
  };
  const updated = toDateString(data.updated);
  if (updated) fm.updated = updated;
  if (data.draft === true) fm.draft = true;
  return fm;
}

const q = (s: string) => JSON.stringify(s);

/** Escribe el .mdx con el mismo estilo que los artículos existentes. */
export function serializePost(fm: Frontmatter, content: string): string {
  const lines = [
    "---",
    `title: ${q(fm.title.trim())}`,
    `description: ${q(fm.description.trim())}`,
    `date: ${q(fm.date)}`,
  ];
  if (fm.updated && fm.updated !== fm.date) lines.push(`updated: ${q(fm.updated)}`);
  lines.push(`cover: ${q((fm.cover || "").trim())}`);
  lines.push(`color: ${q(fm.color)}`);
  lines.push(`tags: [${fm.tags.map((t) => q(t)).join(", ")}]`);
  if (fm.draft) lines.push("draft: true");
  lines.push("---", "");
  const body = content.replace(/\r\n/g, "\n").replace(/^\n+/, "").replace(/\s+$/, "");
  return `${lines.join("\n")}\n${body}\n`;
}

export function countWords(md: string): number {
  const text = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_|~-]/g, " ");
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 200));

/** En el panel, las imágenes subidas se leen a través del API (aún no están desplegadas). */
export function adminMediaSrc(src?: string): string | undefined {
  if (!src) return src;
  if (src.startsWith(`${MEDIA_URL}/`)) {
    return `/api/admin/media/file?path=${encodeURIComponent(`public${src}`)}`;
  }
  return src;
}

export function commitMessage(kind: "borrador" | "publica" | "actualiza" | "programa" | "despublica" | "elimina", title: string, extra = "") {
  const verb = {
    borrador: "guarda borrador",
    publica: "publica",
    actualiza: "actualiza",
    programa: "programa",
    despublica: "pasa a borrador",
    elimina: "elimina",
  }[kind];
  return `blog: ${verb} «${title}»${extra ? ` ${extra}` : ""}`;
}

/** Temas ordenados por uso, para sugerirlos en el editor. */
export function rankTags(tags: string[]): string[] {
  const m = new Map<string, number>();
  for (const t of tags) m.set(t, (m.get(t) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es")).map(([t]) => t);
}
