import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { MEDIA_PATH } from "@/lib/admin/shared";
import { getStorage } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", avif: "image/avif", svg: "image/svg+xml",
};

// Sirve las imágenes subidas antes de que Vercel las despliegue (solo para el panel).
export async function GET(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const p = new URL(req.url).searchParams.get("path") ?? "";
    if (!p.startsWith(`${MEDIA_PATH}/`) || p.includes("..")) return NextResponse.json({ error: "Ruta no permitida." }, { status: 400 });
    const buf = await getStorage().readBinary(p);
    if (!buf) return new NextResponse("No existe", { status: 404 });
    const ext = p.split(".").pop()!.toLowerCase();
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": "private, max-age=86400",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      },
    });
  } catch (e) {
    return jsonError(e);
  }
}
