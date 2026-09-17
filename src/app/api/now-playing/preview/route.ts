import { NextRequest, NextResponse } from "next/server";
import { resolvePreview } from "@/lib/preview";

export const dynamic = "force-dynamic";

// Resuelve el preview (Deezer/iTunes) y hace streaming del audio desde el
// propio dominio: el navegador nunca pide directo a esos CDN, así que no hay
// líos de CORS y el <audio> del cliente puede pasar por la Web Audio API sin
// que el nodo quede "contaminado" por ser de otro origen.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") || "").trim().slice(0, 200);
  const artists = (searchParams.get("artists") || "").trim().slice(0, 200);
  if (!name) return NextResponse.json({ error: "Falta 'name'." }, { status: 400 });

  let resolved;
  try {
    resolved = await resolvePreview(name, artists);
  } catch (e) {
    console.error("[now-playing/preview]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "No se pudo buscar el preview." }, { status: 502 });
  }
  if (!resolved) return NextResponse.json({ error: "Sin preview disponible." }, { status: 404 });

  try {
    const range = req.headers.get("range");
    const upstream = await fetch(resolved.url, {
      headers: range ? { Range: range } : undefined,
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok || !upstream.body) throw new Error(`HTTP ${upstream.status}`);

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") || "audio/mpeg");
    headers.set("Accept-Ranges", "bytes");
    // El preview de una canción no cambia: se puede cachear tranquilo.
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=600, stale-while-revalidate=86400");
    const len = upstream.headers.get("content-length");
    if (len) headers.set("Content-Length", len);
    const contentRange = upstream.headers.get("content-range");
    if (contentRange) headers.set("Content-Range", contentRange);

    return new NextResponse(upstream.body, { status: upstream.status, headers });
  } catch (e) {
    console.error("[now-playing/preview:audio]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "El preview no respondió." }, { status: 502 });
  }
}
