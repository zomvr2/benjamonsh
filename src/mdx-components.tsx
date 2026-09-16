import type { MDXComponents } from "mdx/types";
import { Fragment, type ReactNode } from "react";

// Resaltado mínimo: comentarios en gris y cadenas en blanco. Un solo color por pieza.
function highlight(code: string): ReactNode[] {
  const token = /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(#[^\n]*|\/\/[^\n]*)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = token.exec(code))) {
    if (m.index > last) out.push(<Fragment key={`t${last}`}>{code.slice(last, m.index)}</Fragment>);
    out.push(<span key={`s${m.index}`} className={m[1] ? "s" : "c"}>{m[0]}</span>);
    last = token.lastIndex;
  }
  if (last < code.length) out.push(<Fragment key={`t${last}`}>{code.slice(last)}</Fragment>);
  return out;
}

const components: MDXComponents = {
  code: ({ className, children, ...props }) => {
    if (className?.startsWith("language-") && typeof children === "string") {
      return <code className={className} {...props}>{highlight(children.replace(/\n$/, ""))}</code>;
    }
    return <code className={className} {...props}>{children}</code>;
  },
  table: ({ children }) => (
    <div className="table-scroll"><table>{children}</table></div>
  ),
  img: ({ alt, src }) => (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ""} style={{ filter: "grayscale(1)" }} />
      {alt && <figcaption className="hint" style={{ marginTop: ".5rem" }}>{alt}</figcaption>}
    </figure>
  ),
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>;
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
