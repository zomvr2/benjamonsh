import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/blogFunctions";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/proyectos", "/blog", "/contacto", "/enlaces"].map((p) => ({ url: `${SITE_URL}${p}` }));
  const posts = getAllPosts().map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.date }));
  const tags = getAllTags().map((t) => ({ url: `${SITE_URL}/blog/tags/${encodeURIComponent(t)}` }));
  return [...pages, ...posts, ...tags];
}
