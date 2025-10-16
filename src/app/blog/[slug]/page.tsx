import { formatReadingTime } from "@/lib/time";

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

  const rt = readingTime(content);

  return (
    <main className="px-5 md:px-[60px]">
      <div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent rounded-2xl" />
          <img src={data.cover} alt={data.title} className="w-full max-h-[80dvh] object-cover rounded-2xl" />
          <div className="absolute bottom-0 left-0 p-8">
            <div className="flex flex-col gap-2.5">
              <h1 className="text-white font-black text-5xl">{data.title}</h1>
              <p className="text-[#A3A3A3] font-normal text-base">{data.description}</p>
            </div>
            <div className="flex flex-row gap-2 mt-4">
              <span className="flex flex-row items-center justify-center font-normal text-base text-[#A3A3A3] bg-black/30 border border-[#333333] py-1 px-4 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <span className="text-white text-base/1">{formatReadingTime(rt.time)}</span>
              </span>
              <span className="flex flex-row items-center justify-center font-normal text-base text-[#A3A3A3] bg-black/30 border border-[#333333] py-1 px-4 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                  <path d="M16 3v4" />
                  <path d="M8 3v4" />
                  <path d="M4 11h16" />
                  <path d="M11 15h1" />
                  <path d="M12 15v3" />
                </svg>
                <span className="text-white text-base/1">{data.date}</span>
              </span>
              {
                data.tags.map((tag: string) => (
                  <a href={`/blog/tags/${tag}`} key={tag} className="flex flex-row items-center justify-center font-normal text-base text-[#A3A3A3] bg-black/30 border border-[#6C48C5] py-1 px-4 rounded-lg">
                    <p className="text-[#C68FE6] text-base/1">#{tag.toUpperCase()}</p>
                  </a>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      <section className="max-w-[1024px] mx-auto py-7">
        <MDXRemote source={content} />
      </section>
    </main>
  );
}