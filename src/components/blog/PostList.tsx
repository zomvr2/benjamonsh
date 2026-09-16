import Link from "next/link";
import type { PostMeta } from "@/lib/blogShared";
import { formatDate, formatReadingTime } from "@/lib/time";
import TagList from "@/components/blog/TagList";

export default function PostList({
  posts, heading = "h3", showTags = true,
}: { posts: PostMeta[]; heading?: "h2" | "h3"; showTags?: boolean }) {
  const H = heading;
  return (
    <ol className="posts" reversed>
      {posts.map((p) => (
        <li className="post-row" key={p.slug}>
          <time dateTime={p.date}>{formatDate(p.date)}</time>
          <div>
            <H><Link href={`/blog/${p.slug}`}>{p.title}</Link></H>
            <p>{p.description}</p>
          </div>
          <div className="meta-side">
            <p>{formatReadingTime(p.readingTime)}</p>
            {showTags && <TagList tags={p.tags.slice(0, 3)} style={{ marginTop: ".6rem" }} />}
          </div>
        </li>
      ))}
    </ol>
  );
}
