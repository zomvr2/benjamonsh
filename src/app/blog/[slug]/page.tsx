import { useMDXComponents } from "@/mdx-components";
import BlogHeader from "@/components/blog/blogHeader";

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import readingTime from "reading-time";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src", "content", `${slug}.mdx`);
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { data } = matter(fileContent);

  const title = data.title || "Untitled";
  const description = data.description || "Blog post description";
  const cover = data.cover;
  const tags = data.tags || [];
  const date = data.date;

  return {
    title,
    description,
    keywords: tags,
    authors: [{ name: "Benjamin Delgado" }],
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://benjamonsh.vercel.app/blog/${slug}`,
      siteName: "Benjamonsh",
      locale: "es_CL",
      type: "article",
      publishedTime: date,
      modifiedTime: date,
      authors: ["Benjamin Delgado"],
      tags,
      images: cover ? [{
        url: cover,
        alt: title,
      }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@benjamonsh",
      images: cover ? [cover] : [],
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src", "content", `${slug}.mdx`);
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const components = useMDXComponents();

  const rt = readingTime(content).time;

  return (
    <main className="px-5 md:px-[60px]">
      <BlogHeader data={data} rt={rt} />
      <section className="max-w-[1024px] mx-auto py-7">
        <MDXRemote source={content} components={components} />
      </section>
    </main>
  );
}