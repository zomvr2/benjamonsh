import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { deleteOffer, updateOffer, type OfferPatch } from "@/lib/benjapuntos/data";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const { id } = await params;
    const patch = (await req.json()) as OfferPatch;
    return NextResponse.json({ offer: await updateOffer(id, patch) });
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const { id } = await params;
    await deleteOffer(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return jsonError(e);
  }
}
