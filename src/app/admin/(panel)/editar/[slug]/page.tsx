import Link from "next/link";
import Editor from "@/components/admin/Editor";
import { panelEnv } from "@/lib/admin/env";
import { getAdminPost, listPosts } from "@/lib/admin/posts";
import { rankTags } from "@/lib/admin/shared";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  return { title: `Editar ${(await params).slug}` };
}

export default async function EditPost({ params }: Params) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getAdminPost(slug), listPosts().catch(() => [])]);
  if (!post) {
    return (
      <main className="wrap adm-main">
        <h1 className="adm-title">No existe.</h1>
        <p className="adm-sub">No encontré <strong>{slug}.mdx</strong> en el repositorio.</p>
        <p style={{ marginTop: "1.5rem" }}><Link className="btn" href="/admin">Volver a los artículos</Link></p>
      </main>
    );
  }
  return <Editor key={post.sha} env={panelEnv()} knownTags={rankTags(all.flatMap((p) => p.tags))} initial={post} />;
}
