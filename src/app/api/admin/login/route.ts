import { NextResponse } from "next/server";
import { authConfigured, createSessionToken, passwordMatches, SESSION_COOKIE, SESSION_DAYS } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!authConfigured()) {
    return NextResponse.json({ error: "Configura ADMIN_PASSWORD y ADMIN_SECRET en las variables de entorno." }, { status: 500 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !passwordMatches(password)) {
    // Freno simple contra fuerza bruta.
    await new Promise((r) => setTimeout(r, 1200));
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return res;
}
