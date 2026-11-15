import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { useMDXComponents } from "@/mdx-components";
import BlogHeader from "@/components/blog/blogHeader";
import ContactBand from "@/components/ContactBand";
import { getAllPosts, getPost } from "@/lib/blogFunctions";
import { escapeStrayLt, postHeadings } from "@/lib/blogShared";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const { title, description, cover, tags, date, updated, slug } = post;
  return {
    title,
    description,
    keywords: tags,
    authors: [{ name: "Benjamín Delgado" }],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title, description,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: "benjamonsh",
      locale: "es_CL",
      type: "article",
      publishedTime: date,
      modifiedTime: updated || date,
      authors: ["Benjamín Delgado"],
      tags,
      images: cover ? [{ url: cover, alt: title }] : [],
    },
    twitter: { card: "summary_large_image", title, description, creator: "@benjamonsh", images: cover ? [cover] : [] },
  };
}

export default async function BlogPage({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  // useMDXComponents is the standard @next/mdx convention name (mdx-components.tsx),
  // not a React hook — it's a plain function safe to call in this Server Component.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const components = useMDXComponents();

  const headings = postHeadings(post.content);
  const toc = headings.length > 1 && (
    <ol>{headings.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
  );

  const posts = getAllPosts();
  const i = posts.findIndex((p) => p.slug === post.slug);
  const newer = i > 0 ? posts[i - 1] : null;
  const older = i + 1 < posts.length ? posts[i + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    image: post.cover ? new URL(post.cover, SITE_URL).href : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: "Benjamín Delgado", url: SITE_URL },
  };

  return (
    <>
      <article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <BlogHeader post={post} />
        <div className="wrap post-layout">
          {toc && (
            <nav className="toc toc-side" aria-label="Contenido del artículo">
              <p className="toc-title">En este artículo</p>
              {toc}
            </nav>
          )}
          <div className="sheet">
            <div className="prose">
            {toc && (
              <details className="toc toc-inline">
                <summary className="toc-title">En este artículo</summary>
                {toc}
              </details>
            )}
            <MDXRemote source={escapeStrayLt(post.content)} components={components}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
          </div>
        </div>
      </article>
      {(older || newer) && (
        <nav className="wrap" aria-label="Más artículos">
          <div className="post-nav">
            {older && <Link href={`/blog/${older.slug}`}><small>← anterior</small><strong>{older.title}</strong></Link>}
            {newer && <Link href={`/blog/${newer.slug}`}><small>siguiente →</small><strong>{newer.title}</strong></Link>}
          </div>
        </nav>
      )}
      <ContactBand />
    </>
  );
}
