import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

export interface PostMeta {
  slug: string;
  title: string;
  description?: string;
  date: string;
  cover?: string;
  tags: string[];
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'));
  return files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '');
    const fullPath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date || '',
      cover: data.cover || '',
      tags: data.tags || [],
    } as PostMeta;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}