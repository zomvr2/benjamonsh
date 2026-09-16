// Música de la página de enlaces: tipos y utilidades que sirven en servidor y navegador.

/** Archivo del repo con las favoritas (se edita desde /admin/musica). */
export const FAVORITES_PATH = "src/data/favoritas.json";

export interface FavoriteTrack {
  name: string;
  artists: string;
  /** ID de Spotify (22 caracteres). Opcional: sin él, «Escuchar» abre la búsqueda. */
  spotifyId?: string;
  image: string;
  /** Frase propia que aparece bajo la canción. Opcional. */
  note?: string;
  added: string; // AAAA-MM-DD
}

export interface TrackInfo {
  name: string;
  artists: string;
  album: string;
  image: string;
  /** Página de la canción en Last.fm. */
  lastfmUrl: string;
}

export interface NowPlayingData {
  /** Canción que suena ahora (Last.fm la marca como «now playing»), o null. */
  track: TrackInfo | null;
  fetchedAt: number;
}

export const spotifyTrackUrl = (id: string) => `https://open.spotify.com/track/${id}`;
export const spotifySearchUrl = (name: string, artists: string) =>
  `https://open.spotify.com/search/${encodeURIComponent(`${name} ${artists.split(",")[0]}`.trim())}`;

const ID_RE = /^[A-Za-z0-9]{22}$/;
export const isSpotifyId = (s: string) => ID_RE.test(s);

/** Acepta un ID, un enlace open.spotify.com (con /intl-xx/ o ?si=) o una URI spotify:track:… */
export function parseSpotifyTrackId(input: string): string | null {
  const s = input.trim();
  if (isSpotifyId(s)) return s;
  const m = s.match(/(?:spotify:track:|open\.spotify\.com\/(?:intl-[a-z-]+\/)?(?:embed\/)?track\/)([A-Za-z0-9]{22})/i);
  return m ? m[1] : null;
}

/** Normaliza para comparar: sin tildes, sin «(feat. …)», «- Remastered», signos ni mayúsculas. */
export function normalizeTitle(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s[-–]\s.*(remaster|version|versión|live|en vivo|edit|mix).*$/i, "")
    .replace(/[([](?:feat|ft|with|con)\.?\s[^)\]]*[)\]]/gi, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

const firstArtist = (s: string) => normalizeTitle(s.split(/,|&| feat\.? | ft\.? | x /i)[0] ?? "");

/** Clave estable de una favorita (para React y para evitar duplicados). */
export const favoriteKey = (f: Pick<FavoriteTrack, "name" | "artists">) => `${firstArtist(f.artists)}|${normalizeTitle(f.name)}`;

/** ¿La canción de Last.fm es una de las favoritas? Compara título y artista principal. */
export function findFavorite(track: Pick<TrackInfo, "name" | "artists">, favorites: FavoriteTrack[]): FavoriteTrack | undefined {
  const name = normalizeTitle(track.name);
  const artist = normalizeTitle(track.artists);
  return favorites.find((f) => {
    if (normalizeTitle(f.name) !== name) return false;
    const fa = firstArtist(f.artists);
    return !fa || !artist || artist === fa || artist.includes(fa) || fa.includes(artist);
  });
}

export const listenUrl = (t: Pick<FavoriteTrack, "name" | "artists" | "spotifyId">) =>
  t.spotifyId ? spotifyTrackUrl(t.spotifyId) : spotifySearchUrl(t.name, t.artists);

/** Limpia y valida la lista que llega del panel antes de guardarla. */
export function sanitizeFavorites(input: unknown): FavoriteTrack[] {
  if (!Array.isArray(input)) throw new Error("La lista de favoritas no es válida.");
  const seen = new Set<string>();
  const out: FavoriteTrack[] = [];
  for (const raw of input) {
    const r = (raw ?? {}) as Record<string, unknown>;
    const name = String(r.name ?? "").trim().slice(0, 200);
    if (!name) throw new Error("Hay una canción sin nombre.");
    const artists = String(r.artists ?? "").trim().slice(0, 200);
    const spotifyId = String(r.spotifyId ?? "").trim();
    if (spotifyId && !isSpotifyId(spotifyId)) throw new Error(`El ID de Spotify de «${name}» no es válido.`);
    const key = favoriteKey({ name, artists });
    if (seen.has(key)) continue;
    seen.add(key);
    const image = String(r.image ?? "").trim();
    const note = String(r.note ?? "").trim().slice(0, 160);
    // El orden de las llaves es el mismo con que se escribe el JSON.
    const fav: FavoriteTrack = {
      name,
      artists,
      ...(spotifyId ? { spotifyId } : {}),
      image: /^https:\/\//.test(image) ? image : "",
      ...(note ? { note } : {}),
      added: /^\d{4}-\d{2}-\d{2}$/.test(String(r.added)) ? String(r.added) : new Date().toISOString().slice(0, 10),
    };
    out.push(fav);
  }
  return out;
}

export const DEFAULT_FAV_NOTE = "Joyita oficial: de mis favoritas del momento.";
