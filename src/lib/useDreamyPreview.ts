"use client";
import { useEffect, useRef, useState } from "react";
import { DreamyPreview, type DreamyState } from "@/lib/dreamyAudio";

// Pequeño margen antes de pedir el preview: un paso rápido del mouse no
// debería disparar una búsqueda ni una carga de audio.
const HOVER_DELAY = 150;

/** Conecta hover/focus de una pista con el motor de audio "recuerdo". */
export function useDreamyPreview(name?: string, artists?: string) {
  const [state, setState] = useState<DreamyState>("idle");
  const player = useRef<DreamyPreview | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    player.current = new DreamyPreview(setState);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      player.current?.destroy();
    };
  }, []);

  // Si cambia la canción (o desaparece esta tarjeta) mientras sonaba, se corta.
  useEffect(() => {
    return () => player.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, artists]);

  const enter = () => {
    if (!name) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const q = new URLSearchParams({ name, artists: artists ?? "" });
      player.current?.play(`/api/now-playing/preview?${q.toString()}`);
    }, HOVER_DELAY);
  };

  const leave = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    player.current?.stop();
  };

  return { state, enter, leave, listening: state === "loading" || state === "playing" };
}
