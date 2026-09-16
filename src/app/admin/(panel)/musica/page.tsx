import MusicManager from "@/components/admin/MusicManager";
import { readFavorites, type FavoritesFile } from "@/lib/admin/music";

export const dynamic = "force-dynamic";
export const metadata = { title: "Música" };

export default async function MusicPage() {
  let data: FavoritesFile = { favorites: [], sha: null };
  let error: string | undefined;
  try {
    data = await readFavorites();
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }
  return <MusicManager initial={data.favorites} initialSha={data.sha} error={error} />;
}
