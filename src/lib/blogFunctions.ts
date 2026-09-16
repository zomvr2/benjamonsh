import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { ACCENTS, postStatus, type AccentName, type Post, type PostMeta } from "@/lib/blogShared";

export { ACCENTS, postStatus };
export type { AccentName, Post, PostMeta };

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : "";
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
    date: toDateString(data.date),
    updated: toDateString(data.updated) || undefined,
    cover: data.cover || "",
    color,
    tags: data.tags || [],
    draft: data.draft === true,
    readingTime: readingTime(content).time,
    content,
  };
}

// Solo lo visible: sin borradores ni artículos programados para una fecha futura.
const isVisible = (p: PostMeta) => postStatus(p) === "publicado";

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => readPost(f.replace(/\.mdx$/, "")))
    .filter((p): p is Post => p !== null && isVisible(p))
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | null {
  const post = readPost(decodeURIComponent(slug));
  return post && isVisible(post) ? post : null;
}

export function getAllTags(): string[] {
  return Array.from(new Set(getAllPosts().flatMap((p) => p.tags))).sort((a, b) => a.localeCompare(b, "es"));
}

export function getPostsByTag(tag: string): PostMeta[] {
  const t = decodeURIComponent(tag);
  return getAllPosts().filter((p) => p.tags.includes(t));
}
