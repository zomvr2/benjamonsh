import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import Analytics from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";

const description =
  "Soy Benjamín Delgado. Desarrollo apps móviles con Expo y React Native, y sitios web de alta calidad en poco tiempo, para negocios que necesitan resultados rápido.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "benjamonsh — Webs y apps que funcionan, en días",
    template: "%s — benjamonsh",
  },
  description,
  keywords: ["desarrollo web", "aplicaciones móviles", "React Native", "Expo", "desarrollo de apps", "desarrollo de sitios web"],
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
