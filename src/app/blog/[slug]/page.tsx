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

  return {
    title: data.title || "Untitled",
    description: data.description || "Blog post description",
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