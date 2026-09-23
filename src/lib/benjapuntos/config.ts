import { appwriteConfigured } from "@/lib/appwrite/config";

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "benjapuntos";
export const OFFERS_COLLECTION_ID = process.env.APPWRITE_OFFERS_COLLECTION_ID || "offers";
export const POINTS_EVENTS_COLLECTION_ID = process.env.APPWRITE_POINTS_EVENTS_COLLECTION_ID || "points_events";
export const OFFER_IMAGES_BUCKET_ID = process.env.APPWRITE_OFFER_IMAGES_BUCKET_ID || "offer_images";

export function benjapuntosConfigured(): boolean {
  return appwriteConfigured();
}
