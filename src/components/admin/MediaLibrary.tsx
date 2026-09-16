"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { adminMediaSrc, type MediaItem } from "@/lib/admin/shared";
import { api, formatBytes, uploadImage } from "@/components/admin/client";
import Toast, { type ToastState } from "@/components/admin/Toast";

export default function MediaLibrary({ initial, error }: { initial: MediaItem[]; error?: string }) {
  const [media, setMedia] = useState(initial);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [busy, setBusy] = useState(0);
  const [confirm, setConfirm] = useState<string | null>(null);

  const groups = useMemo(() => {
    const m = new Map<string, MediaItem[]>();
    for (const i of media) m.set(i.folder || "(sueltas)", [...(m.get(i.folder || "(sueltas)") ?? []), i]);
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], "es"));
  }, [media]);
  const total = media.reduce((s, m) => s + m.size, 0);

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ text: `${label} copiado.` });
    } catch {
      setToast({ text: text });
    }
  }

  async function upload(files: FileList | null) {
    for (const f of [...(files ?? [])]) {
      setBusy((n) => n + 1);
      try {
        const r = await uploadImage(f, "sin-articulo");
        setMedia((m) => [...m, { path: r.path, url: r.url, folder: "sin-articulo", name: r.path.split("/").pop()!, size: 0 }]);
      } catch (e) {
        setToast({ text: (e as Error).message, error: true });
      } finally {
        setBusy((n) => n - 1);
      }
    }
  }

  async function remove(item: MediaItem) {
    try {
      await api(`/api/admin/media?path=${encodeURIComponent(item.path)}`, { method: "DELETE" });
      setMedia((m) => m.filter((x) => x.path !== item.path));
      setToast({ text: "Imagen eliminada." });
    } catch (e) {
      setToast({ text: (e as Error).message, error: true });
    } finally {
      setConfirm(null);
    }
  }

  return (
    <main className="wrap adm-main">
      <div className="strip" style={{ marginTop: "2rem" }}><span>Medios</span><span>{media.length} imágenes · {formatBytes(total)}</span></div>
      <h1 className="adm-title">Imágenes.</h1>
      <p className="adm-sub">Todo lo que subes desde el editor queda en <code>public/media/blog</code>, en una carpeta por artículo. Las fotos se reducen a 1800 px y se convierten a WebP antes de subir.</p>
      <div className="toolbar">
        <label className="btn btn--sm" style={{ cursor: "pointer" }}>
          {busy ? <><span className="spin" /> Subiendo {busy}…</> : "Subir imágenes"}
          <input type="file" accept="image/*" multiple hidden onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
        </label>
      </div>
      {error && <div className="notice notice--error">{error}</div>}
      {!error && media.length === 0 && (
        <div className="empty"><strong>Sin imágenes todavía.</strong>Arrastra fotos al editor de un artículo o súbelas aquí.</div>
      )}
      {groups.map(([folder, items]) => (
        <section className="mfolder" key={folder}>
          <div className="strip">
            <span>{folder}</span>
            {folder !== "sin-articulo" && folder !== "(sueltas)" && <Link href={`/admin/editar/${folder}`}>Abrir artículo</Link>}
          </div>
          <div className="mgrid">
            {items.map((m) => (
              <article className="mcard" key={m.path}>
                <div className="img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={adminMediaSrc(m.url)} alt="" loading="lazy" />
                </div>
                <div className="body">
                  <div className="name">{m.name}</div>
                  {m.size > 0 && <div className="meta">{formatBytes(m.size)}</div>}
                  <div className="row">
                    <button type="button" className="btn btn--line btn--sm" onClick={() => copy(`![Describe la imagen](${m.url})`, "Markdown")}>Markdown</button>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => copy(m.url, "Enlace")}>URL</button>
                    {confirm === m.path ? (
                      <button type="button" className="btn btn--danger btn--sm" onClick={() => remove(m)}>¿Seguro?</button>
                    ) : (
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirm(m.path)} aria-label={`Eliminar ${m.name}`}>Borrar</button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}
