import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { guard } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

// Compila el MDX igual que la página real del artículo, para la vista previa.
export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const { source } = (await req.json().catch(() => ({}))) as { source?: string };
  try {
    const result = await serialize(source ?? "", { mdxOptions: { remarkPlugins: [remarkGfm] } });
    return NextResponse.json({ compiledSource: result.compiledSource });
  } catch (e) {
    const message = e instanceof Error ? e.message.split("\n")[0] : String(e);
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
