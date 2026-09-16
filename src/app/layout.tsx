import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import Analytics from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";

const description =
  "Soy Benjamín Delgado. Diseño y desarrollo sitios web y apps móviles con React Native y Expo para negocios que necesitan resultados rápido.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "benjamonsh — Webs y apps que funcionan, en días",
    template: "%s — benjamonsh",
  },
  description,
  keywords: ["desarrollo web", "aplicaciones móviles", "React Native", "Expo", "Figma", "diseño web", "desarrollo de apps"],
  authors: [{ name: "Benjamín Delgado", url: SITE_URL }],
  creator: "benjamonsh",
  publisher: "benjamonsh",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    title: "benjamonsh — Webs y apps que funcionan, en días",
    description,
    url: SITE_URL,
    siteName: "benjamonsh",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "benjamonsh — Webs y apps que funcionan, en días",
    description,
    creator: "@benjamonsh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#ec3013",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
