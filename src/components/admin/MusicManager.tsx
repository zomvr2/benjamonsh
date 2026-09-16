"use client";

import { useEffect, useMemo, useState } from "react";
import { todayInChile } from "@/lib/admin/shared";
import {
  favoriteKey, listenUrl, parseSpotifyTrackId, type FavoriteTrack, type TrackInfo,
} from "@/lib/music";
import { api } from "@/components/admin/client";
import Toast, { type ToastState } from "@/components/admin/Toast";

type Draft = Omit<FavoriteTrack, "added"> & { link?: string };
interface Recent { now: TrackInfo | null; recent: TrackInfo[]; error?: string }

const same = (a: FavoriteTrack[], b: FavoriteTrack[]) => JSON.stringify(a) === JSON.stringify(b);

function summarize(before: FavoriteTrack[], after: FavoriteTrack[]): string {
  const prev = new Set(before.map(favoriteKey));
  const next = new Set(after.map(favoriteKey));
  const added = after.filter((f) => !prev.has(favoriteKey(f))).map((f) => `«${f.name}»`);
  const removed = before.filter((f) => !next.has(favoriteKey(f))).map((f) => `«${f.name}»`);
  const parts: string[] = [];
  if (added.length) parts.push(`agrega ${added.join(", ")}`);
  if (removed.length) parts.push(`quita ${removed.join(", ")}`);
  return parts.join(" y ") || "actualiza favoritas";
}

