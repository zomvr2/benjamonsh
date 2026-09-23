import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { createOffer, listAllOffers, type OfferInput } from "@/lib/benjapuntos/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  try {
    return NextResponse.json({ offers: await listAllOffers() });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const body = (await req.json()) as OfferInput;
    return NextResponse.json({ offer: await createOffer(body) });
  } catch (e) {
    return jsonError(e);
  }
}
