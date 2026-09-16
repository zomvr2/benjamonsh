import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { deleteMedia, uploadMedia } from "@/lib/admin/posts";
import { getStorage } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  try {
    return NextResponse.json({ media: await getStorage().listMedia() });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const { folder, filename, type, data } = (await req.json()) as { folder: string; filename: string; type: string; data: string };
    return NextResponse.json(await uploadMedia(folder, filename, type, data));
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const p = new URL(req.url).searchParams.get("path") ?? "";
    await deleteMedia(p);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return jsonError(e);
  }
}
