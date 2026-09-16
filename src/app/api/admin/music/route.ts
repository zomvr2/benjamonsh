import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { readFavorites, saveFavorites } from "@/lib/admin/music";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  try {
    return NextResponse.json(await readFavorites());
  } catch (e) {
    return jsonError(e);
  }
}

export async function PUT(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const { favorites, sha, summary } = (await req.json()) as { favorites: unknown; sha: string | null; summary?: string };
    return NextResponse.json(await saveFavorites(favorites, sha ?? null, summary ?? ""));
  } catch (e) {
    return jsonError(e, e instanceof Error && !("status" in e) ? 400 : 500);
  }
}
