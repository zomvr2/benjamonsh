import { NextResponse } from "next/server";
import { getNowPlaying, LastfmError } from "@/lib/lastfm";

export const dynamic = "force-dynamic";

// La CDN de Vercel guarda la respuesta 5 s: muchas visitas = una sola consulta a Last.fm.
const CACHE = "public, max-age=0, s-maxage=5, stale-while-revalidate=5";

export async function GET() {
  try {
    const data = await getNowPlaying();
    return NextResponse.json(data, { headers: { "Cache-Control": CACHE } });
  } catch (e) {
    const status = e instanceof LastfmError ? e.status : 502;
    console.error("[now-playing]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Last.fm no responde." }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
