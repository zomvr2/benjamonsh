import { NextResponse } from "next/server";
import { appwriteConfigured } from "@/lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite/server";
import { SESSION_COOKIE } from "@/lib/appwrite/session";

export const dynamic = "force-dynamic";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: Request) {
  if (!appwriteConfigured()) {
    return NextResponse.json({ error: "Configura APPWRITE_PROJECT_ID y APPWRITE_API_KEY en las variables de entorno." }, { status: 500 });
  }
  const { email, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  if (!email || !password) {
    await delay(1200);
    return NextResponse.json({ error: "Completa correo y contraseña." }, { status: 401 });
  }
  try {
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    const res = NextResponse.json({ ok: true });
    const maxAge = Math.max(60, Math.floor((new Date(session.expire).getTime() - Date.now()) / 1000));
    res.cookies.set(SESSION_COOKIE, session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge,
    });
    return res;
  } catch {
    // Freno simple contra fuerza bruta.
    await delay(1200);
    return NextResponse.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  }
}
