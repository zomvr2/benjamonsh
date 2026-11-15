import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactBand from "@/components/ContactBand";
import ProjectList from "@/components/ProjectList";
import BlogSection from "@/components/home/BlogSection";
import Stickers from "@/components/home/Stickers";
import ChatReveal from "@/components/home/ChatReveal";
import type { CSSProperties } from "react";
import { homeJsonLd } from "@/lib/about";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Header current="/" />
      <main id="contenido">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()).replace(/</g, "\\u003c") }} />

        <section className="hero wrap">
          <Stickers />
          <h1>hago webs y apps que funcionan, en días <span className="wink">;)</span></h1>
          <p className="lede">Soy Benjamín, desarrollador independiente en Coquimbo. Me cuentas qué necesita tu negocio y lo construyo rápido y bien, sin intermediarios.</p>
          <div className="actions">
            <Link className="btn" href="/contacto">cuéntame tu proyecto</Link>
            <Link className="btn btn--line" href="/proyectos">ver proyectos</Link>
          </div>
        </section>

        <section className="wrap section" aria-labelledby="que-hago" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2 className="section-title" id="que-hago">esto es lo que hago</h2>
          </div>
          <ChatReveal>
            <p className="chat-time">hoy</p>
            <p className="msg msg--visita" style={{ "--d": "0ms" } as CSSProperties}>hola! ¿qué haces exactamente?</p>
            <div className="msg msg--benja" style={{ "--d": "280ms" } as CSSProperties}>
              <strong>sitios web</strong>
              <p>Sitios de alta calidad listos en poco tiempo: rápidos, fáciles de actualizar y hechos para que tus clientes te encuentren y te escriban.</p>
            </div>
            <div className="msg msg--benja" style={{ "--d": "380ms" } as CSSProperties}>
              <strong>apps móviles</strong>
              <p>Apps para iOS y Android con Expo y React Native, desde la primera versión hasta la publicación en las tiendas.</p>
            </div>
            <p className="msg msg--visita" style={{ "--d": "680ms" } as CSSProperties}>¿y cuánto se demora?</p>
            <p className="msg msg--benja" style={{ "--d": "880ms" } as CSSProperties}>Días, no meses. Lo rápido se nota en el plazo, no en el acabado.</p>
            <p className="msg msg--visita" style={{ "--d": "1180ms" } as CSSProperties}>¿y cómo partimos?</p>
            <p className="msg msg--benja" style={{ "--d": "1380ms" } as CSSProperties}>Me cuentas la idea: qué necesitas, para quién y para cuándo.</p>
            <p className="msg msg--benja" style={{ "--d": "1480ms" } as CSSProperties}>Te propongo la opción simple, con alcance, plazo y precio claros. Si hay un camino más barato que funciona igual, te lo digo.</p>
            <p className="msg msg--benja" style={{ "--d": "1580ms" } as CSSProperties}>Y en días lo tienes funcionando, con avances que puedes probar desde el principio.</p>
          </ChatReveal>
        </section>

        <section className="wrap section" id="proyectos" aria-labelledby="proyectos-t" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2 className="section-title" id="proyectos-t">trabajo reciente</h2>
            <p>Proyectos reales, publicados y funcionando.</p>
          </div>
          <ProjectList />
          <div style={{ textAlign: "center" }}><Link className="more" href="/proyectos">ver todos los proyectos</Link></div>
        </section>

        <BlogSection />
        <ContactBand />
      </main>
      <Footer />
    </>
  );
}
