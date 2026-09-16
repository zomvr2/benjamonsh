// Favoritas de Spotify: se guardan en src/data/favoritas.json con un commit (igual que los artículos).
import { createHash } from "node:crypto";
import {
  FAVORITES_PATH, parseSpotifyTrackId, sanitizeFavorites, spotifyTrackUrl, type FavoriteTrack,
} from "@/lib/music";
import { getStorage, StorageError } from "@/lib/admin/storage";

export interface FavoritesFile { favorites: FavoriteTrack[]; sha: string | null }

const blobSha = (text: string) => {
  const buf = Buffer.from(text);
  return createHash("sha1").update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest("hex");
};

export async function readFavorites(): Promise<FavoritesFile> {
  const f = await getStorage().readFile(FAVORITES_PATH);
  if (!f) return { favorites: [], sha: null };
  try {
    return { favorites: sanitizeFavorites(JSON.parse(f.text)), sha: f.sha };
  } catch {
    throw new StorageError(`${FAVORITES_PATH} no es un JSON válido. Revísalo en GitHub.`, 500);
  }
}

/** Mismo formato que el archivo original: una canción por línea. */
export function serializeFavorites(list: FavoriteTrack[]): string {
  if (!list.length) return "[]\n";
  const line = (f: FavoriteTrack) => JSON.stringify(f, null, 1).replace(/\n\s*/g, " ");
  return `[\n${list.map((f) => `  ${line(f)}`).join(",\n")}\n]\n`;
}

export async function saveFavorites(input: unknown, sha: string | null, summary: string) {
  const favorites = sanitizeFavorites(input);
  const storage = getStorage();
  const current = await storage.readFile(FAVORITES_PATH);
  if ((current?.sha ?? null) !== sha) {
    throw new StorageError("La lista cambió en GitHub desde que abriste el panel. Recarga y vuelve a intentar.", 409);
  }
  const text = serializeFavorites(favorites);
  const clean = summary.replace(/\s+/g, " ").trim().slice(0, 120) || "actualiza favoritas";
  const commit = await storage.commit([{ path: FAVORITES_PATH, text }], `música: ${clean}`);
  return { favorites, sha: blobSha(text), commitUrl: commit.url };
}

const UA = "Mozilla/5.0 (compatible; benjamonsh-admin/1.0; +https://www.benjamonsh.dev)";

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function meta(html: string, key: string): string {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? decode(tag.match(/content=["']([^"']*)["']/i)?.[1] ?? "").trim() : "";
}

/** Busca nombre, artista y portada de una canción a partir de un enlace o ID de Spotify. */
export async function lookupTrack(input: string): Promise<Omit<FavoriteTrack, "added">> {
  const id = parseSpotifyTrackId(input);
  if (!id) throw new StorageError("Pega un enlace de canción de Spotify (open.spotify.com/track/…) o su ID.", 400);
  const url = spotifyTrackUrl(id);
  let name = "";
  let image = "";
  let artists = "";

  const [oembed, page] = await Promise.allSettled([
    fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, {
      cache: "no-store", headers: { "User-Agent": UA }, signal: AbortSignal.timeout(6000),
    }).then((r) => (r.ok ? (r.json() as Promise<{ title?: string; thumbnail_url?: string }>) : null)),
    fetch(url, {
      cache: "no-store", headers: { "User-Agent": UA, "Accept-Language": "es" }, signal: AbortSignal.timeout(6000),
    }).then((r) => (r.ok ? r.text() : "")),
  ]);

  if (oembed.status === "fulfilled" && oembed.value) {
    name = oembed.value.title?.trim() ?? "";
    image = oembed.value.thumbnail_url ?? "";
  }
  if (page.status === "fulfilled" && page.value) {
    const html = page.value;
    name ||= meta(html, "og:title");
    image ||= meta(html, "og:image");
    artists = meta(html, "music:musician_description");
    if (!artists) {
      // «Artista · Canción · 2024» (el formato de og:description en páginas de canción)
      const desc = meta(html, "og:description");
      const first = desc.split(" · ")[0];
      if (desc.includes(" · ") && first && !/spotify/i.test(first)) artists = first;
    }
    if (!artists) {
      // <title>Canción - song and lyrics by Artista | Spotify</title>
      const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "");
      artists = title.match(/ by (.+?) \| Spotify/i)?.[1]?.trim() ?? "";
    }
  }

  if (!name) throw new StorageError("No pude leer esa canción en Spotify. Revisa el enlace o completa los datos a mano.", 502);
  return { name, artists, spotifyId: id, image: /^https:\/\//.test(image) ? image : "" };
}
