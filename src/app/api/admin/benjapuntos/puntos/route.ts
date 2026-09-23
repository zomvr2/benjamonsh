import { NextResponse } from "next/server";
import { guard, jsonError } from "@/lib/admin/auth";
import { getBalance, grantPoints, listRecentEvents } from "@/lib/benjapuntos/data";
import { listAppUsers } from "@/lib/benjapuntos/users";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  try {
    const appUsers = await listAppUsers();
    const users = await Promise.all(appUsers.map(async (u) => ({ ...u, balance: await getBalance(u.id) })));
    const events = await listRecentEvents({ limit: 20 });
    return NextResponse.json({ users, events });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const { userId, amount, reason } = (await req.json()) as { userId?: string; amount?: number; reason?: string };
    if (!userId) return NextResponse.json({ error: "Falta el usuario." }, { status: 400 });
    const result = await grantPoints(userId, Number(amount), String(reason ?? ""));
    return NextResponse.json(result);
  } catch (e) {
    return jsonError(e);
  }
}
