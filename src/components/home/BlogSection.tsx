import Link from "next/link";
import { getAllPosts } from "@/lib/blogFunctions";
import PostList from "@/components/blog/PostList";

export default function BlogSection() {
  const posts = getAllPosts();
  return (
    <section className="wrap section" id="blog" aria-labelledby="blog-t" style={{ paddingTop: 0 }}>
      <div className="strip"><span id="blog-t">Blog</span><span>{posts.length} artículos</span></div>
      <h2 className="section-title">Escribo sobre lo que me interesa.</h2>
      <PostList posts={posts.slice(0, 4)} showTags={false} />
      <Link className="more" href="/blog">Ver todos los artículos</Link>
    </section>
  );
}
