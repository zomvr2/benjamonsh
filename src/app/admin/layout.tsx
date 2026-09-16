import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s — Panel benjamonsh" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
