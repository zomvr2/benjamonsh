// Preview de 30s para «Escuchando ahora»: busca en Deezer (sin auth) y, si no
// hay resultado, en la Search API de iTunes. Todo corre en el servidor para
// evitar problemas de CORS con los CDN de audio — el cliente solo pide
// /api/now-playing/preview, nunca habla directo con Deezer/iTunes.
import { normalizeTitle } from "@/lib/music";

export interface ResolvedPreview {
  url: string;
  source: "deezer" | "itunes";
}

interface CacheEntry {
  value: ResolvedPreview | null;
  ts: number;
}

// 10 min alcanza de sobra para lo que dura sonando una misma canción.
const CACHE_TTL = 10 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

const firstArtist = (s: string) => (s.split(/,|&| feat\.? | ft\.? | x /i)[0] ?? s).trim();

function cacheKey(name: string, artists: string) {
  return `${normalizeTitle(firstArtist(artists))}|${normalizeTitle(name)}`;
}

async function fetchJson<T>(url: string, timeoutMs = 6000): Promise<T> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { "User-Agent": "benjamonsh.cl/1.0 (+https://benjamonsh.cl)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

interface DeezerResult {
  data?: Array<{ preview?: string; title?: string; artist?: { name?: string } }>;
}

async function fromDeezer(name: string, artists: string): Promise<ResolvedPreview | null> {
  const q = `${name} ${firstArtist(artists)}`.trim();
  const data = await fetchJson<DeezerResult>(`https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=5`);
  const items = data.data ?? [];
  const wantTitle = normalizeTitle(name);
  const wantArtist = normalizeTitle(firstArtist(artists));
  const withPreview = items.filter((it) => it.preview);
  const best =
    withPreview.find((it) => {
      const t = normalizeTitle(it.title ?? "");
      const a = normalizeTitle(it.artist?.name ?? "");
      return t === wantTitle && (!wantArtist || a.includes(wantArtist) || wantArtist.includes(a));
    }) ?? withPreview[0];
  return best?.preview ? { url: best.preview, source: "deezer" } : null;
}

interface ItunesResult {
  results?: Array<{ previewUrl?: string; trackName?: string; artistName?: string }>;
}

async function fromItunes(name: string, artists: string): Promise<ResolvedPreview | null> {
  const q = `${firstArtist(artists)} ${name}`.trim();
  const data = await fetchJson<ItunesResult>(
    `https://itunes.apple.com/search?media=music&entity=song&limit=5&term=${encodeURIComponent(q)}`,
  );
  const items = data.results ?? [];
  const wantTitle = normalizeTitle(name);
  const withPreview = items.filter((it) => it.previewUrl);
  const best = withPreview.find((it) => normalizeTitle(it.trackName ?? "") === wantTitle) ?? withPreview[0];
  return best?.previewUrl ? { url: best.previewUrl, source: "itunes" } : null;
}

/** Resuelve el preview de una canción por artista+título, con cache en memoria. */
export async function resolvePreview(name: string, artists: string): Promise<ResolvedPreview | null> {
  const key = cacheKey(name, artists);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.value;

  let value: ResolvedPreview | null = null;
  try {
    value = await fromDeezer(name, artists);
  } catch {
    // sigue con iTunes
  }
  if (!value) {
    try {
      value = await fromItunes(name, artists);
    } catch {
      // sin preview disponible
    }
  }
  cache.set(key, { value, ts: Date.now() });
  return value;
}
