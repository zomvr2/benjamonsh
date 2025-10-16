import { formatReadingTime } from "@/lib/time";

export default function BlogHeader({ data, rt }: { data: any; rt: number }) {
  return (
    <>
      <section className="relative overflow-hidden rounded-2xl">
        <img
          src={data.cover}
          alt={data.title}
          className="w-full h-[360px] sm:h-[420px] md:h-[60dvh] lg:h-[80dvh] object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-3/4 bg-gradient-to-t from-black via-black/70 to-transparent sm:block" />
        <div className="absolute inset-0 hidden flex-col justify-end p-6 sm:flex sm:p-7 md:p-8">
          <div className="flex flex-col gap-3 max-w-full sm:max-w-2xl">
            <h1 className="text-white font-black text-3xl sm:text-4xl md:text-5xl leading-tight">{data.title}</h1>
            <p className="text-[#BDBDBD] font-normal text-sm sm:text-base md:text-lg">{data.description}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            <span className="flex h-10 flex-row items-center justify-center rounded-lg border border-[#333333] bg-black/30 px-3 font-normal text-sm text-[#D4D4D4] sm:px-4 sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline mr-1"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                <path d="M12 7v5l3 3" />
              </svg>
              <span className="text-white text-sm sm:text-base/1">{formatReadingTime(rt)}</span>
            </span>
            <span className="flex h-10 flex-row items-center justify-center rounded-lg border border-[#333333] bg-black/30 px-3 font-normal text-sm text-[#D4D4D4] sm:px-4 sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline mr-1"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M4 11h16" />
                <path d="M11 15h1" />
                <path d="M12 15v3" />
              </svg>
              <span className="text-white text-sm sm:text-base/1">{data.date}</span>
            </span>
            {data.tags.map((tag: string) => (
              <a
                href={`/blog/tags/${tag}`}
                key={tag}
                className="hidden h-10 items-center justify-center rounded-lg border border-[#6C48C5] bg-black/30 px-3 font-normal text-sm text-[#D4D4D4] sm:flex sm:px-4 sm:text-base"
              >
                <p className="text-[#C68FE6] text-sm sm:text-base/1">#{tag.toUpperCase()}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <div className="mt-5 flex flex-col gap-4 sm:hidden">
        <div className="flex flex-col gap-3">
          <h1 className="text-black font-black text-3xl leading-tight">{data.title}</h1>
          <p className="text-gray-600 font-normal text-sm">{data.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="flex h-10 flex-row items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-3 font-normal text-sm text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline mr-1"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M12 7v5l3 3" />
            </svg>
            <span className="text-gray-900 text-sm">{formatReadingTime(rt)}</span>
          </span>
          <span className="flex h-10 flex-row items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-3 font-normal text-sm text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline mr-1"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
              <path d="M16 3v4" />
              <path d="M8 3v4" />
              <path d="M4 11h16" />
              <path d="M11 15h1" />
              <path d="M12 15v3" />
            </svg>
            <span className="text-gray-900 text-sm">{data.date}</span>
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
        {
          data.tags.map((tag: string) => (
            <a
              href={`/blog/tags/${tag}`}
              key={`${tag}-mobile`}
              className="flex h-10 flex-row items-center justify-center rounded-lg border border-purple-300 bg-purple-100 px-3 font-normal text-sm text-purple-800"
            >
              <p className="text-purple-900 text-sm">#{tag.toUpperCase()}</p>
            </a>
          ))
        }
      </div>
    </>
  );
}