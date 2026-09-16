import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { deletePost, getAdminPost } from "@/lib/admin/posts";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const post = await getAdminPost((await params).slug);
    return post ? NextResponse.json({ post }) : NextResponse.json({ error: "No existe." }, { status: 404 });
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const sha = new URL(req.url).searchParams.get("sha") ?? undefined;
    return NextResponse.json(await deletePost((await params).slug, sha));
  } catch (e) {
    return jsonError(e);
  }
}
