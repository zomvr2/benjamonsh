"use client";

import { useRef, useState } from "react";
import { api, prepareImage } from "@/components/admin/client";
import Toast, { type ToastState } from "@/components/admin/Toast";
import type { Offer, OfferInput, PointsEvent } from "@/lib/benjapuntos/data";
import type { AppUser } from "@/lib/benjapuntos/users";

type Draft = Omit<OfferInput, "cost"> & { cost: string };

const BLANK_DRAFT: Draft = { title: "", description: "", cost: "50", active: true, imageUrl: "" };

function draftFromOffer(offer: Offer): Draft {
  return { title: offer.title, description: offer.description, cost: String(offer.cost), active: offer.active, imageUrl: offer.imageUrl ?? "" };
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function userName(users: AppUser[], userId: string): string {
  return users.find((u) => u.id === userId)?.name ?? userId;
}

/** Recorta el margen transparente de un PNG para que el objeto llene el marco, sin importar cuánto aire traía el archivo original. */
async function trimTransparentPadding(file: File): Promise<File> {
  if (file.type !== "image/png") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const ALPHA_THRESHOLD = 10;
    let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (data[(y * canvas.width + x) * 4 + 3] > ALPHA_THRESHOLD) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < minX || maxY < minY) return file; // todo transparente
    const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.06);
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(canvas.width - 1, maxX + pad);
    maxY = Math.min(canvas.height - 1, maxY + pad);
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    if (w >= canvas.width * 0.98 && h >= canvas.height * 0.98) return file; // ya está ajustado
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    out.getContext("2d")!.drawImage(canvas, minX, minY, w, h, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((r) => out.toBlob(r, "image/png"));
    if (!blob) return file;
    return new File([blob], file.name, { type: "image/png" });
  } catch {
    return file;
  }
}

