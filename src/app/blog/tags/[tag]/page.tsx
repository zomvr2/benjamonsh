import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import PostList from "@/components/blog/PostList";
import TagList from "@/components/blog/TagList";
import { getAllTags, getPostsByTag } from "@/lib/blogFunctions";

type Params = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const tag = decodeURIComponent((await params).tag);
  return {
    title: `#${tag}`,
    description: `Artículos sobre ${tag}.`,
    alternates: { canonical: `/blog/tags/${encodeURIComponent(tag)}` },
  };
}

export default async function TagPage({ params }: Params) {
  const tag = decodeURIComponent((await params).tag);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();
  return (
    <>
      <PageHead crumb={<><Link href="/blog">blog</Link> · {posts.length} {posts.length === 1 ? "artículo" : "artículos"}</>} title={`#${tag}`}>
        <nav aria-label="Temas"><TagList tags={getAllTags()} current={tag} /></nav>
      </PageHead>
      <section className="wrap section" style={{ paddingTop: "clamp(1.5rem, 4vw, 3rem)" }}>
        <PostList posts={posts} heading="h2" />
        <div style={{ textAlign: "center" }}><Link className="more" href="/blog">ver todos los artículos</Link></div>
      </section>
    </>
  );
}
