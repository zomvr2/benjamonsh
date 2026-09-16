"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  DEFAULT_FAV_NOTE, favoriteKey, findFavorite, listenUrl, type FavoriteTrack, type NowPlayingData,
} from "@/lib/music";

// Cada cuánto se pregunta a /api/now-playing mientras la pestaña está visible.
const POLL = 10_000;
const POLL_ERROR = 45_000;

type Status = "loading" | "ok" | "error";

export default function NowPlaying({ favorites = [] }: { favorites?: FavoriteTrack[] }) {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [pick, setPick] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const favCount = favorites.length;

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let inFlight: AbortController | null = null;
    const randomPick = () => { if (favCount) setPick((p) => p ?? Math.floor(Math.random() * favCount)); };

    const load = async () => {
      if (timer) clearTimeout(timer);
      inFlight?.abort();
      const ctrl = new AbortController();
      inFlight = ctrl;
      let delay = POLL;
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store", signal: ctrl.signal });
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as NowPlayingData;
        if (!alive) return;
        // Solo re-renderiza si cambió la canción.
        setData((prev) =>
          prev && prev.track?.name === next.track?.name && prev.track?.artists === next.track?.artists ? prev : next);
        setStatus("ok");
        if (!next.track) randomPick();
      } catch (e) {
        if (!alive || (e as Error).name === "AbortError") return;
        setStatus((s) => (s === "ok" ? s : "error"));
        randomPick();
        delay = POLL_ERROR;
      }
      // Con la pestaña oculta no se consulta; se retoma al volver.
      if (alive && document.visibilityState === "visible") timer = setTimeout(load, delay);
    };

    const onVisible = () => { if (document.visibilityState === "visible") load(); };
    load();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    window.addEventListener("online", onVisible);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      window.removeEventListener("online", onVisible);
      if (timer) clearTimeout(timer);
      inFlight?.abort();
    };
  }, [favCount]);

  const motionProps = reduce
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 } };

  const track = data?.track ?? null;

  if (track) {
    const fav = findFavorite(track, favorites);
    return (
      <section className="now-playing" aria-labelledby="now-playing-title">
        <div className="strip">
          <span id="now-playing-title">
            <span className="now-eq" aria-hidden="true"><i /><i /><i /></span>
            Escuchando ahora
          </span>
          <span>{fav ? "Favorita" : "Last.fm"}</span>
        </div>
        <div aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${track.artists}|${track.name}`} {...motionProps}>
              <div className="now-card">
                <Cover src={track.image || fav?.image || ""} />
                <div style={{ minWidth: 0 }}>
                  <strong>{track.name}</strong>
                  <span>{track.artists}</span>
                </div>
                <a href={listenUrl(fav ?? track)} target="_blank" rel="noopener noreferrer">Escuchar</a>
              </div>
              {fav && <p className="now-fav">{fav.note || DEFAULT_FAV_NOTE}</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    );
  }

  // Nada sonando (o Last.fm caído): mostramos una favorita.
  if (status === "loading" || pick === null || !favCount) return null;
  const fav = favorites[pick % favCount];
  const another = () => {
    if (favCount < 2) return;
    let n = pick;
    while (n === pick) n = Math.floor(Math.random() * favCount);
    setPick(n);
  };

  return (
    <section className="now-playing" aria-labelledby="now-playing-title">
      <div className="strip">
        <span id="now-playing-title">Una de mis favoritas</span>
        {favCount > 1 ? <button type="button" className="now-next" onClick={another}>Otra</button> : <span>Spotify</span>}
      </div>
      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={favoriteKey(fav)} {...motionProps}>
            <div className="now-card">
              <Cover src={fav.image} />
              <div style={{ minWidth: 0 }}>
                <strong>{fav.name}</strong>
                <span>{fav.artists}</span>
              </div>
              <a href={listenUrl(fav)} target="_blank" rel="noopener noreferrer">Escuchar</a>
            </div>
            <p className="now-fav">{fav.note || "Ahora no suena nada, pero esta nunca falla."}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Cover({ src }: { src: string }) {
  if (!src) return <div className="now-cover-empty" aria-hidden="true">;)</div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={64} height={64} />;
}
