// Lectura de Last.fm desde el servidor: la API key nunca llega al navegador.
import type { NowPlayingData, TrackInfo } from "@/lib/music";

const API = process.env.LASTFM_API_URL || "https://ws.audioscrobbler.com/2.0/";
// Imagen genérica (estrella gris) que Last.fm devuelve cuando no tiene portada.
const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

export class LastfmError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

interface LfmImage { size: string; "#text": string }
interface LfmTrack {
  name: string;
  url: string;
  artist: { "#text"?: string; name?: string };
  album?: { "#text"?: string };
  image?: LfmImage[];
  "@attr"?: { nowplaying?: string };
}

export function lastfmConfig() {
  return { apiKey: process.env.LASTFM_API_KEY || "", user: process.env.LASTFM_USER || "benjamonsh" };
}

function toTrack(t: LfmTrack): TrackInfo {
  const imgs = t.image ?? [];
  const best = ["extralarge", "large", "medium"].map((s) => imgs.find((i) => i.size === s)?.["#text"]).find(Boolean) ?? "";
  return {
    name: t.name,
    artists: t.artist?.name ?? t.artist?.["#text"] ?? "",
    album: t.album?.["#text"] ?? "",
    image: best && !best.includes(PLACEHOLDER) ? best.replace(/^http:/, "https:") : "",
    lastfmUrl: t.url,
  };
}

async function recentRaw(limit: number): Promise<LfmTrack[]> {
  const { apiKey, user } = lastfmConfig();
  if (!apiKey) throw new LastfmError("Falta LASTFM_API_KEY en las variables de entorno.", 503);
  const qs = new URLSearchParams({ method: "user.getrecenttracks", user, api_key: apiKey, format: "json", limit: String(limit) });
  const res = await fetch(`${API}?${qs}`, {
    cache: "no-store",
    headers: { "User-Agent": "benjamonsh.dev/1.0 (+https://www.benjamonsh.dev)" },
    signal: AbortSignal.timeout(6000),
  });
  const data = (await res.json().catch(() => null)) as
    | { recenttracks?: { track?: LfmTrack | LfmTrack[] }; error?: number; message?: string }
    | null;
  if (!res.ok || !data || data.error) {
    const msg = data?.message ?? `HTTP ${res.status}`;
    // 6 = usuario no existe, 10 = API key inválida, 17 = perfil privado, 29 = límite de consultas
    const hint = data?.error === 10 ? " (revisa LASTFM_API_KEY)" : data?.error === 6 ? " (revisa LASTFM_USER)" : data?.error === 17 ? " (el perfil de Last.fm está privado)" : "";
    throw new LastfmError(`Last.fm: ${msg}${hint}`, data?.error === 29 ? 429 : 502);
  }
  const t = data.recenttracks?.track;
  return Array.isArray(t) ? t : t ? [t] : [];
}

export async function getNowPlaying(): Promise<NowPlayingData> {
  const fetchedAt = Date.now();
  const [first] = await recentRaw(1);
  const playing = first?.["@attr"]?.nowplaying === "true";
  return { track: playing ? toTrack(first) : null, fetchedAt };
}

/** Lo que suena y lo último escuchado, sin repetidos (para agregar rápido desde el panel). */
export async function getRecent(limit = 12): Promise<{ now: TrackInfo | null; recent: TrackInfo[] }> {
  const items = await recentRaw(limit);
  const now = items[0]?.["@attr"]?.nowplaying === "true" ? toTrack(items[0]) : null;
  const seen = new Set<string>();
  const recent: TrackInfo[] = [];
  for (const it of now ? items.slice(1) : items) {
    const t = toTrack(it);
    const key = `${t.artists}|${t.name}`.toLowerCase();
    if (!seen.has(key) && key !== `${now?.artists}|${now?.name}`.toLowerCase()) { seen.add(key); recent.push(t); }
  }
  return { now, recent };
}
