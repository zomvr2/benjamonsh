// Dónde viven los artículos: en GitHub (producción) o en tu disco (npm run dev sin token).
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { CONTENT_PATH, MEDIA_PATH, type MediaItem } from "@/lib/admin/shared";

export interface RepoFile { path: string; sha: string; text: string }
export interface FileChange { path: string; text?: string; base64?: string; delete?: boolean }
export interface CommitInfo { sha: string; url?: string }

export interface Storage {
  mode: "github" | "local";
  label: string;
  listTexts(dir: string): Promise<RepoFile[]>;
  readFile(filePath: string): Promise<RepoFile | null>;
  readBinary(filePath: string): Promise<Buffer | null>;
  listMedia(): Promise<MediaItem[]>;
  commit(changes: FileChange[], message: string): Promise<CommitInfo>;
}

export class StorageError extends Error {
  constructor(message: string, public status = 500) { super(message); }
}

const gitBlobSha = (buf: Buffer) =>
  createHash("sha1").update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest("hex");

const toMedia = (p: string, size: number): MediaItem => {
  const rel = p.slice(MEDIA_PATH.length + 1);
  const parts = rel.split("/");
  return { path: p, url: `/${p.replace(/^public\//, "")}`, folder: parts.length > 1 ? parts[0] : "", name: parts[parts.length - 1], size };
};

const API = process.env.GITHUB_API_URL || "https://api.github.com";

const IMAGE_RE = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

/* ------------------------------------------------------------------ */
/* GitHub                                                             */
/* ------------------------------------------------------------------ */

class GitHubStorage implements Storage {
  mode = "github" as const;
  private owner: string;
  private name: string;
  constructor(private token: string, private repo: string, private branch: string) {
    [this.owner, this.name] = repo.split("/");
    this.label = `${repo}@${branch}`;
  }
  label: string;

  private async api<T>(url: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(url.startsWith("http") ? url : `${API}${url}`, {
      ...init,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "benjamonsh-admin",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      let msg = body;
      try { msg = JSON.parse(body).message ?? body; } catch { /* texto plano */ }
      const hint = res.status === 401 ? " (revisa GITHUB_TOKEN)" : res.status === 403 || res.status === 404 ? " (el token necesita permiso Contents: read and write sobre el repo)" : "";
      throw new StorageError(`GitHub ${res.status}: ${msg}${hint}`, res.status === 409 || res.status === 422 ? 409 : res.status === 404 ? 404 : 502);
    }
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
  }

  private async graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    const out = await this.api<{ data: T; errors?: { message: string }[] }>("/graphql", {
      method: "POST",
      body: JSON.stringify({ query, variables }),
    });
    if (out.errors?.length) throw new StorageError(`GitHub: ${out.errors[0].message}`);
    return out.data;
  }

  async listTexts(dir: string): Promise<RepoFile[]> {
    type Entry = { name: string; type: string; oid: string; object: { text: string | null } | null };
    const data = await this.graphql<{ repository: { object: { entries: Entry[] } | null } | null }>(
      `query($owner:String!,$name:String!,$expr:String!){repository(owner:$owner,name:$name){object(expression:$expr){... on Tree{entries{name type oid object{... on Blob{text}}}}}}}`,
      { owner: this.owner, name: this.name, expr: `${this.branch}:${dir}` },
    );
    if (!data.repository) throw new StorageError(`No encuentro el repo ${this.repo}.`, 404);
    return (data.repository.object?.entries ?? [])
      .filter((e) => e.type === "blob")
      .map((e) => ({ path: `${dir}/${e.name}`, sha: e.oid, text: e.object?.text ?? "" }));
  }

  async readFile(filePath: string): Promise<RepoFile | null> {
    try {
      const f = await this.api<{ sha: string; content: string; encoding: string }>(
        `/repos/${this.repo}/contents/${encodePath(filePath)}?ref=${encodeURIComponent(this.branch)}`,
      );
      return { path: filePath, sha: f.sha, text: Buffer.from(f.content, "base64").toString("utf8") };
    } catch (e) {
      if (e instanceof StorageError && e.status === 404) return null;
      throw e;
    }
  }

  async readBinary(filePath: string): Promise<Buffer | null> {
    const res = await fetch(`${API}/repos/${this.repo}/contents/${encodePath(filePath)}?ref=${encodeURIComponent(this.branch)}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${this.token}`, Accept: "application/vnd.github.raw+json", "User-Agent": "benjamonsh-admin" },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new StorageError(`GitHub ${res.status} al leer ${filePath}`, 502);
    return Buffer.from(await res.arrayBuffer());
  }

  async listMedia(): Promise<MediaItem[]> {
    type Leaf = { name: string; type: string; object: { byteSize?: number; entries?: Leaf[] } | null };
    const data = await this.graphql<{ repository: { object: { entries: Leaf[] } | null } }>(
      `query($owner:String!,$name:String!,$expr:String!){repository(owner:$owner,name:$name){object(expression:$expr){... on Tree{entries{name type object{... on Blob{byteSize} ... on Tree{entries{name type object{... on Blob{byteSize}}}}}}}}}}`,
      { owner: this.owner, name: this.name, expr: `${this.branch}:${MEDIA_PATH}` },
    );
    const out: MediaItem[] = [];
    for (const e of data.repository.object?.entries ?? []) {
      if (e.type === "blob" && IMAGE_RE.test(e.name)) out.push(toMedia(`${MEDIA_PATH}/${e.name}`, e.object?.byteSize ?? 0));
      if (e.type === "tree") {
        for (const f of e.object?.entries ?? []) {
          if (f.type === "blob" && IMAGE_RE.test(f.name)) out.push(toMedia(`${MEDIA_PATH}/${e.name}/${f.name}`, f.object?.byteSize ?? 0));
        }
      }
    }
    return out;
  }

