import { NextResponse } from "next/server";
import { listPosts, triggerDeploy } from "@/lib/admin/posts";
import { todayInChile } from "@/lib/admin/shared";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const daysAgo = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

// Vercel Cron llama aquí cada madrugada. Si un artículo programado ya llegó a su fecha
// pero todavía no está en el sitio, dispara un deploy para que aparezca.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  try {
    const today = todayInChile();
    const from = daysAgo(today, 7);
    const candidates = (await listPosts()).filter((p) => p.status === "publicado" && p.date >= from && p.date <= today);
    const missing: string[] = [];
    for (const p of candidates) {
      const res = await fetch(`${SITE_URL}/blog/${p.slug}`, { method: "HEAD", cache: "no-store" }).catch(() => null);
      if (!res || res.status === 404) missing.push(p.slug);
    }
    if (!missing.length) return NextResponse.json({ today, deployed: false, missing });
    const deployed = await triggerDeploy();
    return NextResponse.json({ today, deployed, missing });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
