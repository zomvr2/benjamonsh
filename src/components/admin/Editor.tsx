"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatDate } from "@/lib/time";
import { hasBlockingIssues, runChecks, scoreChecks } from "@/lib/admin/checks";
import {
  ACCENTS, COLOR_NAMES, adminMediaSrc, countWords, postStatus, readingMinutes, slugify, todayInChile,
  type AdminPost, type Frontmatter, type SaveResult,
} from "@/lib/admin/shared";
import type { PanelEnv } from "@/lib/admin/env";
import { api, STATUS_LABEL, uploadImage } from "@/components/admin/client";
import Preview from "@/components/admin/Preview";
import TagInput from "@/components/admin/TagInput";
import CoverField from "@/components/admin/CoverField";
import Checklist from "@/components/admin/Checklist";
import Toast, { type ToastState } from "@/components/admin/Toast";

type View = "write" | "split" | "preview";
interface Snapshot { fm: Frontmatter; slug: string; content: string }
interface Backup extends Snapshot { at: number; baseSha: string }

const snap = (s: Snapshot) => JSON.stringify([s.fm, s.slug, s.content]);
const backupKey = (slug: string | null) => `bm-admin-backup:${slug ?? "nuevo"}`;

function readBackup(key: string): Backup | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Backup) : null;
  } catch {
    return null;
  }
}
function writeBackup(key: string, b: Backup | null) {
  try {
    if (b) localStorage.setItem(key, JSON.stringify(b));
    else localStorage.removeItem(key);
  } catch { /* sin almacenamiento: no pasa nada */ }
}

