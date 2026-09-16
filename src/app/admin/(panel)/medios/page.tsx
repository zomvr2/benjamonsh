import MediaLibrary from "@/components/admin/MediaLibrary";
import { getStorage } from "@/lib/admin/storage";
import type { MediaItem } from "@/lib/admin/shared";

export const dynamic = "force-dynamic";
export const metadata = { title: "Medios" };

export default async function MediaPage() {
  let media: MediaItem[] = [];
  let error: string | undefined;
  try {
    media = await getStorage().listMedia();
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }
  return <MediaLibrary initial={media} error={error} />;
}
