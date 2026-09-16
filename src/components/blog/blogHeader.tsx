import Link from "next/link";
import { ACCENTS, type PostMeta } from "@/lib/blogShared";
import { formatDate, formatReadingTime } from "@/lib/time";
import TagList from "@/components/blog/TagList";

export default function BlogHeader({ post }: { post: PostMeta }) {
  const accent = ACCENTS[post.color];
  return (
    <>
      <header className="post-hero" style={{ "--accent": accent.bg, "--on-accent": accent.fg } as React.CSSProperties}>
        <div className="wrap">
          <div className="strip">
            <Link href="/blog">Blog</Link>
            <span>{formatReadingTime(post.readingTime)}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="lede">{post.description}</p>
          <div className="post-meta">
            <span>Por Benjamín Delgado</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <TagList tags={post.tags} />
          </div>
        </div>
      </header>
      {post.cover && (
        <figure className="cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt="" />
        </figure>
      )}
    </>
  );
}
