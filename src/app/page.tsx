import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactBand from "@/components/ContactBand";
import ProjectList from "@/components/ProjectList";
import BlogSection from "@/components/home/BlogSection";
import { EMAIL, PROJECTS, SITE_URL, SOCIAL } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Benjamín Delgado",
  alternateName: "benjamonsh",
  url: SITE_URL,
  email: EMAIL,
  jobTitle: "Desarrollador web y de apps móviles",
  sameAs: SOCIAL.map((s) => s.url),
};

export default function Home() {
  return (
    <>
      <Header current="/" />
      <main id="contenido">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

        <section className="hero">
          <div className="wrap">
            <span className="hero-wink" aria-hidden="true">;)</span>
            <h1>
              <span className="line">Webs y apps</span>{" "}
              <span className="line">que funcionan,</span>{" "}
              <span className="line">en días.</span>
            </h1>
            <div className="hero-foot">
              <p>Soy Benjamín Delgado. Diseño y desarrollo sitios web y apps móviles para negocios que no pueden esperar un trimestre.</p>
              <div className="actions">
                <Link className="btn" href="/contacto">Cuéntame tu proyecto</Link>
                <Link className="btn btn--line" href="/proyectos">Ver proyectos</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap section" aria-labelledby="que-hago">
          <div className="strip"><span id="que-hago">Qué hago</span><span>3 servicios</span></div>
          <h2 className="section-title">Lo rápido se nota en el plazo, no en el acabado.</h2>
          <div className="grid-rules grid-3">
            <div><h3>Sitios web</h3><p>Páginas rápidas, fáciles de actualizar y hechas para que tus clientes te encuentren y te escriban.</p></div>
            <div><h3>Apps móviles</h3><p>Apps para iOS y Android con React Native y Expo, desde la primera versión hasta la tienda.</p></div>
            <div><h3>Diseño en Figma</h3><p>Pantallas y prototipos para que veas y pruebes tu producto antes de escribir una línea de código.</p></div>
          </div>
        </section>

        <section className="wrap section" id="proyectos" aria-labelledby="proyectos-t" style={{ paddingTop: 0 }}>
          <div className="strip"><span id="proyectos-t">Proyectos</span><span>{PROJECTS.length} publicados</span></div>
          <h2 className="section-title">Trabajo reciente.</h2>
          <ProjectList />
          <Link className="more" href="/proyectos">Ver todos los proyectos</Link>
        </section>

        <section className="wrap section" aria-labelledby="proceso-t" style={{ paddingTop: 0 }}>
          <div className="strip"><span id="proceso-t">Cómo trabajo</span><span>3 pasos</span></div>
          <h2 className="section-title">Sin jerga y sin rodeos.</h2>
          <ol className="grid-rules grid-3" style={{ listStyle: "none", paddingLeft: 0 }}>
            <li><span className="step-n">1</span><h3>Me cuentas la idea</h3><p>Una conversación corta para entender qué necesitas, para quién y para cuándo.</p></li>
            <li><span className="step-n">2</span><h3>Te propongo la opción simple</h3><p>Alcance, plazo y precio claros. Si hay un camino más barato que funciona igual, te lo digo.</p></li>
            <li><span className="step-n">3</span><h3>Lo tienes funcionando</h3><p>Entregas en días, con avances que puedes probar y código listo para crecer.</p></li>
          </ol>
        </section>

        <BlogSection />
        <ContactBand />
      </main>
      <Footer />
    </>
  );
}
