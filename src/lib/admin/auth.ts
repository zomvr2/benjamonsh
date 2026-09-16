import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "bm_admin";
export const SESSION_DAYS = 14;

function secret(): string | null {
  return process.env.ADMIN_SECRET || null;
}

export function authConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

const sha = (s: string) => createHash("sha256").update(s).digest();

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(sha(input), sha(expected));
}

function sign(payload: string): string {
  return createHmac("sha256", secret()!).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const payload = `v1.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token || !secret()) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = Buffer.from(token.slice(i + 1));
  const good = Buffer.from(sign(payload));
  if (sig.length !== good.length || !timingSafeEqual(sig, good)) return false;
  const exp = Number(payload.split(".")[1]);
  return Number.isFinite(exp) && exp > Date.now();
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Para rutas del API: devuelve una respuesta 401 si no hay sesión, o null si todo bien. */
export async function guard(req?: Request): Promise<NextResponse | null> {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Sesión expirada. Vuelve a entrar." }, { status: 401 });
  }
  // Defensa extra contra CSRF: las escrituras deben venir del mismo origen.
  if (req && req.method !== "GET") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
    }
  }
  return null;
}

export function jsonError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { status?: number })?.status;
  return NextResponse.json({ error: message }, { status: code && code >= 400 && code < 600 ? code : status });
}
