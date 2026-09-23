"use client";

import { useState } from "react";
import type { Offer, PointsEvent } from "@/lib/benjapuntos/data";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
}

export default function Dashboard({ name, balance, offers, events }: { name: string; balance: number; offers: Offer[]; events: PointsEvent[] }) {
  const [currentBalance, setCurrentBalance] = useState(balance);
  const [recentEvents, setRecentEvents] = useState(events);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function redeem(offer: Offer) {
    setError("");
    setRedeemingId(offer.id);
    try {
      const res = await fetch("/api/benjapuntos/canjear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: offer.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "No se pudo canjear.");
      setCurrentBalance(data.balance);
      setRecentEvents((prev) => [data.event, ...prev].slice(0, 10));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRedeemingId(null);
    }
  }

  return (
    <div className="wrap">
      <h1 className="bp-title">Hola, {name.split(" ")[0]}</h1>

      <dl className="bp-balance">
        <dt>Tus puntos</dt>
        <dd>{currentBalance}</dd>
      </dl>

      {error && <p className="form-status is-error">{error}</p>}

      <h2 className="strip"><span>Ofertas</span><span>{offers.length}</span></h2>
      {offers.length === 0 ? (
        <p className="empty">Todavía no hay ofertas disponibles.</p>
      ) : (
        <div className="bp-offers">
          {offers.map((offer) => {
            const canAfford = currentBalance >= offer.cost;
            return (
              <div className={`bp-offer${offer.imageUrl ? " has-img" : ""}`} key={offer.id}>
                {offer.imageUrl && (
                  <div className="bp-offer-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={offer.imageUrl} alt="" />
                  </div>
                )}
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <span className="cost">{offer.cost} puntos</span>
                <button
                  className="btn"
                  type="button"
                  disabled={!canAfford || redeemingId === offer.id}
                  title={canAfford ? undefined : "No te alcanzan los puntos"}
                  onClick={() => redeem(offer)}
                >
                  {redeemingId === offer.id ? "Canjeando…" : "Canjear"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="strip" style={{ marginTop: "2.5rem" }}><span>Últimos movimientos</span></h2>
      {recentEvents.length === 0 ? (
        <p className="empty">Todavía no hay movimientos.</p>
      ) : (
        <ul className="bp-events">
          {recentEvents.map((event) => (
            <li key={event.id}>
              <span>{event.reason}</span>
              <span className="when">{formatWhen(event.createdAt)}</span>
              <span className={`amount is-${event.type}`}>{event.type === "grant" ? "+" : "-"}{event.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
