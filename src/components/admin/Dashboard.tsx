"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/time";
import { ACCENTS, adminMediaSrc, readingMinutes, type AdminPostSummary, type PostStatus } from "@/lib/admin/shared";
import type { PanelEnv } from "@/lib/admin/env";
import { api, scoreClass, STATUS_LABEL } from "@/components/admin/client";
import Toast, { type ToastState } from "@/components/admin/Toast";

type Filter = "todos" | PostStatus;

export default function Dashboard({ posts, env, error }: { posts: AdminPostSummary[]; env: PanelEnv; error?: string }) {
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<"fecha" | "titulo" | "puntaje">("fecha");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [deploying, setDeploying] = useState(false);

  const counts = useMemo(() => {
    const c = { todos: posts.length, publicado: 0, programado: 0, borrador: 0 };
    for (const p of posts) c[p.status]++;
    return c;
  }, [posts]);

  const tags = useMemo(() => {
    const m = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"));
  }, [posts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = posts.filter((p) =>
      (filter === "todos" || p.status === filter) &&
      (!tag || p.tags.includes(tag)) &&
      (!q || `${p.title} ${p.description} ${p.slug} ${p.tags.join(" ")}`.toLowerCase().includes(q)),
    );
    return list.sort((a, b) =>
      sort === "titulo" ? a.title.localeCompare(b.title, "es")
        : sort === "puntaje" ? a.score - b.score
        : (b.date || "").localeCompare(a.date || ""));
  }, [posts, filter, tag, query, sort]);

  const published = posts.filter((p) => p.status === "publicado");
  const totalWords = posts.reduce((s, p) => s + p.words, 0);
  const avgScore = posts.length ? Math.round(posts.reduce((s, p) => s + p.score, 0) / posts.length) : 0;
  const next = posts.filter((p) => p.status === "programado").sort((a, b) => a.date.localeCompare(b.date))[0];
  const last = published[0];

  async function deployNow() {
    setDeploying(true);
    try {
      await api("/api/admin/deploy", { method: "POST" });
      setToast({ text: "Deploy pedido a Vercel. Tarda un par de minutos." });
    } catch (e) {
      setToast({ text: (e as Error).message, error: true });
    } finally {
      setDeploying(false);
    }
  }

  return (
    <main className="wrap adm-main">
      <div className="strip" style={{ marginTop: "2rem" }}>
        <span>{env.mode === "github" ? <>Conectado a <a href={env.repoUrl} target="_blank" rel="noopener noreferrer">{env.label}</a></> : env.label}</span>
        <span>{last ? `Último: ${formatDate(last.date)}` : "Sin publicaciones"}</span>
      </div>
      <h1 className="adm-title">Blog.</h1>
      <p className="adm-sub">
        {next
          ? <>Próximo en salir: <strong>{next.title}</strong>, el {formatDate(next.date)}.</>
          : "Escribe, revisa el checklist y publica. Vercel despliega solo."}
      </p>

      {error && (
        <div className="notice notice--error">
          {error}
          {env.mode === "error" && (
            <ul>
              <li><code>GITHUB_TOKEN</code>: token fine-grained con permiso «Contents: read and write» sobre el repo.</li>
              <li><code>GITHUB_REPO</code> (opcional): por defecto <code>zomvr2/benjamonsh</code>.</li>
              <li><code>GITHUB_BRANCH</code> (opcional): por defecto <code>master</code>.</li>
            </ul>
          )}
        </div>
      )}

      <dl className="stats">
        <div><dt>Publicados</dt><dd>{counts.publicado}</dd></div>
        <div><dt>Programados</dt><dd>{counts.programado}</dd></div>
        <div><dt>Borradores</dt><dd>{counts.borrador}</dd></div>
        <div><dt>Palabras</dt><dd>{totalWords.toLocaleString("es-CL")}<small>· {avgScore} pts prom.</small></dd></div>
      </dl>

      <div className="toolbar">
        <div className="seg" role="group" aria-label="Estado">
          {(["todos", "publicado", "programado", "borrador"] as Filter[]).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === "todos" ? "Todos" : STATUS_LABEL[f] + "s"}<span className="n">{counts[f]}</span>
            </button>
          ))}
        </div>
        <input className="input input--sm search" type="search" placeholder="Buscar por título, tema o URL…"
          value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Buscar" />
        <select className="input input--sm" style={{ width: "auto" }} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Ordenar">
          <option value="fecha">Más recientes</option>
          <option value="titulo">Por título</option>
          <option value="puntaje">Peor checklist primero</option>
        </select>
        {env.deployHook && (
          <button type="button" className="btn btn--line btn--sm" onClick={deployNow} disabled={deploying}>
            {deploying ? <><span className="spin" /> Desplegando…</> : "Desplegar ahora"}
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="tagcloud" role="group" aria-label="Filtrar por tema" style={{ marginBottom: "1.5rem" }}>
          {tags.map(([t, n]) => (
            <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>
              #{t}<span className="n">{n}</span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="empty">
          <strong>{posts.length ? "Nada con esos filtros." : "Todavía no hay artículos."}</strong>
          {posts.length ? "Prueba con otro estado o tema." : <>Crea el primero con <Link href="/admin/nuevo">Nuevo artículo</Link>.</>}
        </div>
      ) : (
        <table className="ptable">
          <thead>
            <tr>
              <th style={{ width: "5.5rem" }}><span className="visually-hidden">Portada</span></th>
              <th>Artículo</th>
              <th>Estado</th>
              <th className="hide-sm">Fecha</th>
              <th className="hide-sm">Lectura</th>
              <th className="hide-sm" title="Checklist SEO y marca">Checklist</th>
              <th><span className="visually-hidden">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.slug}>
                <td>
                  {p.cover
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img className="thumb" src={adminMediaSrc(p.cover)} alt="" loading="lazy" />
                    : <div className="thumb thumb--empty">;)</div>}
                </td>
                <td>
                  <Link className="t" href={`/admin/editar/${p.slug}`}>{p.title}</Link>
                  <p className="d">{p.description || "Sin descripción"}</p>
                  <p className="d" style={{ fontSize: ".8125rem" }}>
                    <span className="swatch" style={{ background: ACCENTS[p.color].bg }} />
                    /blog/{p.slug}{p.tags.length > 0 && <> · {p.tags.map((t) => `#${t}`).join(" ")}</>}
                  </p>
                </td>
                <td><span className={`badge badge--${p.status}`}>{STATUS_LABEL[p.status]}</span></td>
                <td className="num hide-sm">{p.date ? formatDate(p.date) : "—"}{p.updated && <div className="d">edit. {formatDate(p.updated)}</div>}</td>
                <td className="num hide-sm">{readingMinutes(p.words)} min<div className="d">{p.words} pal.</div></td>
                <td className="num hide-sm"><span className={`score ${scoreClass(p.score)}`}>{p.score}</span><span className="d"> /100</span></td>
                <td className="acts">
                  <Link href={`/admin/editar/${p.slug}`}>Editar</Link>
                  {p.status === "publicado" && <a href={`/blog/${p.slug}`} target="_blank" rel="noopener">Ver ↗</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {env.mode === "github" && (!env.deployHook || !env.cron) && (
        <div className="notice">
          <strong>Para que los programados salgan solos</strong>, agrega en Vercel
          {!env.deployHook && <> <code>VERCEL_DEPLOY_HOOK_URL</code> (Settings → Git → Deploy Hooks)</>}
          {!env.deployHook && !env.cron && " y"}
          {!env.cron && <> <code>CRON_SECRET</code></>}.
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}
