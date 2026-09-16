import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export type AccentName = "cian" | "violeta" | "ambar" | "verde";

// Cada artículo usa un único color secundario, solo en su propia página.
export const ACCENTS: Record<AccentName, { bg: string; fg: string }> = {
  cian: { bg: "var(--cian)", fg: "var(--tinta)" },
  violeta: { bg: "var(--violeta)", fg: "var(--blanco)" },
  ambar: { bg: "var(--ambar)", fg: "var(--tinta)" },
  verde: { bg: "var(--verde)", fg: "var(--tinta)" },
};

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover?: string;
  color: AccentName;
  tags: string[];
  readingTime: number;
}

export interface Post extends PostMeta {
  content: string;
}

function readPost(slug: string): Post | null {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const { data, content } = matter(fs.readFileSync(fullPath, "utf-8"));
  const color = (data.color in ACCENTS ? data.color : "cian") as AccentName;
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || "",
    cover: data.cover || "",
    color,
    tags: data.tags || [],
    readingTime: readingTime(content).time,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => readPost(f.replace(/\.mdx$/, "")))
    .filter((p): p is Post => p !== null)
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | null {
  return readPost(decodeURIComponent(slug));
}

export function getAllTags(): string[] {
  return Array.from(new Set(getAllPosts().flatMap((p) => p.tags))).sort((a, b) => a.localeCompare(b, "es"));
}

export function getPostsByTag(tag: string): PostMeta[] {
  const t = decodeURIComponent(tag);
  return getAllPosts().filter((p) => p.tags.includes(t));
}
