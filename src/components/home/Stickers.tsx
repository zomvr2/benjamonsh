"use client";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const display = { fontFamily: "var(--display)", fontWeight: 800 } as const;
const text = { fontFamily: "var(--font)", fontWeight: 700 } as const;

// Stickers SVG dibujados a mano: borde blanco troquelado y colores de la paleta.
const BADGE = (
  <svg viewBox="0 0 200 140">
    <rect x="4" y="4" width="192" height="132" rx="16" fill="#fff" />
    <path d="M8 22a14 14 0 0 1 14-14h156a14 14 0 0 1 14 14v34H8z" fill="#e8365d" />
    <path d="M8 118h184v0a14 14 0 0 1-14 14H22a14 14 0 0 1-14-14z" fill="#e8365d" />
    <text x="100" y="32" textAnchor="middle" fontSize="20" fill="#fff" style={display}>hola</text>
    <text x="100" y="49" textAnchor="middle" fontSize="10.5" fill="#fff" letterSpacing="1.5" style={text}>ME LLAMO</text>
    <text x="100" y="101" textAnchor="middle" fontSize="40" fill="#1f1d1c" transform="rotate(-4 100 90)" style={display}>benja</text>
  </svg>
);
const FOLDER = (
  <svg viewBox="0 0 120 104">
    <path d="M6 22a10 10 0 0 1 10-10h30l10 10h48a10 10 0 0 1 10 10v56a10 10 0 0 1-10 10H16A10 10 0 0 1 6 88z" fill="#fff" stroke="#fff" strokeWidth="10" strokeLinejoin="round" />
    <path d="M6 22a10 10 0 0 1 10-10h30l10 10h48a10 10 0 0 1 10 10v56a10 10 0 0 1-10 10H16A10 10 0 0 1 6 88z" fill="#3cb6dd" />
    <path d="M6 36a8 8 0 0 1 8-8h92a8 8 0 0 1 8 8v52a10 10 0 0 1-10 10H16A10 10 0 0 1 6 88z" fill="#8fd6ee" />
    <rect x="24" y="58" width="72" height="20" rx="10" fill="#fff" />
    <text x="60" y="72" textAnchor="middle" fontSize="11" fill="#0a5f80" style={text}>proyectos</text>
  </svg>
);
const STAMP = (
  <svg viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="57" fill="#fff" />
    <circle cx="60" cy="60" r="51" fill="#6cc24a" />
    <circle cx="60" cy="60" r="31" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 4" />
    <defs><path id="sello-arco" d="M60 60m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" /></defs>
    <text fontSize="13" fill="#173d08" letterSpacing=".6" style={text}><textPath href="#sello-arco">hecho en coquimbo · chile ·</textPath></text>
    <text x="60" y="68" textAnchor="middle" fontSize="22" fill="#173d08" style={display}>30°S</text>
  </svg>
);
const FLOPPY = (
  <svg viewBox="0 0 110 110">
    <path d="M8 14a8 8 0 0 1 8-8h70l18 18v72a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8z" fill="#fff" stroke="#fff" strokeWidth="10" strokeLinejoin="round" />
    <path d="M8 14a8 8 0 0 1 8-8h70l18 18v72a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8z" fill="#ff7a1a" />
    <rect x="28" y="6" width="50" height="30" rx="3" fill="#cfd3d6" />
    <rect x="60" y="11" width="10" height="20" rx="2" fill="#7d8287" />
    <rect x="20" y="54" width="70" height="44" rx="5" fill="#fff" />
    <path d="M28 66h54M28 76h54M28 86h30" stroke="#e6e4e2" strokeWidth="2" />
    <text x="55" y="82" textAnchor="middle" fontSize="18" fill="#1f1d1c" transform="rotate(-3 55 80)" style={display}>v2.0</text>
  </svg>
);
const SMILE = (
  <svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#fff" />
    <circle cx="50" cy="50" r="42" fill="#ffd23f" />
    <circle cx="36" cy="40" r="5" fill="#1f1d1c" />
    <path d="M57 41q7-5 14 0" stroke="#1f1d1c" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M31 59q19 18 38 0" stroke="#1f1d1c" strokeWidth="5" strokeLinecap="round" fill="none" />
  </svg>
);
const CURSOR = (
  <svg viewBox="0 0 24 34"><path d="M2 2v26l7-6 5 10 4-2-5-10h9z" fill="#1f1d1c" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>
);

const STICKERS: { id: string; rotate: number; art: ReactNode }[] = [
  { id: "s-badge", rotate: -9, art: BADGE },
  { id: "s-folder", rotate: 7, art: FOLDER },
  { id: "s-stamp", rotate: 14, art: STAMP },
  { id: "s-floppy", rotate: 10, art: FLOPPY },
  { id: "s-smile", rotate: -12, art: SMILE },
  { id: "s-cursor", rotate: -6, art: CURSOR },
];

/** Stickers decorativos del hero: se «pegan» al cargar y se pueden arrastrar dentro del hero. */
const FINE = "(pointer: fine)";
const subscribe = (cb: () => void) => { const m = matchMedia(FINE); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); };

export default function Stickers() {
  const area = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Solo se arrastran con mouse; en táctil bloquearían el scroll.
  const fine = useSyncExternalStore(subscribe, () => matchMedia(FINE).matches, () => false);
  return (
    <div className="stickers" ref={area} aria-hidden="true">
      {STICKERS.map((s, i) => (
        <motion.div
          key={s.id}
          className={`sticker ${s.id}`}
          drag={fine}
          dragConstraints={area}
          dragElastic={0.15}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 22 }}
          initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: s.rotate - 12 }}
          animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 18, delay: 0.15 + i * 0.07 }}
          whileHover={reduce ? undefined : { rotate: 0, scale: 1.06 }}
          whileDrag={{ rotate: 0, scale: 1.1, cursor: "grabbing" }}
        >
          {s.art}
        </motion.div>
      ))}
    </div>
  );
}
