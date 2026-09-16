import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { listPosts, savePost, type SaveInput } from "@/lib/admin/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  try {
    return NextResponse.json({ posts: await listPosts() });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const body = (await req.json()) as SaveInput;
    return NextResponse.json(await savePost(body));
  } catch (e) {
    return jsonError(e);
  }
}