export default function MusicManager({ initial, initialSha, error }: { initial: FavoriteTrack[]; initialSha: string | null; error?: string }) {
  const [saved, setSaved] = useState(initial);
  const [list, setList] = useState(initial);
  const [sha, setSha] = useState(initialSha);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [looking, setLooking] = useState(false);
  const [filling, setFilling] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [recent, setRecent] = useState<Recent | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirm, setConfirm] = useState<number | null>(null);

  const dirty = !same(list, saved);
  const keys = useMemo(() => new Set(list.map(favoriteKey)), [list]);
  const fillable = list.filter((f) => f.spotifyId && (!f.image || !f.artists));

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const fetchRecent = () =>
    api<Recent>("/api/admin/music/recent").catch((e: Error) => ({ now: null, recent: [], error: e.message }));

  useEffect(() => {
    let active = true;
    fetchRecent().then((r) => { if (active) setRecent(r); });
    return () => { active = false; };
  }, []);

  async function refreshRecent() {
    setRecent(null);
    setRecent(await fetchRecent());
  }

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    const id = parseSpotifyTrackId(query);
    if (!id) {
      setToast({ text: "Eso no parece un enlace de canción de Spotify.", error: true });
      return;
    }
    if (list.some((f) => f.spotifyId === id)) {
      setToast({ text: "Esa canción ya está en la lista." });
      return;
    }
    setLooking(true);
    try {
      setDraft(await api<Draft>(`/api/admin/music/lookup?q=${encodeURIComponent(id)}`));
    } catch (err) {
      // Si Spotify no responde, igual se puede completar a mano.
      setDraft({ name: "", artists: "", spotifyId: id, image: "" });
      setToast({ text: (err as Error).message, error: true });
    } finally {
      setLooking(false);
    }
  }

  function add(d: Draft) {
    const name = d.name.trim();
    if (!name) {
      setToast({ text: "Ponle nombre a la canción.", error: true });
      return;
    }
    const linkId = d.link?.trim() ? parseSpotifyTrackId(d.link) : null;
    if (d.link?.trim() && !linkId) {
      setToast({ text: "El enlace de Spotify no es válido (o déjalo vacío).", error: true });
      return;
    }
    const fav: FavoriteTrack = { name, artists: d.artists.trim(), image: d.image, added: todayInChile() };
    const spotifyId = linkId ?? d.spotifyId;
    if (spotifyId) fav.spotifyId = spotifyId;
    if (d.note?.trim()) fav.note = d.note.trim();
    if (keys.has(favoriteKey(fav))) {
      setToast({ text: "Esa canción ya está en la lista." });
      return;
    }
    setList((l) => [fav, ...l]);
    setDraft(null);
    setQuery("");
    setToast({ text: `«${fav.name}» agregada. Guarda para publicarla.` });
  }

  const update = (i: number, patch: Partial<FavoriteTrack>) =>
    setList((l) => l.map((f, k) => (k === i ? { ...f, ...patch } : f)));

  const move = (i: number, dir: -1 | 1) => {
    setConfirm(null);
    setList((l) => {
      const j = i + dir;
      if (j < 0 || j >= l.length) return l;
      const next = [...l];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  function remove(i: number) {
    setList((l) => l.filter((_, k) => k !== i));
    setConfirm(null);
  }

  async function fill(i: number) {
    const f = list[i];
    if (!f?.spotifyId) return;
    setFilling(f.spotifyId);
    try {
      const d = await api<Draft>(`/api/admin/music/lookup?q=${encodeURIComponent(f.spotifyId)}`);
      setList((l) => l.map((x, k) => (k === i ? { ...x, image: x.image || d.image, artists: x.artists || d.artists } : x)));
    } catch (e) {
      setToast({ text: (e as Error).message, error: true });
    } finally {
      setFilling(null);
    }
  }

  async function fillAll() {
    for (let i = 0; i < list.length; i++) {
      if (list[i].spotifyId && (!list[i].image || !list[i].artists)) await fill(i);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const cleaned = list.map((f) => {
        const c: FavoriteTrack = { ...f, name: f.name.trim(), artists: f.artists.trim() };
        const note = f.note?.trim();
        if (note) c.note = note; else delete c.note;
        return c;
      });
      const r = await api<{ favorites: FavoriteTrack[]; sha: string; commitUrl?: string }>("/api/admin/music", {
        method: "PUT",
        body: JSON.stringify({ favorites: cleaned, sha, summary: summarize(saved, cleaned) }),
      });
      setSaved(r.favorites);
      setList(r.favorites);
      setSha(r.sha);
      setToast({
        text: r.commitUrl ? "Guardado. Vercel publica el cambio en 1–2 minutos." : "Guardado en tu disco.",
        href: r.commitUrl,
        hrefLabel: "Ver commit",
      });
    } catch (e) {
      setToast({ text: (e as Error).message, error: true });
    } finally {
      setSaving(false);
    }
  }

  const quick = [
    ...(recent?.now ? [{ ...recent.now, label: "Suena ahora" }] : []),
    ...(recent?.recent ?? []).map((t) => ({ ...t, label: "" })),
  ];

  return (
    <main className="wrap adm-main">
      <div className="strip" style={{ marginTop: "2rem" }}>
        <span>Música</span>
        <span>{list.length} {list.length === 1 ? "favorita" : "favoritas"}</span>
      </div>
      <h1 className="adm-title">Favoritas.</h1>
      <p className="adm-sub">
        Se ven en <a href="/enlaces" target="_blank" rel="noopener">/enlaces</a>: llevan tu frase cuando suenan (se
        reconocen por título y artista) y, si no estás escuchando nada, aparece una al azar. Guardar hace un commit y
        Vercel lo publica solo.
      </p>

      {error && <div className="notice notice--error">{error}</div>}

      <section className="music-add">
        <form className="toolbar" onSubmit={lookup}>
          <input
            className="input input--sm search"
            type="text"
            inputMode="url"
            placeholder="Pega el enlace de Spotify (Compartir → Copiar enlace de la canción)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Enlace de Spotify"
          />
          <button type="submit" className="btn btn--sm" disabled={looking || !query.trim()}>
            {looking ? <><span className="spin" /> Buscando…</> : "Buscar"}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setDraft({ name: "", artists: "", image: "" })}
          >
            Agregar a mano
          </button>
        </form>

        {draft && (
          <div className="fav-draft">
            <Cover src={draft.image} />
            <div className="fav-fields">
              <label>
                <span>Canción</span>
                <input className="input input--sm" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </label>
              <label>
                <span>Artistas</span>
                <input className="input input--sm" value={draft.artists} onChange={(e) => setDraft({ ...draft, artists: e.target.value })} />
              </label>
              {!draft.spotifyId && (
                <label className="wide">
                  <span>Enlace de Spotify (opcional, para que «Escuchar» abra la canción exacta)</span>
                  <input className="input input--sm" inputMode="url" placeholder="https://open.spotify.com/track/…"
                    value={draft.link ?? ""} onChange={(e) => setDraft({ ...draft, link: e.target.value })} />
                </label>
              )}
              <label className="wide">
                <span>Frase (opcional)</span>
                <input
                  className="input input--sm"
                  maxLength={160}
                  placeholder="Joyita oficial: de mis favoritas del momento."
                  value={draft.note ?? ""}
                  onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                />
              </label>
            </div>
            <div className="row">
              <button type="button" className="btn btn--sm" onClick={() => add(draft)}>Agregar a la lista</button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setDraft(null)}>Cancelar</button>
            </div>
          </div>
        )}

        <div className="strip" style={{ marginTop: "1.5rem" }}>
          <span>Desde Last.fm</span>
          <button type="button" className="linkish" onClick={refreshRecent} disabled={!recent}>Actualizar</button>
        </div>
        {!recent && <p className="hint" style={{ padding: ".75rem 0" }}><span className="spin" /> Cargando lo último que escuchaste…</p>}
        {recent?.error && <p className="hint" style={{ padding: ".75rem 0" }}>{recent.error}</p>}
        {recent && !recent.error && quick.length === 0 && <p className="hint" style={{ padding: ".75rem 0" }}>No hay escuchas recientes.</p>}
        {quick.length > 0 && (
          <ul className="quick-list">
            {quick.map((t, i) => (
              <li key={`${i}-${t.artists}-${t.name}`}>
                <Cover src={t.image} small />
                <div className="meta">
                  <strong>{t.name}</strong>
                  <span>{t.label ? <b>{t.label} · </b> : null}{t.artists}</span>
                </div>
                {keys.has(favoriteKey(t))
                  ? <span className="badge badge--publicado">En la lista</span>
                  : <button type="button" className="btn btn--line btn--sm" onClick={() => setDraft({ name: t.name, artists: t.artists, image: t.image })}>Agregar</button>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="toolbar" style={{ marginTop: "3rem" }}>
        <strong style={{ fontSize: "1.375rem", fontWeight: 800 }}>Tu lista</strong>
        {fillable.length > 0 && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={fillAll} disabled={Boolean(filling)}>
            {filling ? <><span className="spin" /> Completando…</> : `Completar portadas desde Spotify (${fillable.length})`}
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="empty"><strong>Sin favoritas todavía.</strong>Pega un enlace arriba o agrega una de las que escuchaste.</div>
      ) : (
        <ol className="fav-list">
          {list.map((f, i) => {
            return (
              <li key={`${f.spotifyId ?? ""}-${f.added}-${i}`} className="fav-row">
                <span className="pos">{String(i + 1).padStart(2, "0")}</span>
                <Cover src={f.image} />
                <div className="fav-fields">
                  <label>
                    <span>Canción</span>
                    <input className="input input--sm" value={f.name} onChange={(e) => update(i, { name: e.target.value })} />
                  </label>
                  <label>
                    <span>Artistas</span>
                    <input className="input input--sm" value={f.artists} onChange={(e) => update(i, { artists: e.target.value })} />
                  </label>
                  <label className="wide">
                    <span>Frase</span>
                    <input className="input input--sm" maxLength={160} placeholder="Joyita oficial: de mis favoritas del momento."
                      value={f.note ?? ""} onChange={(e) => update(i, { note: e.target.value })} />
                  </label>
                </div>
                <div className="fav-acts">
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Subir ${f.name}`}>↑</button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label={`Bajar ${f.name}`}>↓</button>
                  <a className="btn btn--ghost btn--sm" href={listenUrl(f)} target="_blank" rel="noopener noreferrer"
                    aria-label={`Abrir ${f.name} en Spotify`} title={f.spotifyId ? "Abrir en Spotify" : "Buscar en Spotify"}>↗</a>
                  {f.spotifyId && (!f.image || !f.artists) && (
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => fill(i)} disabled={Boolean(filling)}>
                      {filling === f.spotifyId ? <span className="spin" /> : "Completar"}
                    </button>
                  )}
                  {confirm === i
                    ? <button type="button" className="btn btn--danger btn--sm" onClick={() => remove(i)}>¿Seguro?</button>
                    : <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirm(i)}>Quitar</button>}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className={`save-bar${dirty ? " is-dirty" : ""}`}>
        <span>{dirty ? "Tienes cambios sin guardar." : "Todo guardado."}</span>
        <div className="row">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setList(saved)} disabled={!dirty || saving}>Descartar</button>
          <button type="button" className="btn btn--sm" onClick={save} disabled={!dirty || saving || Boolean(error)}>
            {saving ? <><span className="spin" /> Guardando…</> : "Guardar y publicar"}
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}

function Cover({ src, small }: { src: string; small?: boolean }) {
  const cls = `fav-cover${small ? " fav-cover--sm" : ""}`;
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img className={cls} src={src} alt="" loading="lazy" /> : <div className={`${cls} thumb--empty`}>;)</div>;
}
