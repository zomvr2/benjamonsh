import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHead from "@/components/PageHead";
import ProjectList from "@/components/ProjectList";

export const metadata = {
  title: "Proyectos",
  description: "Sitios web y apps móviles que he desarrollado.",
  alternates: { canonical: "/proyectos" },
};

export default function Proyectos() {
  return (
    <>
      <Header current="/proyectos" />
      <main id="contenido">
        <PageHead title="proyectos" lede="Sitios web y apps que he desarrollado de principio a fin, publicados y funcionando." />
        <section className="wrap section" style={{ paddingTop: "clamp(1.5rem, 4vw, 3rem)" }}>
          <ProjectList>
            <div className="slot">
              <div>
                <h3>tu proyecto podría ser el siguiente</h3>
                <p>Cuéntame qué necesitas y te digo cómo lo haría, cuánto tardaría y cuánto costaría.</p>
              </div>
              <Link className="btn" href="/contacto">cuéntame tu idea</Link>
            </div>
          </ProjectList>
        </section>
      </main>
      <Footer />
    </>
  );
}
