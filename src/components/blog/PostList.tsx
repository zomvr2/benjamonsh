import Link from "next/link";
import { ACCENTS, type PostMeta } from "@/lib/blogShared";
import { formatDate, formatReadingTime } from "@/lib/time";
import TagList from "@/components/blog/TagList";

// Cada artículo se muestra como una publicación mía; la barra lleva su color propio.
export default function PostList({
  posts, heading = "h3", showTags = true,
}: { posts: PostMeta[]; heading?: "h2" | "h3"; showTags?: boolean }) {
  const H = heading;
  return (
    <ol className="posts" reversed>
      {posts.map((p) => (
        <li className="post-card" key={p.slug} style={{ "--accent": ACCENTS[p.color].bg, "--on-accent": ACCENTS[p.color].fg } as React.CSSProperties}>
          <div className="post-thumb" aria-hidden="true">
            {/* Todas las tarjetas son un cartel: color del artículo + su tema en grande. La foto se queda en el artículo. */}
            {p.tags[0] && <span className="post-thumb-tag" style={{ "--len": p.tags[0].length + 1 } as React.CSSProperties}>#{p.tags[0]}</span>}
          </div>
          <div className="post-body">
            <small className="post-date"><time dateTime={p.date}>{formatDate(p.date)}</time> · {formatReadingTime(p.readingTime)}</small>
            <H><Link href={`/blog/${p.slug}`}>{p.title}</Link></H>
            <p>{p.description}</p>
            {showTags && p.tags.length > 0 && <TagList tags={p.tags.slice(0, 3)} />}
          </div>
        </li>
      ))}
    </ol>
  );
}