export default function BenjapuntosManager({
  users, balances: initialBalances, initialOffers, initialEvents,
}: {
  users: AppUser[];
  balances: Record<string, number>;
  initialOffers: Offer[];
  initialEvents: PointsEvent[];
}) {
  const [balances, setBalances] = useState(initialBalances);
  const [offers, setOffers] = useState(initialOffers);
  const [events, setEvents] = useState(initialEvents);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [grantUserId, setGrantUserId] = useState(users[0]?.id ?? "");
  const [grantAmount, setGrantAmount] = useState("");
  const [grantReason, setGrantReason] = useState("");
  const [granting, setGranting] = useState(false);

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function grant(e: React.FormEvent) {
    e.preventDefault();
    if (!grantUserId) return;
    const amount = Number(grantAmount);
    if (!Number.isFinite(amount) || amount < 1) {
      setToast({ text: "El monto debe ser un número mayor a 0.", error: true });
      return;
    }
    if (!grantReason.trim()) {
      setToast({ text: "Ponle un motivo.", error: true });
      return;
    }
    setGranting(true);
    try {
      const { balance, event } = await api<{ balance: number; event: PointsEvent }>("/api/admin/benjapuntos/puntos", {
        method: "POST",
        body: JSON.stringify({ userId: grantUserId, amount, reason: grantReason.trim() }),
      });
      setBalances((prev) => ({ ...prev, [grantUserId]: balance }));
      setEvents((prev) => [event, ...prev].slice(0, 20));
      setGrantAmount("");
      setGrantReason("");
      setToast({ text: `Listo: ${amount} puntos para ${userName(users, grantUserId)}.` });
    } catch (err) {
      setToast({ text: err instanceof Error ? err.message : String(err), error: true });
    } finally {
      setGranting(false);
    }
  }

  function startEdit(offer: Offer) {
    setEditingId(offer.id);
    setDraft(draftFromOffer(offer));
    setConfirmDeleteId(null);
  }

  function startNew() {
    setEditingId("new");
    setDraft({ ...BLANK_DRAFT });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  async function save() {
    if (!editingId || !draft) return;
    const cost = Number(draft.cost);
    if (!draft.title.trim() || !draft.description.trim()) {
      setToast({ text: "Completa título y descripción.", error: true });
      return;
    }
    if (!Number.isFinite(cost) || cost < 1) {
      setToast({ text: "El costo debe ser un número mayor a 0.", error: true });
      return;
    }
    setSaving(true);
    const input: OfferInput = { title: draft.title, description: draft.description, cost, active: draft.active, imageUrl: draft.imageUrl };
    try {
      if (editingId === "new") {
        const { offer } = await api<{ offer: Offer }>("/api/admin/benjapuntos/ofertas", { method: "POST", body: JSON.stringify(input) });
        setOffers((prev) => [offer, ...prev]);
        setToast({ text: "Oferta creada." });
      } else {
        const { offer } = await api<{ offer: Offer }>(`/api/admin/benjapuntos/ofertas/${editingId}`, { method: "PATCH", body: JSON.stringify(input) });
        setOffers((prev) => prev.map((o) => (o.id === offer.id ? offer : o)));
        setToast({ text: "Oferta actualizada." });
      }
      cancelEdit();
    } catch (err) {
      setToast({ text: err instanceof Error ? err.message : String(err), error: true });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(offer: Offer) {
    setTogglingId(offer.id);
    try {
      const { offer: updated } = await api<{ offer: Offer }>(`/api/admin/benjapuntos/ofertas/${offer.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !offer.active }),
      });
      setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      setToast({ text: err instanceof Error ? err.message : String(err), error: true });
    } finally {
      setTogglingId(null);
    }
  }

  async function removeOffer(offer: Offer) {
    setDeletingId(offer.id);
    try {
      await api(`/api/admin/benjapuntos/ofertas/${offer.id}`, { method: "DELETE" });
      setOffers((prev) => prev.filter((o) => o.id !== offer.id));
      setToast({ text: `«${offer.title}» eliminada.` });
    } catch (err) {
      setToast({ text: err instanceof Error ? err.message : String(err), error: true });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  return (
    <>
      <section style={{ marginTop: "2rem" }}>
        <h2 className="strip"><span>Otorgar puntos</span></h2>
        <form onSubmit={grant} className="row" style={{ flexWrap: "wrap", alignItems: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <div className="field">
            <label htmlFor="grant-user">Cuenta</label>
            <select id="grant-user" className="input" value={grantUserId} onChange={(e) => setGrantUserId(e.target.value)}>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} — {balances[u.id] ?? 0} pts</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="grant-amount">Puntos</label>
            <input id="grant-amount" className="input" type="number" min={1} step={1}
              value={grantAmount} onChange={(e) => setGrantAmount(e.target.value)} style={{ maxWidth: "8rem" }} />
          </div>
          <div className="field" style={{ flex: 1, minWidth: "14rem" }}>
            <label htmlFor="grant-reason">Motivo</label>
            <input id="grant-reason" className="input" type="text" value={grantReason} onChange={(e) => setGrantReason(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={granting || !grantUserId}>{granting ? "Otorgando…" : "Otorgar"}</button>
        </form>
      </section>

      <div className="strip" style={{ marginTop: "2.5rem" }}><span>Ofertas</span><span>{offers.length}</span></div>
      {!editingId && (
        <button className="btn btn--line" type="button" style={{ marginTop: "1rem" }} onClick={startNew}>Nueva oferta</button>
      )}
      <table className="ptable" style={{ marginTop: "1rem" }}>
        <thead>
          <tr><th>Foto</th><th>Oferta</th><th>Costo</th><th>Estado</th><th /></tr>
        </thead>
        <tbody>
          {editingId === "new" && draft && (
            <tr>
              <td colSpan={5}>
                <OfferForm draft={draft} onChange={setDraft} onSave={save} onCancel={cancelEdit} saving={saving} onError={(text) => setToast({ text, error: true })} />
              </td>
            </tr>
          )}
          {offers.map((offer) => (
            editingId === offer.id && draft ? (
              <tr key={offer.id}>
                <td colSpan={5}>
                  <OfferForm draft={draft} onChange={setDraft} onSave={save} onCancel={cancelEdit} saving={saving} onError={(text) => setToast({ text, error: true })} />
                </td>
              </tr>
            ) : (
              <tr key={offer.id}>
                <td>
                  {offer.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img className="thumb" src={offer.imageUrl} alt="" loading="lazy" />
                    : <div className="thumb thumb--empty">;)</div>}
                </td>
                <td>
                  <span className="t">{offer.title}</span>
                  <div className="d">{offer.description}</div>
                </td>
                <td className="num">{offer.cost}</td>
                <td><span className={`badge ${offer.active ? "badge--publicado" : "badge--borrador"}`}>{offer.active ? "Activa" : "Inactiva"}</span></td>
                <td className="acts">
                  <button className="linkish" type="button" onClick={() => startEdit(offer)}>Editar</button>
                  <button className="linkish" type="button" disabled={togglingId === offer.id} onClick={() => toggleActive(offer)}>
                    {offer.active ? "Desactivar" : "Activar"}
                  </button>
                  {confirmDeleteId === offer.id ? (
                    <button className="linkish" type="button" style={{ color: "var(--acento-texto)" }} disabled={deletingId === offer.id} onClick={() => removeOffer(offer)}>
                      {deletingId === offer.id ? "Eliminando…" : "¿Seguro?"}
                    </button>
                  ) : (
                    <button className="linkish" type="button" onClick={() => setConfirmDeleteId(offer.id)}>Eliminar</button>
                  )}
                </td>
              </tr>
            )
          ))}
          {offers.length === 0 && editingId !== "new" && (
            <tr><td colSpan={5} className="empty">Todavía no hay ofertas.</td></tr>
          )}
        </tbody>
      </table>

      <div className="strip" style={{ marginTop: "2.5rem" }}><span>Últimos movimientos</span></div>
      {events.length === 0 ? (
        <p className="empty">Todavía no hay movimientos.</p>
      ) : (
        <ul className="checklist" style={{ marginTop: "1rem" }}>
          {events.map((event) => (
            <li key={event.id}>
              <span className="ic">{event.type === "grant" ? "+" : "−"}</span>
              <span>
                <strong>{userName(users, event.userId)}</strong> — {event.reason} ({event.amount} pts)
                <small>{formatWhen(event.createdAt)}</small>
              </span>
            </li>
          ))}
        </ul>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}

function OfferForm({
  draft, onChange, onSave, onCancel, saving, onError,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  onError: (msg: string) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function upload(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const trimmed = await trimTransparentPadding(file);
      const img = await prepareImage(trimmed);
      const { url } = await api<{ url: string }>("/api/admin/benjapuntos/imagen", {
        method: "POST",
        body: JSON.stringify({ filename: img.name, type: img.type, data: img.data }),
      });
      onChange({ ...draft, imageUrl: url });
    } catch (e) {
      onError(`No se subió la foto: ${(e as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="offer-form">
      <label className="wide">
        <span>Título</span>
        <input className="input" type="text" value={draft.title} onChange={(e) => onChange({ ...draft, title: e.target.value })} />
      </label>
      <label className="wide">
        <span>Descripción</span>
        <input className="input" type="text" value={draft.description} onChange={(e) => onChange({ ...draft, description: e.target.value })} />
      </label>
      <label>
        <span>Costo (puntos)</span>
        <input className="input" type="number" min={1} step={1} value={draft.cost} onChange={(e) => onChange({ ...draft, cost: e.target.value })} />
      </label>
      <label>
        <span>Estado</span>
        <select className="input" value={draft.active ? "1" : "0"} onChange={(e) => onChange({ ...draft, active: e.target.value === "1" })}>
          <option value="1">Activa</option>
          <option value="0">Inactiva</option>
        </select>
      </label>
      <label className="wide">
        <span>Foto (PNG del producto)</span>
        <div
          role="button"
          tabIndex={0}
          className={`coverbox${draft.imageUrl ? " has-img" : ""}${dragOver ? " is-drop" : ""}`}
          style={{ aspectRatio: "16/7", maxWidth: "24rem" }}
          onClick={() => fileInput.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.current?.click(); } }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files[0]); }}
          aria-label={draft.imageUrl ? "Cambiar foto" : "Subir foto"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {draft.imageUrl && <img src={draft.imageUrl} alt="" />}
          <span className="cta">{uploading ? <><span className="spin" /> Subiendo…</> : draft.imageUrl ? "Cambiar foto" : "Arrastra un PNG o haz clic"}</span>
          <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
        </div>
        {draft.imageUrl && (
          <button type="button" className="btn btn--ghost btn--sm" style={{ marginTop: ".4rem" }} onClick={() => onChange({ ...draft, imageUrl: "" })}>Quitar foto</button>
        )}
      </label>
      <div className="actions">
        <button className="btn" type="button" disabled={saving} onClick={onSave}>{saving ? "Guardando…" : "Guardar"}</button>
        <button className="btn btn--ghost" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
