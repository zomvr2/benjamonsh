import PageHead from "@/components/PageHead";
import PostList from "@/components/blog/PostList";
import TagList from "@/components/blog/TagList";
import { getAllPosts, getAllTags } from "@/lib/blogFunctions";

export const metadata = {
  title: "Blog",
  description: "Artículos sobre programación, música, básquet y cultura.",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  const posts = getAllPosts();
  return (
    <>
      <PageHead title="blog" lede={`Escribo sobre código, música, básquet y lo que me tenga pensando esa semana. ${posts.length} ${posts.length === 1 ? "artículo" : "artículos"} hasta ahora.`}>
        <nav aria-label="Temas"><TagList tags={getAllTags()} /></nav>
      </PageHead>
      <section className="wrap section" style={{ paddingTop: "clamp(1.5rem, 4vw, 3rem)" }}>
        <PostList posts={posts} heading="h2" />
      </section>
    </>
  );
}
