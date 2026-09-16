import Dashboard from "@/components/admin/Dashboard";
import { panelEnv } from "@/lib/admin/env";
import { listPosts } from "@/lib/admin/posts";
import type { AdminPostSummary } from "@/lib/admin/shared";

export const dynamic = "force-dynamic";
export const metadata = { title: "Artículos" };

export default async function AdminHome() {
  const env = panelEnv();
  let posts: AdminPostSummary[] = [];
  let error = env.error;
  if (!error) {
    try {
      posts = await listPosts();
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
  return <Dashboard posts={posts} env={env} error={error} />;
}
