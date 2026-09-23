import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/lib/appwrite/config";
import { OFFER_IMAGES_BUCKET_ID } from "./config";
import { BenjapuntosError } from "./data";

const MAX_BYTES = 5_000_000;

const EXTENSIONS: Record<string, string> = {
  "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/avif": "avif",
};

/** URL pública del archivo (el bucket tiene read("any")), lista para guardar en la oferta y usar en <img>. */
function viewUrl(fileId: string): string {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${OFFER_IMAGES_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
}

/** Devuelve el ID del archivo si la URL apunta a nuestro bucket; cualquier otra URL (externa o antigua) se ignora. */
function fileIdFromUrl(url?: string): string | null {
  if (!url) return null;
  const m = url.match(new RegExp(`/storage/buckets/${OFFER_IMAGES_BUCKET_ID}/files/([^/?]+)/view`));
  return m ? m[1] : null;
}

export async function uploadOfferImage(filename: string, type: string, base64: string): Promise<{ url: string }> {
  const ext = EXTENSIONS[type];
  if (!ext) throw new BenjapuntosError("Formato no permitido (usa PNG, WebP, JPG, GIF o AVIF).", 400);
  const buf = Buffer.from(base64, "base64");
  if (!buf.length) throw new BenjapuntosError("El archivo está vacío.", 400);
  if (buf.length > MAX_BYTES) throw new BenjapuntosError("La foto pesa más de 5 MB.", 400);
  const base = filename.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").slice(0, 60) || "oferta";
  const { storage } = createAdminClient();
  const file = await storage.createFile(OFFER_IMAGES_BUCKET_ID, ID.unique(), InputFile.fromBuffer(buf, `${base}.${ext}`));
  return { url: viewUrl(file.$id) };
}

/** Borra la foto del bucket sin romper el flujo si ya no existe. */
export async function deleteOfferImage(url?: string): Promise<void> {
  const fileId = fileIdFromUrl(url);
  if (!fileId) return;
  const { storage } = createAdminClient();
  await storage.deleteFile(OFFER_IMAGES_BUCKET_ID, fileId).catch(() => {});
}
