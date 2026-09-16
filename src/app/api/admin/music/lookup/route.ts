import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { lookupTrack } from "@/lib/admin/music";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const q = new URL(req.url).searchParams.get("q") ?? "";
    return NextResponse.json(await lookupTrack(q));
  } catch (e) {
    return jsonError(e);
  }
}
