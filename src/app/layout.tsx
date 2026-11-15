import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next, Bricolage_Grotesque } from "next/font/google";
import Analytics from "@/components/Analytics";
import ScrollVelocity from "@/components/ScrollVelocity";
import { SITE_URL } from "@/lib/site";

const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], axes: ["opsz"], variable: "--font-display" });
const text = Atkinson_Hyperlegible_Next({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--font-text" });
const mono = Atkinson_Hyperlegible_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#161514" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" className={`${display.variable} ${text.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado antes de pintar, sin parpadeo. */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}` }} />
      </head>
      <body>
        <Analytics />
        <ScrollVelocity />
        {children}
      </body>
    </html>
  );
}
