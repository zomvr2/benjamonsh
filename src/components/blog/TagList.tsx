import Link from "next/link";

export default function TagList({ tags, current, style }: { tags: string[]; current?: string; style?: React.CSSProperties }) {
  return (
    <ul className="tags" style={style}>
      {tags.map((t) => (
        <li key={t}>
          <Link className="tag" href={`/blog/tags/${encodeURIComponent(t)}`} aria-current={current === t ? "page" : undefined}>
            #{t}
          </Link>
        </li>
      ))}
    </ul>
  );
}
