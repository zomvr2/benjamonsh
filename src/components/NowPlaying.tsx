"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { Item, Welcome } from "@/types/SpotifyStream";

const FAVORITE_SONGS = [
  "6y0HWXD9L1VocIivzrznIT", // Akellas - FaceBrooklyn
  "3et5CLQNao5XFTUdC7x7fk", // INDOrrrr - Abrildefresa
  "3fljQiJN8UnHjkqa01SpwT", // KIKIBOYYYYY - Abrildefresa
  "6nEfUHrjohafrLeq884vyr", // Icono - Abrildefresa
  "6VYe3CyriXVeFmZaORgQK7", // Escala - Abrildefresa
  "1jAXoJOn5ulibhT4aMxW21", // 29/2 - Abrildefresa
];

export default function NowPlaying() {
  const [song, setSong] = useState<Item | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let active = true;
    const fetchSong = async () => {
      try {
        const res = await fetch("https://beta-api.stats.fm/api/v1/users/benjamonsh/streams/current");
        const data = (await res.json()) as Welcome;
        if (active) setSong(data?.item ?? null);
      } catch {
        // Si stats.fm no responde, la sección simplemente no aparece.
      }
    };
    fetchSong();
    const id = setInterval(fetchSong, 15000);
    return () => { active = false; clearInterval(id); };
  }, []);

  if (!song) return null;
  const trackId = song.track.externalIds.spotify[0];
  const isFavorite = FAVORITE_SONGS.includes(trackId);
  const motionProps = reduce
    ? {}
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 } };

  return (
    <section className="now-playing" aria-live="polite">
      <div className="strip"><span>Escuchando ahora</span><span>Spotify</span></div>
      <AnimatePresence mode="wait">
        <motion.div key={trackId} {...motionProps}>
          <div className="now-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={song.track.albums[0]?.image} alt="" width={64} height={64} />
            <div style={{ minWidth: 0 }}>
              <strong>{song.track.name}</strong>
              <span>{song.track.artists.map((a) => a.name).join(", ")}</span>
            </div>
            <a href={`https://open.spotify.com/track/${trackId}`} target="_blank" rel="noopener noreferrer">
              Escuchar
            </a>
          </div>
          {isFavorite && <p className="now-fav">Joyita oficial: de mis favoritas del momento.</p>}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
