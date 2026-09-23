import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Models } from "node-appwrite";
import { createSessionClient } from "./server";

/** Nombre genérico (no atado a una sección) para poder reusarse en futuras partes del sitio. */
export const SESSION_COOKIE = "aw_session";

export const getLoggedInUser = cache(async (): Promise<Models.User<Models.Preferences> | null> => {
  const store = await cookies();
  const secret = store.get(SESSION_COOKIE)?.value;
  if (!secret) return null;
  try {
    const { account } = createSessionClient(secret);
    return await account.get();
  } catch {
    return null;
  }
});

export type UserAuthResult = { user: Models.User<Models.Preferences> } | { error: NextResponse };

/** Equivalente a guard() del panel admin, pero además entrega la identidad de quien llama. */
export async function requireUser(req?: Request): Promise<UserAuthResult> {
  const user = await getLoggedInUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Sesión expirada. Vuelve a entrar." }, { status: 401 }) };
  }
  if (req && req.method !== "GET") {
    const origin = req.headers.get("origin");
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return { error: NextResponse.json({ error: "Origen no permitido." }, { status: 403 }) };
    }
  }
  return { user };
}

export function jsonError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { status?: number })?.status;
  return NextResponse.json({ error: message }, { status: code && code >= 400 && code < 600 ? code : status });
}
