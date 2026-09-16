import { NextResponse } from "next/server";
import { guard } from "@/lib/admin/auth";
import { getRecent } from "@/lib/lastfm";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  try {
    return NextResponse.json(await getRecent(15));
  } catch (e) {
    return NextResponse.json({ now: null, recent: [], error: e instanceof Error ? e.message : String(e) });
  }
}
