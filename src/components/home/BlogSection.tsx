import Link from "next/link";
import { getAllPosts } from "@/lib/blogFunctions";
import PostList from "@/components/blog/PostList";

export default function BlogSection() {
  const posts = getAllPosts();
  return (
    <section className="wrap section" id="blog" aria-labelledby="blog-t" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <h2 className="section-title" id="blog-t">escribo sobre lo que me interesa</h2>
        <p>Código, música chilena, básquet y lo que me tenga pensando esa semana.</p>
      </div>
      <PostList posts={posts.slice(0, 4)} showTags={false} />
      <div style={{ textAlign: "center" }}><Link className="more" href="/blog">ver todos los artículos</Link></div>
    </section>
  );
}
