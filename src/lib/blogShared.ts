// Tipos y utilidades del blog que se pueden usar tanto en el servidor como en el navegador
// (sin node:fs). blogFunctions.ts los reexporta.

export type AccentName = "cian" | "violeta" | "ambar" | "verde";

// Cada artículo usa un único color secundario, solo en su propia página.
export const ACCENTS: Record<AccentName, { bg: string; fg: string }> = {
  cian: { bg: "var(--cian)", fg: "var(--tinta)" },
  violeta: { bg: "var(--violeta)", fg: "var(--blanco)" },
  ambar: { bg: "var(--ambar)", fg: "var(--tinta)" },
  verde: { bg: "var(--verde)", fg: "var(--tinta)" },
};

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  cover?: string;
  color: AccentName;
  tags: string[];
  draft?: boolean;
  readingTime: number;
}

export interface Post extends PostMeta {
  content: string;
}

export type PostStatus = "publicado" | "programado" | "borrador";

/** Fecha de hoy (AAAA-MM-DD) en la hora de Chile. */
export function todayInChile(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

/** Un artículo se ve en el sitio si no es borrador y su fecha ya llegó. */
export function postStatus(meta: { draft?: boolean; date?: string }, today = todayInChile()): PostStatus {
  if (meta.draft) return "borrador";
  if (meta.date && meta.date > today) return "programado";
  return "publicado";
}

/**
 * MDX lee "<" como el inicio de una etiqueta JSX, así que textos como "<3" o "a < b"
 * rompen la compilación (y el build). Escapa los "<" que no pueden abrir una etiqueta,
 * sin tocar bloques de código ni `código en línea`.
 */
export function escapeStrayLt(source: string): string {
  let inFence = false;
  return source
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line
        .split(/(`[^`]*`)/)
        .map((part, i) => (i % 2 ? part : part.replace(/(?<!\\)<(?![A-Za-z_$/>])/g, "\\<")))
        .join("");
    })
    .join("\n");
}
