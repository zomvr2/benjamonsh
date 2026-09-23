import { NextResponse } from "next/server";
import { requireUser, jsonError } from "@/lib/appwrite/session";
import { redeemOffer } from "@/lib/benjapuntos/data";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("error" in auth) return auth.error;
  try {
    const { offerId } = (await req.json().catch(() => ({}))) as { offerId?: string };
    if (!offerId) return NextResponse.json({ error: "Falta la oferta." }, { status: 400 });
    const result = await redeemOffer(auth.user.$id, offerId);
    return NextResponse.json(result);
  } catch (e) {
    return jsonError(e);
  }
}
