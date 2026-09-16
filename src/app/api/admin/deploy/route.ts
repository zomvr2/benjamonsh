import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { triggerDeploy } from "@/lib/admin/posts";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const ok = await triggerDeploy();
    if (!ok) return NextResponse.json({ error: "Falta VERCEL_DEPLOY_HOOK_URL." }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return jsonError(e);
  }
}
