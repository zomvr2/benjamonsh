"use client";

import { useRouter } from "next/navigation";

export default function BenjapuntosNav() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/benjapuntos/logout", { method: "POST" });
    router.replace("/benjapuntos/login");
    router.refresh();
  }
  return (
    <nav className="bp-nav" aria-label="Benjapuntos">
      <button type="button" onClick={logout}>Salir</button>
    </nav>
  );
}
