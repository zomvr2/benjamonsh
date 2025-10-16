import { getAllPosts } from "@/lib/blogFunctions";
import BlogCarousel from "@/components/home/BlogCarousel";

export default function BlogSection() {
  const posts = getAllPosts().slice(0, 10);

  return (
    <section className="py-12">
      <div className="md:max-w-[1024px] md:mx-auto mb-7">
        <h3 className="text-lg text-center md:text-left text-blue-800 font-bold">Blog</h3>
        <h2 className="text-3xl text-center md:text-left font-bold">Explorando lo que me interesa.</h2>
      </div>
      <BlogCarousel posts={posts} />
    </section>
  );
}