"use client";

import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote";
import type { MDXComponents } from "mdx/types";
import { useMDXComponents } from "@/mdx-components";
import BlogHeader from "@/components/blog/blogHeader";
import { adminMediaSrc, countWords, type Frontmatter } from "@/lib/admin/shared";

class Boundary extends Component<{ children: ReactNode; resetKey: string }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }
  render() {
    if (this.state.error) return <div className="notice notice--error preview-error">No se pudo mostrar: {this.state.error}</div>;
    return this.props.children;
  }
}

export default function Preview({ fm, slug, content }: { fm: Frontmatter; slug: string; content: string }) {
  const [compiled, setCompiled] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const base = useMDXComponents();

  const components = useMemo<MDXComponents>(() => {
    const Img = base.img as (p: { src?: string; alt?: string }) => ReactNode;
    return { ...base, img: ({ src, alt }: { src?: string; alt?: string }) => <Img src={adminMediaSrc(typeof src === "string" ? src : undefined)} alt={alt} /> };
  }, [base]);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        const res = await fetch("/api/admin/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: content }),
          signal: ctrl.signal,
        });
        const data = await res.json();
        if (data.compiledSource) {
          setCompiled(data.compiledSource);
          setError(null);
        } else {
          setError(data.error ?? "Error al compilar");
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError((e as Error).message);
      } finally {
        if (!ctrl.signal.aborted) setBusy(false);
      }
    }, 350);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [content]);

  const words = countWords(content);
  const meta = {
    slug: slug || "nuevo-articulo",
    title: fm.title || "Sin título",
    description: fm.description,
    date: fm.date,
    cover: adminMediaSrc(fm.cover),
    color: fm.color,
    tags: fm.tags,
    readingTime: Math.max(1, Math.round(words / 200)) * 60000,
  };

  return (
    <div className="ed-preview" aria-label="Vista previa">
      <div className="preview-note">
        Vista previa con el estilo real {busy && <span className="spin" aria-label="Actualizando" />}
      </div>
      <BlogHeader post={meta} />
      <div className="wrap" style={{ padding: 0 }}>
        {error && <div className="notice notice--error preview-error">MDX con errores: {error}</div>}
        <div className="prose">
          {compiled && (
            <Boundary resetKey={compiled}>
              <MDXRemote compiledSource={compiled} scope={{}} frontmatter={{}} components={components} />
            </Boundary>
          )}
        </div>
      </div>
    </div>
  );
}
