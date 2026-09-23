import type { Metadata } from "next";
import "./benjapuntos.css";

export const metadata: Metadata = {
  title: { default: "Benjapuntos", template: "%s — Benjapuntos" },
  robots: { index: false, follow: false },
};

export default function BenjapuntosRoot({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
