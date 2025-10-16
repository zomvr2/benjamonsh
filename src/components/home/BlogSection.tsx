import { getAllPosts } from "@/lib/blogFunctions";
import BlogCarousel from "@/components/home/BlogCarousel";

export default function BlogSection() {
  const posts = getAllPosts().slice(0, 10);

  return <BlogCarousel posts={posts} />
}