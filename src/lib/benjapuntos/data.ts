import { ID, Query, type Models } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { DATABASE_ID, OFFERS_COLLECTION_ID, POINTS_EVENTS_COLLECTION_ID } from "./config";

export class BenjapuntosError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

interface OfferDoc extends Models.Document {
  title: string;
  description: string;
  cost: number;
  active: boolean;
  imageUrl?: string;
}

interface PointsEventDoc extends Models.Document {
  userId: string;
  type: "grant" | "redeem";
  amount: number;
  reason: string;
  offerId?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  cost: number;
  active: boolean;
  imageUrl?: string;
}

export interface OfferInput {
  title: string;
  description: string;
  cost: number;
  active: boolean;
  imageUrl?: string;
}

export type OfferPatch = Partial<OfferInput>;

export interface PointsEvent {
  id: string;
  userId: string;
  type: "grant" | "redeem";
  amount: number;
  reason: string;
  offerId?: string;
  createdAt: string;
}

function mapOffer(doc: OfferDoc): Offer {
  return { id: doc.$id, title: doc.title, description: doc.description, cost: doc.cost, active: doc.active, imageUrl: doc.imageUrl || undefined };
}

function mapEvent(doc: PointsEventDoc): PointsEvent {
  return { id: doc.$id, userId: doc.userId, type: doc.type, amount: doc.amount, reason: doc.reason, offerId: doc.offerId || undefined, createdAt: doc.$createdAt };
}

function validateOfferInput(input: Partial<OfferInput>): void {
  if (input.title !== undefined && !input.title.trim()) throw new BenjapuntosError("Falta el título.", 400);
  if (input.description !== undefined && !input.description.trim()) throw new BenjapuntosError("Falta la descripción.", 400);
  if (input.cost !== undefined && (!Number.isFinite(input.cost) || Math.trunc(input.cost) < 1)) {
    throw new BenjapuntosError("El costo debe ser un número mayor a 0.", 400);
  }
}

export async function listActiveOffers(): Promise<Offer[]> {
  const { databases } = createAdminClient();
  const page = await databases.listDocuments<OfferDoc>(DATABASE_ID, OFFERS_COLLECTION_ID, [Query.equal("active", true), Query.limit(100)]);
  return page.documents.map(mapOffer);
}

export async function listAllOffers(): Promise<Offer[]> {
  const { databases } = createAdminClient();
  const page = await databases.listDocuments<OfferDoc>(DATABASE_ID, OFFERS_COLLECTION_ID, [Query.orderDesc("$createdAt"), Query.limit(100)]);
  return page.documents.map(mapOffer);
}

export async function createOffer(input: OfferInput): Promise<Offer> {
  validateOfferInput(input);
  const { databases } = createAdminClient();
  const doc = await databases.createDocument<OfferDoc>(DATABASE_ID, OFFERS_COLLECTION_ID, ID.unique(), {
    title: input.title.trim(),
    description: input.description.trim(),
    cost: Math.trunc(input.cost),
    active: Boolean(input.active),
    imageUrl: input.imageUrl?.trim() || "",
  });
  return mapOffer(doc);
}

export async function updateOffer(id: string, patch: OfferPatch): Promise<Offer> {
  validateOfferInput(patch);
  const data: Record<string, unknown> = {};
  if (patch.title !== undefined) data.title = patch.title.trim();
  if (patch.description !== undefined) data.description = patch.description.trim();
  if (patch.cost !== undefined) data.cost = Math.trunc(patch.cost);
  if (patch.active !== undefined) data.active = Boolean(patch.active);
  if (patch.imageUrl !== undefined) data.imageUrl = patch.imageUrl.trim() || "";
  const { databases } = createAdminClient();
  const doc = await databases.updateDocument<OfferDoc>(DATABASE_ID, OFFERS_COLLECTION_ID, id, data);
  return mapOffer(doc);
}

export async function deleteOffer(id: string): Promise<void> {
  const { databases } = createAdminClient();
  await databases.deleteDocument(DATABASE_ID, OFFERS_COLLECTION_ID, id);
}

/** Suma paginada: Appwrite tope 100 documentos por página, así que nunca hay que asumir que el saldo cabe en una sola. */
export async function getBalance(userId: string): Promise<number> {
  const { databases } = createAdminClient();
  let total = 0;
  let cursor: string | undefined;
  for (;;) {
    const queries = [Query.equal("userId", userId), Query.orderAsc("$id"), Query.limit(100)];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const page = await databases.listDocuments<PointsEventDoc>(DATABASE_ID, POINTS_EVENTS_COLLECTION_ID, queries);
    for (const doc of page.documents) total += doc.type === "grant" ? doc.amount : -doc.amount;
    if (page.documents.length < 100) break;
    cursor = page.documents[page.documents.length - 1].$id;
  }
  return total;
}

export async function listRecentEvents(opts: { userId?: string; limit?: number } = {}): Promise<PointsEvent[]> {
  const { databases } = createAdminClient();
  const queries = [Query.orderDesc("$createdAt"), Query.limit(opts.limit ?? 10)];
  if (opts.userId) queries.push(Query.equal("userId", opts.userId));
  const page = await databases.listDocuments<PointsEventDoc>(DATABASE_ID, POINTS_EVENTS_COLLECTION_ID, queries);
  return page.documents.map(mapEvent);
}

export async function grantPoints(userId: string, amount: number, reason: string): Promise<{ balance: number; event: PointsEvent }> {
  const amt = Math.trunc(amount);
  const trimmedReason = reason.trim();
  if (!userId) throw new BenjapuntosError("Falta el usuario.", 400);
  if (!Number.isFinite(amt) || amt < 1) throw new BenjapuntosError("El monto debe ser un número mayor a 0.", 400);
  if (!trimmedReason) throw new BenjapuntosError("Falta el motivo.", 400);
  const { databases } = createAdminClient();
  const doc = await databases.createDocument<PointsEventDoc>(DATABASE_ID, POINTS_EVENTS_COLLECTION_ID, ID.unique(), {
    userId,
    type: "grant",
    amount: amt,
    reason: trimmedReason,
  });
  const balance = await getBalance(userId);
  return { balance, event: mapEvent(doc) };
}

export async function redeemOffer(userId: string, offerId: string): Promise<{ balance: number; event: PointsEvent }> {
  const { databases } = createAdminClient();
  let offerDoc: OfferDoc;
  try {
    offerDoc = await databases.getDocument<OfferDoc>(DATABASE_ID, OFFERS_COLLECTION_ID, offerId);
  } catch {
    throw new BenjapuntosError("Oferta no encontrada.", 404);
  }
  if (!offerDoc.active) throw new BenjapuntosError("Esta oferta ya no está disponible.", 400);
  const balance = await getBalance(userId);
  if (balance < offerDoc.cost) throw new BenjapuntosError("No te alcanzan los puntos para esta oferta.", 400);
  const doc = await databases.createDocument<PointsEventDoc>(DATABASE_ID, POINTS_EVENTS_COLLECTION_ID, ID.unique(), {
    userId,
    type: "redeem",
    amount: offerDoc.cost,
    reason: offerDoc.title,
    offerId: offerDoc.$id,
  });
  return { balance: balance - offerDoc.cost, event: mapEvent(doc) };
}
