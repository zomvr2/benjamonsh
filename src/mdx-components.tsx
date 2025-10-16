import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="flex flex-row gap-2 items-center text-3xl font-extrabold my-4">
      <div className="self-stretch w-1 bg-[#6C48C5] rounded" />
      <span>{children}</span>
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mb-4">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="font-normal text-lg mb-2">{children}</p>
  ),
  em: ({ children }) => (
    <em className="italic text-[#6C48C5] font-medium">{children}</em>
  ),
  hr: () => (
    <hr className="border-t border-gray-300 my-6" />
  ),
  ol: ({ children }) => (
    <ol className="list-none flex flex-col gap-1 ml-3 my-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex flex-row gap-2">
      <span className="font-bold text-[#C68FE6]">•</span>
      <span className="font-normal text-lg">{children}</span>
    </li>
  ),
  img: ({ alt, src }) => (
    <span className="inline-block my-6 w-full">
      <img src={src} alt={alt} className="rounded-xl mx-auto block" />
      <span className="block text-center text-sm text-gray-600 mt-2">{alt}</span>
    </span>
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}