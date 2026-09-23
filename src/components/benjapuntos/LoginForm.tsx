"use client";

import { useState } from "react";

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/benjapuntos/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      window.location.assign(next);
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "No se pudo entrar.");
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="bp-email">Correo</label>
        <input id="bp-email" className="input" type="email" autoComplete="username" autoFocus required
          value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="bp-pw">Contraseña</label>
        <input id="bp-pw" className="input" type="password" autoComplete="current-password" required
          value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-actions">
        <button className="btn" type="submit" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
        <p className={`form-status${error ? " is-error" : ""}`} role="status">{error}</p>
      </div>
    </form>
  );
}
