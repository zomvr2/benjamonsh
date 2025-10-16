import "@/app/globals.css";

export const metadata = {
  title: {
    default: "Benjamonsh - Desarrollo Web y Apps Móviles",
    template: "%s | Benjamonsh"
  },
  description: "Convierto las ideas del cliente en algo funcional y atractivo, junto con amabilidad y buena disposición para realizar cambios según preferencias del cliente. Desarrollo páginas web, diseño con Figma y aplicaciones móviles con React Native Expo.",
  keywords: ["desarrollo web", "aplicaciones móviles", "React Native", "Expo", "Figma", "diseño web", "desarrollo de apps"],
  authors: [{ name: "Benjamin Delgado", url: "https://benjamonsh.vercel.app" }],
  creator: "Benjamonsh",
  publisher: "Benjamonsh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://benjamonsh.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Benjamonsh - Desarrollo Web y Apps Móviles",
    description: "Convierto las ideas del cliente en algo funcional y atractivo, junto con amabilidad y buena disposición para realizar cambios según preferencias del cliente.",
    url: "https://benjamonsh.vercel.app",
    siteName: "Benjamonsh",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benjamonsh - Desarrollo Web y Apps Móviles",
    description: "Convierto las ideas del cliente en algo funcional y atractivo, junto con amabilidad y buena disposición para realizar cambios según preferencias del cliente.",
    creator: "@benjamonsh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>
        {children}
      </body>
    </html>
  );
}