  /** Un solo commit con todos los cambios (Git Data API). */
  async commit(changes: FileChange[], message: string): Promise<CommitInfo> {
    for (let attempt = 0; attempt < 3; attempt++) {
      const ref = await this.api<{ object: { sha: string } }>(`/repos/${this.repo}/git/ref/heads/${encodeURIComponent(this.branch)}`);
      const parent = await this.api<{ tree: { sha: string } }>(`/repos/${this.repo}/git/commits/${ref.object.sha}`);
      const tree = await Promise.all(changes.map(async (c) => {
        if (c.delete) return { path: c.path, mode: "100644", type: "blob", sha: null };
        if (c.base64 !== undefined) {
          const blob = await this.api<{ sha: string }>(`/repos/${this.repo}/git/blobs`, {
            method: "POST", body: JSON.stringify({ content: c.base64, encoding: "base64" }),
          });
          return { path: c.path, mode: "100644", type: "blob", sha: blob.sha };
        }
        return { path: c.path, mode: "100644", type: "blob", content: c.text ?? "" };
      }));
      const newTree = await this.api<{ sha: string }>(`/repos/${this.repo}/git/trees`, {
        method: "POST", body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
      });
      const commit = await this.api<{ sha: string; html_url: string }>(`/repos/${this.repo}/git/commits`, {
        method: "POST", body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
      });
      try {
        await this.api(`/repos/${this.repo}/git/refs/heads/${encodeURIComponent(this.branch)}`, {
          method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }),
        });
        return { sha: commit.sha, url: commit.html_url };
      } catch (e) {
        // Alguien empujó entre medio: reintenta sobre el nuevo HEAD.
        if (e instanceof StorageError && e.status === 409 && attempt < 2) continue;
        throw e;
      }
    }
    throw new StorageError("No se pudo crear el commit.");
  }
}

const encodePath = (p: string) => p.split("/").map(encodeURIComponent).join("/");

/* ------------------------------------------------------------------ */
/* Local (solo desarrollo)                                            */
/* ------------------------------------------------------------------ */

class LocalStorage implements Storage {
  mode = "local" as const;
  label = "Disco local (npm run dev)";
  private root = process.cwd();

  private abs(p: string) {
    const full = path.resolve(this.root, p);
    const allowed = ["src/content", "src/data", MEDIA_PATH].map((d) => path.resolve(this.root, d));
    if (!allowed.some((d) => full.startsWith(d))) {
      throw new StorageError("Ruta no permitida.", 400);
    }
    return full;
  }

  async listTexts(dir: string): Promise<RepoFile[]> {
    const full = this.abs(dir);
    const names = await fs.readdir(full).catch(() => [] as string[]);
    return Promise.all(names.map(async (n) => {
      const buf = await fs.readFile(path.join(full, n));
      return { path: `${dir}/${n}`, sha: gitBlobSha(buf), text: buf.toString("utf8") };
    }));
  }

  async readFile(filePath: string): Promise<RepoFile | null> {
    const buf = await fs.readFile(this.abs(filePath)).catch(() => null);
    return buf ? { path: filePath, sha: gitBlobSha(buf), text: buf.toString("utf8") } : null;
  }

  async readBinary(filePath: string): Promise<Buffer | null> {
    return fs.readFile(this.abs(filePath)).catch(() => null);
  }

  async listMedia(): Promise<MediaItem[]> {
    const base = this.abs(MEDIA_PATH);
    const out: MediaItem[] = [];
    const walk = async (dir: string, depth: number) => {
      for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
        const full = path.join(dir, e.name);
        if (e.isDirectory() && depth < 1) await walk(full, depth + 1);
        else if (e.isFile() && IMAGE_RE.test(e.name)) {
          const rel = path.relative(this.root, full).split(path.sep).join("/");
          out.push(toMedia(rel, (await fs.stat(full)).size));
        }
      }
    };
    await walk(base, 0);
    return out;
  }

  async commit(changes: FileChange[]): Promise<CommitInfo> {
    for (const c of changes) {
      const full = this.abs(c.path);
      if (c.delete) { await fs.rm(full, { force: true }); continue; }
      await fs.mkdir(path.dirname(full), { recursive: true });
      await fs.writeFile(full, c.base64 !== undefined ? Buffer.from(c.base64, "base64") : (c.text ?? ""));
    }
    return { sha: "local" };
  }
}

/* ------------------------------------------------------------------ */

let cached: Storage | null = null;

export function getStorage(): Storage {
  if (cached) return cached;
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    cached = new GitHubStorage(token, process.env.GITHUB_REPO || "zomvr2/benjamonsh", process.env.GITHUB_BRANCH || "master");
  } else if (process.env.NODE_ENV !== "production" || process.env.ADMIN_LOCAL_STORAGE === "1") {
    cached = new LocalStorage();
  } else {
    throw new StorageError("Falta GITHUB_TOKEN en las variables de entorno de Vercel.", 500);
  }
  return cached;
}

export const postPath = (slug: string) => `${CONTENT_PATH}/${slug}.mdx`;
