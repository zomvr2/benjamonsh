import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite/server";
import { SESSION_COOKIE } from "@/lib/appwrite/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  const secret = store.get(SESSION_COOKIE)?.value;
  if (secret) {
    try {
      const { account } = createSessionClient(secret);
      await account.deleteSession("current");
    } catch {
      // Sesión ya inválida/expirada: igual limpiamos la cookie.
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
