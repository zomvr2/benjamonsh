import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { uploadOfferImage } from "@/lib/benjapuntos/images";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const { filename, type, data } = (await req.json()) as { filename: string; type: string; data: string };
    return NextResponse.json(await uploadOfferImage(filename ?? "", type ?? "", data ?? ""));
  } catch (e) {
    return jsonError(e);
  }
}
