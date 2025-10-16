"use client";
import { PostMeta } from "@/lib/blogFunctions";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";

interface BlogCarouselProps {
  posts: PostMeta[];
}

export default function BlogCarousel({ posts }: BlogCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: "center" });

  return (
    <section className="embla -mx-5 md:-mx-[60px]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="embla__viewport overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} scroll={true} className="group embla__slide flex-[0_0_90%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_40%] min-w-0">
            <article
              className="
                relative rounded-3xl overflow-hidden
                bg-neutral-900/80 hover:bg-neutral-800
                transition-all duration-300 ease-out
                shadow-lg hover:shadow-2xl
                cursor-pointer
              "
            >
              {post.cover && (
                <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 w-full">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="select-none w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent rounded-3xl" />
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-6 text-white z-10">
                <p className="select-none text-xs sm:text-sm text-gray-300">{post.date}</p>
                <h2 className="select-none font-extrabold text-xl sm:text-2xl md:text-3xl leading-tight mt-1 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="select-none text-sm sm:text-base text-gray-400 line-clamp-1 mt-2">
                  {post.description}
                </p>
              </div>
            </article>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
