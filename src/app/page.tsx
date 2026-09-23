import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactBand from "@/components/ContactBand";
import ProjectList from "@/components/ProjectList";
import BlogSection from "@/components/home/BlogSection";
import { PROJECTS } from "@/lib/site";
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

        <section className="hero">
          <div className="wrap">
            <span className="hero-wink" aria-hidden="true">;)</span>
            <h1>
              <span className="line">Webs y apps</span>{" "}
              <span className="line">que funcionan,</span>{" "}
              <span className="line">en días.</span>
            </h1>
            <div className="hero-foot">
              <p>Soy Benjamín Delgado. Desarrollo apps móviles con Expo y React Native, y sitios web de alta calidad en poco tiempo, para negocios que no pueden esperar un trimestre.</p>
              <div className="actions">
                <Link className="btn" href="/contacto">Cuéntame tu proyecto</Link>
                <Link className="btn btn--line" href="/proyectos">Ver proyectos</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap section" aria-labelledby="que-hago">
          <div className="strip"><span id="que-hago">Qué hago</span><span>2 servicios</span></div>
          <h2 className="section-title">Lo rápido se nota en el plazo, no en el acabado.</h2>
          <div className="grid-rules grid-2">
            <div><h3>Sitios web</h3><p>Sitios de alta calidad listos en poco tiempo: rápidos, fáciles de actualizar y hechos para que tus clientes te encuentren y te escriban.</p></div>
            <div><h3>Apps móviles</h3><p>Apps para iOS y Android con Expo y React Native, desde la primera versión hasta la publicación en las tiendas.</p></div>
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
          <h2 className="section-title">Directo, sin vueltas.</h2>
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
