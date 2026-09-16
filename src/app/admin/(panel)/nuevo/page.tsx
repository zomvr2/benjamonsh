import Editor from "@/components/admin/Editor";
import { panelEnv } from "@/lib/admin/env";
import { listPosts } from "@/lib/admin/posts";
import { rankTags, todayInChile } from "@/lib/admin/shared";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nuevo artículo" };

export default async function NewPost() {
  const all = await listPosts().catch(() => []);
  const tags = rankTags(all.flatMap((p) => p.tags));
  return (
    <Editor
      env={panelEnv()}
      knownTags={tags}
      initial={{
        slug: "", sha: "", title: "", description: "", date: todayInChile(), cover: "",
        color: "cian", tags: [], draft: true,
        content: "Empieza con una frase que diga de qué va el artículo.\n\n## Primera sección\n\nEscribe aquí.\n",
      }}
      isNew
    />
  );
}