export default function Editor({ initial, env, knownTags, isNew = false }: {
  initial: AdminPost; env: PanelEnv; knownTags: string[]; isNew?: boolean;
}) {
  const router = useRouter();
  const initialFm: Frontmatter = {
    title: initial.title, description: initial.description, date: initial.date, updated: initial.updated,
    cover: initial.cover ?? "", color: initial.color, tags: initial.tags, draft: initial.draft,
  };
  const [fm, setFm] = useState<Frontmatter>(initialFm);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [content, setContent] = useState(initial.content);
  const [sha, setSha] = useState(initial.sha);
  const [originalSlug, setOriginalSlug] = useState<string | null>(isNew ? null : initial.slug);
  const [savedStatus, setSavedStatus] = useState(isNew ? null : postStatus(initialFm));
  const [baseline, setBaseline] = useState(() => snap({ fm: initialFm, slug: initial.slug, content: initial.content }));
  const [view, setView] = useState<View>("split");
  const [saving, setSaving] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [backup, setBackup] = useState<Backup | null>(null);
  const [dropping, setDropping] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);

  const today = todayInChile();
  const current: Snapshot = { fm, slug, content };
  const dirty = snap(current) !== baseline;
  const status = postStatus(fm, today);
  const checks = useMemo(() => runChecks(fm, slug, content), [fm, slug, content]);
  const score = scoreChecks(checks);
  const words = useMemo(() => countWords(content), [content]);
  const outline = useMemo(() => [...content.replace(/^(```|~~~)[\s\S]*?^\1/gm, "").matchAll(/^(##|###)\s+(.+)$/gm)].map((m) => ({ level: m[1].length, text: m[2] })), [content]);
  const mediaFolder = slug || "sin-articulo";

  const set = <K extends keyof Frontmatter>(k: K, v: Frontmatter[K]) => setFm((f) => ({ ...f, [k]: v }));

  // ¿Quedaron cambios sin guardar de una sesión anterior?
  useEffect(() => {
    const t = setTimeout(() => {
      const b = readBackup(backupKey(isNew ? null : initial.slug));
      if (b && b.baseSha === initial.sha && snap(b) !== snap({ fm: initialFm, slug: initial.slug, content: initial.content })) setBackup(b);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respaldo local mientras escribes (por si se cierra la pestaña).
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => writeBackup(backupKey(originalSlug), { fm, slug, content, at: Date.now(), baseSha: sha }), 800);
    return () => clearTimeout(t);
  }, [fm, slug, content, dirty, originalSlug, sha]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Slug automático mientras el artículo es nuevo.
  function onTitle(v: string) {
    set("title", v.replace(/\n/g, " "));
    if (!slugTouched && !originalSlug) setSlug(slugify(v));
  }

  /* ---------- Guardar ---------- */
  const save = useCallback(async (override?: Partial<Frontmatter>) => {
    if (saving) return;
    const nextFm = { ...fm, ...override };
    if (uploads > 0) { setToast({ text: "Espera a que terminen de subir las imágenes.", error: true }); return; }
    const blocking = runChecks(nextFm, slug, content);
    if (hasBlockingIssues(blocking)) {
      setToast({ text: "Revisa el checklist: falta título, fecha o una URL válida.", error: true });
      return;
    }
    setSaving(true);
    try {
      const res = await api<SaveResult>("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify({ slug, originalSlug, sha: sha || null, frontmatter: nextFm, content }),
      });
      if (override) setFm(nextFm);
      const savedFm = { ...nextFm };
      setSha(res.sha);
      setSavedStatus(res.status);
      setBaseline(snap({ fm: savedFm, slug, content }));
      writeBackup(backupKey(originalSlug), null);
      writeBackup(backupKey(slug), null);
      if (originalSlug !== slug) {
        setOriginalSlug(slug);
        setSlugTouched(true);
        window.history.replaceState(null, "", `/admin/editar/${slug}`);
      }
      const msg = env.mode === "local"
        ? `Guardado en src/content/${slug}.mdx.`
        : res.status === "borrador"
          ? (res.deploys ? "Pasado a borrador. Vercel lo quitará del sitio en 1–2 min." : "Borrador guardado en GitHub (sin deploy).")
          : res.status === "programado"
            ? `Programado para el ${formatDate(nextFm.date)}.`
            : "Listo. Vercel lo pondrá en línea en 1–2 min.";
      setToast({ text: msg, href: res.commitUrl, hrefLabel: "Ver commit" });
      router.refresh();
    } catch (e) {
      setToast({ text: (e as Error).message, error: true });
    } finally {
      setSaving(false);
    }
  }, [saving, fm, uploads, slug, content, originalSlug, sha, env.mode, router]);

  async function remove() {
    if (!originalSlug) return;
    setSaving(true);
    try {
      await api(`/api/admin/posts/${originalSlug}?sha=${encodeURIComponent(sha)}`, { method: "DELETE" });
      writeBackup(backupKey(originalSlug), null);
      setBaseline(snap(current));
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setToast({ text: (e as Error).message, error: true });
      setSaving(false);
    }
  }

  /* ---------- Edición del Markdown ---------- */
  function insert(text: string, selectStart?: number, selectEnd?: number) {
    const el = ta.current;
    if (!el) return;
    el.focus();
    const start = el.selectionStart;
    // execCommand conserva el deshacer (Ctrl+Z) del navegador.
    const ok = document.execCommand?.("insertText", false, text);
    if (!ok) {
      el.setRangeText(text, el.selectionStart, el.selectionEnd, "end");
      setContent(el.value);
    }
    if (selectStart !== undefined) el.setSelectionRange(start + selectStart, start + (selectEnd ?? selectStart));
  }

  function wrap(before: string, after = before, placeholder = "texto") {
    const el = ta.current!;
    const sel = el.value.slice(el.selectionStart, el.selectionEnd) || placeholder;
    insert(`${before}${sel}${after}`, before.length, before.length + sel.length);
  }

  function linePrefix(prefix: string | ((i: number) => string)) {
    const el = ta.current!;
    const v = el.value;
    const lineStart = v.lastIndexOf("\n", el.selectionStart - 1) + 1;
    let lineEnd = v.indexOf("\n", el.selectionEnd);
    if (lineEnd === -1) lineEnd = v.length;
    el.setSelectionRange(lineStart, lineEnd);
    const lines = v.slice(lineStart, lineEnd).split("\n");
    const out = lines.map((l, i) => {
      const p = typeof prefix === "function" ? prefix(i) : prefix;
      const clean = l.replace(/^(#{1,6}\s|>\s|[-*]\s|\d+\.\s)/, "");
      return l.startsWith(p) ? clean : p + clean;
    }).join("\n");
    insert(out);
  }

  function block(text: string, cursor?: number) {
    const el = ta.current!;
    const v = el.value;
    const before = v.slice(0, el.selectionStart);
    const pre = before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    insert(`${pre}${text}\n`, cursor !== undefined ? pre.length + cursor : undefined);
  }

  function link() {
    const el = ta.current!;
    const sel = el.value.slice(el.selectionStart, el.selectionEnd) || "texto del enlace";
    insert(`[${sel}](https://)`, sel.length + 3, sel.length + 11);
  }

  async function addImages(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    for (const file of images) {
      const token = `![Subiendo ${file.name.replace(/[[\]]/g, "")}…]()`;
      block(token);
      setUploads((n) => n + 1);
      try {
        const { url } = await uploadImage(file, mediaFolder);
        setContent((c) => c.replace(token, `![Describe la imagen](${url})`));
      } catch (e) {
        setContent((c) => c.replace(`${token}\n`, "").replace(token, ""));
        setToast({ text: `No se subió ${file.name}: ${(e as Error).message}`, error: true });
      } finally {
        setUploads((n) => n - 1);
      }
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    const k = e.key.toLowerCase();
    if (k === "b") { e.preventDefault(); wrap("**"); }
    if (k === "k") { e.preventDefault(); link(); }
  }

  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const files = [...e.clipboardData.files];
    if (files.some((f) => f.type.startsWith("image/"))) {
      e.preventDefault();
      addImages(files);
      return;
    }
    const text = e.clipboardData.getData("text/plain").trim();
    const el = e.currentTarget;
    if (/^https?:\/\/\S+$/.test(text) && el.selectionStart !== el.selectionEnd) {
      e.preventDefault();
      const sel = el.value.slice(el.selectionStart, el.selectionEnd);
      insert(`[${sel}](${text})`);
    }
  }

  // Ctrl+S en cualquier parte del editor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const primaryLabel = fm.draft
    ? "Guardar borrador"
    : status === "programado"
      ? "Programar"
      : savedStatus === "publicado" ? "Actualizar" : "Publicar";

  const titleLen = fm.title.trim().length;
  const descLen = fm.description.trim().length;

  return (
    <div className="ed">
      <div className="ed-main">
        <div className="ed-bar">
          <div className="state">
            <Link href="/admin">← Artículos</Link>
            {savedStatus ? <span className={`badge badge--${savedStatus}`}>{STATUS_LABEL[savedStatus]}</span> : <span className="badge badge--borrador">Nuevo</span>}
            {dirty ? <span className="dirty">Cambios sin guardar</span> : <span>Todo guardado</span>}
            {uploads > 0 && <span><span className="spin" /> Subiendo {uploads}…</span>}
          </div>
          <div className="seg" role="group" aria-label="Vista">
            {([["write", "Escribir"], ["split", "Dividido"], ["preview", "Vista previa"]] as [View, string][]).map(([v, l]) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>{l}</button>
            ))}
          </div>
          {fm.draft && (
            <button type="button" className="btn btn--line btn--sm" disabled={saving} onClick={() => save({ draft: undefined })}>
              {fm.date > today ? "Programar" : "Publicar ahora"}
            </button>
          )}
          <button type="button" className="btn btn--sm" disabled={saving} onClick={() => save()} title="Ctrl + S">
            {saving ? <><span className="spin" /> Guardando…</> : primaryLabel}
          </button>
        </div>

        {backup && (
          <div className="notice" style={{ margin: "1rem var(--pad) 0" }}>
            Hay cambios sin guardar de este artículo del {new Date(backup.at).toLocaleString("es-CL")}.
            <div className="row" style={{ marginTop: ".6rem" }}>
              <button type="button" className="btn btn--sm" onClick={() => { setFm(backup.fm); setSlug(backup.slug); setContent(backup.content); setBackup(null); }}>Recuperar</button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => { writeBackup(backupKey(originalSlug), null); setBackup(null); }}>Descartar</button>
            </div>
          </div>
        )}

        <div className="ed-titlebox">
          <textarea className="ed-title" rows={1} placeholder="Título del artículo" value={fm.title}
            onChange={(e) => onTitle(e.target.value)} aria-label="Título" />
          <textarea className="ed-desc" rows={2} placeholder="Descripción: una o dos frases que resuman el artículo." value={fm.description}
            onChange={(e) => set("description", e.target.value.replace(/\n/g, " "))} aria-label="Descripción" />
          <div className="row" style={{ gap: "1rem", marginTop: ".5rem" }}>
            <span className={`counter${titleLen && (titleLen < 30 || titleLen > 60) ? " is-warn" : ""}`}>Título {titleLen}/60</span>
            <span className={`counter${descLen && (descLen < 70 || descLen > 160) ? " is-warn" : ""}`}>Descripción {descLen}/160</span>
            <span className="counter">{words} palabras · {readingMinutes(words)} min</span>
          </div>
        </div>

        <div className="ed-body" data-view={view}>
          <div
            className={`ed-write${dropping ? " is-drop" : ""}`}
            onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setDropping(true); } }}
            onDragLeave={() => setDropping(false)}
            onDrop={(e) => {
              setDropping(false);
              if (e.dataTransfer.files.length) { e.preventDefault(); addImages([...e.dataTransfer.files]); }
            }}
          >
            <div className="fmt" role="toolbar" aria-label="Formato">
              <button type="button" title="Sección (##)" onClick={() => linePrefix("## ")}>H2</button>
              <button type="button" title="Subsección (###)" onClick={() => linePrefix("### ")}>H3</button>
              <button type="button" title="Negrita (Ctrl+B)" onClick={() => wrap("**")}><b>B</b></button>
              <button type="button" title="Enlace (Ctrl+K)" onClick={link}>Enlace</button>
              <span className="sep" />
              <button type="button" title="Lista" onClick={() => linePrefix("- ")}>;) Lista</button>
              <button type="button" title="Lista numerada" onClick={() => linePrefix((i) => `${i + 1}. `)}>1. Lista</button>
              <button type="button" title="Cita" onClick={() => linePrefix("> ")}>Cita</button>
              <span className="sep" />
              <button type="button" className="mono" title="Código en línea" onClick={() => wrap("`", "`", "código")}>`c`</button>
              <button type="button" className="mono" title="Bloque de código" onClick={() => block("```python\n\n```", 10)}>{"{ }"}</button>
              <button type="button" title="Tabla" onClick={() => block("| Columna | Columna |\n| --- | --- |\n| Dato | Dato |")}>Tabla</button>
              <button type="button" title="Separador" onClick={() => block("---")}>—</button>
              <span className="sep" />
              <label className="btn btn--ghost btn--sm" style={{ padding: ".4rem .55rem", fontSize: ".875rem", cursor: "pointer" }} title="Subir imagen (también puedes pegar o arrastrar)">
                Imagen
                <input type="file" accept="image/*" multiple hidden onChange={(e) => { addImages([...(e.target.files ?? [])]); e.target.value = ""; }} />
              </label>
            </div>
            <textarea
              ref={ta}
              className="ed-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              spellCheck
              lang="es"
              aria-label="Contenido en Markdown"
              placeholder="Escribe en Markdown. Arrastra o pega imágenes aquí."
            />
          </div>
          {view !== "write" && <Preview fm={fm} slug={slug} content={content} />}
        </div>
      </div>

      <aside className="ed-side" aria-label="Ajustes del artículo">
        <section className="side-sec">
          <h2><span>Publicación</span><span style={{ color: "var(--soft)" }}>{STATUS_LABEL[status]}</span></h2>
          <div className="statuses" role="radiogroup" aria-label="Estado">
            <label>
              <input type="radio" name="status" checked={!!fm.draft} onChange={() => set("draft", true)} />
              <strong>Borrador</strong>
              <small>No aparece en el sitio. Se guarda sin desplegar.</small>
            </label>
            <label>
              <input type="radio" name="status" checked={!fm.draft} onChange={() => set("draft", undefined)} />
              <strong>{fm.date > today ? "Programado" : "Publicado"}</strong>
              <small>{fm.date > today ? `Sale solo el ${formatDate(fm.date)}.` : "Visible en el blog y el sitemap."}</small>
            </label>
          </div>
          <div className="field" style={{ marginTop: "1rem" }}>
            <label htmlFor="date">Fecha de publicación</label>
            <div className="row">
              <input id="date" className="input" type="date" value={fm.date} onChange={(e) => set("date", e.target.value)} />
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => set("date", today)}>Hoy</button>
            </div>
            {fm.date > today && <p className="hint">Una fecha futura lo programa. Se publica esa madrugada.</p>}
            {fm.updated && <p className="hint">Última edición: {formatDate(fm.updated)}</p>}
          </div>
          {savedStatus === "publicado" && originalSlug && (
            <p style={{ marginTop: "1rem" }}><a href={`/blog/${originalSlug}`} target="_blank" rel="noopener" style={{ fontWeight: 600 }}>Ver en el sitio ↗</a></p>
          )}
        </section>

        <section className="side-sec">
          <h2><span>Checklist</span><span>{score}/100</span></h2>
          <Checklist checks={checks} score={score} />
        </section>

        <section className="side-sec">
          <h2>URL y color</h2>
          <div className="field">
            <label htmlFor="slug">URL</label>
            <div className="slugrow">
              <span>/blog/</span>
              <input id="slug" className="input" value={slug}
                onChange={(e) => { setSlugTouched(true); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")); }}
                onBlur={() => setSlug((s) => slugify(s))} />
            </div>
            {originalSlug && slug !== originalSlug && savedStatus === "publicado" && (
              <p className="hint" style={{ color: "var(--acento-texto)" }}>Cambiar la URL de un artículo publicado rompe los enlaces que ya existen.</p>
            )}
            {!originalSlug && slugTouched && (
              <button type="button" className="btn btn--ghost btn--sm" style={{ justifySelf: "start" }} onClick={() => { setSlugTouched(false); setSlug(slugify(fm.title)); }}>Generar desde el título</button>
            )}
          </div>
          <div className="field">
            <span style={{ fontWeight: 600, fontSize: ".875rem" }}>Color del artículo</span>
            <div className="colors" role="radiogroup" aria-label="Color">
              {COLOR_NAMES.map((c) => (
                <label key={c} title={c}>
                  <input type="radio" name="color" checked={fm.color === c} onChange={() => set("color", c)} aria-label={c} />
                  <span style={{ background: ACCENTS[c].bg }} />
                </label>
              ))}
            </div>
            <p className="hint">Un solo color por pieza: {fm.color}.</p>
          </div>
        </section>

        <section className="side-sec">
          <h2><span>Temas</span><span style={{ color: "var(--soft)" }}>{fm.tags.length}/5</span></h2>
          <TagInput value={fm.tags} onChange={(t) => set("tags", t)} suggestions={knownTags} />
        </section>

        <section className="side-sec">
          <h2>Portada</h2>
          <CoverField value={fm.cover ?? ""} folder={mediaFolder} onChange={(v) => set("cover", v)}
            onError={(m) => setToast({ text: m, error: true })} onBusy={(d) => setUploads((n) => n + d)} />
        </section>

        <section className="side-sec">
          <h2>Así se verá al compartir</h2>
          <div className="serp" aria-label="Resultado en Google">
            <div className="u">benjamonsh.cl › blog › {slug || "…"}</div>
            <div className="h">{fm.title || "Título del artículo"} — benjamonsh</div>
            <div className="s">{fm.date && <>{formatDate(fm.date)} — </>}{fm.description || "Sin descripción: Google elegirá un fragmento del texto."}</div>
          </div>
          <div className="og" aria-label="Tarjeta en redes">
            <div className="img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {fm.cover ? <img src={adminMediaSrc(fm.cover)} alt="" /> : null}
            </div>
            <div className="txt"><small>benjamonsh.cl</small><strong>{fm.title || "Título del artículo"}</strong></div>
          </div>
        </section>

        <section className="side-sec">
          <h2>Estructura</h2>
          {outline.length ? (
            <ol className="outline">
              {outline.map((h, i) => <li key={i} className={h.level === 3 ? "h3" : ""}>{h.text}</li>)}
            </ol>
          ) : <p className="hint">Sin secciones todavía. Usa ## para crearlas.</p>}
          <dl className="kv" style={{ marginTop: "1rem" }}>
            <dt>Palabras</dt><dd>{words}</dd>
            <dt>Lectura</dt><dd>{readingMinutes(words)} min</dd>
            <dt>Imágenes</dt><dd>{(content.match(/!\[/g) || []).length}</dd>
            <dt>Enlaces</dt><dd>{(content.match(/(?<!!)\[[^\]]+\]\(/g) || []).length}</dd>
          </dl>
        </section>

        {originalSlug && (
          <section className="side-sec">
            <h2>Zona de peligro</h2>
            {!confirmDelete ? (
              <button type="button" className="btn btn--danger btn--sm" onClick={() => setConfirmDelete(true)}>Eliminar artículo</button>
            ) : (
              <div className="confirm">
                <p>¿Eliminar «{fm.title}» y sus imágenes? Queda en el historial de Git, pero sale del sitio.</p>
                <div className="row">
                  <button type="button" className="btn btn--sm" disabled={saving} onClick={remove}>Sí, eliminar</button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmDelete(false)}>Cancelar</button>
                </div>
              </div>
            )}
          </section>
        )}
        <p className="hint" style={{ padding: "1rem 1.25rem" }}>
          <span className="kbd">Ctrl S</span> guardar · <span className="kbd">Ctrl B</span> negrita · <span className="kbd">Ctrl K</span> enlace
        </p>
      </aside>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
