"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Artículos" },
  { href: "/admin/medios", label: "Medios" },
  { href: "/admin/musica", label: "Música" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <nav className="adm-nav" aria-label="Panel">
      {ITEMS.map((i) => (
        <Link key={i.href} href={i.href} aria-current={pathname === i.href ? "page" : undefined}>{i.label}</Link>
      ))}
      <a className="ext" href="/blog" target="_blank" rel="noopener">Ver blog ↗</a>
      <button type="button" onClick={logout}>Salir</button>
      <Link className="btn" href="/admin/nuevo">Nuevo artículo</Link>
    </nav>
  );
}
