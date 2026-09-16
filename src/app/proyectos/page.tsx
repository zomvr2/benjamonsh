import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHead from "@/components/PageHead";
import ProjectList from "@/components/ProjectList";
import { PROJECTS } from "@/lib/site";

export const metadata = {
  title: "Proyectos",
  description: "Sitios web y apps móviles que he diseñado y desarrollado.",
  alternates: { canonical: "/proyectos" },
};

export default function Proyectos() {
  return (
    <>
      <Header current="/proyectos" />
      <main id="contenido">
        <PageHead label="Proyectos" meta={`${PROJECTS.length} publicados`} title="Proyectos."
          lede="Sitios web y apps que he diseñado y construido de principio a fin." />
        <section className="wrap section">
          <ProjectList>
            <div className="slot">
              <div>
                <h3>Tu proyecto podría ser el siguiente.</h3>
                <p>Cuéntame qué necesitas y te digo cómo lo haría, cuánto tardaría y cuánto costaría.</p>
              </div>
              <Link className="btn" href="/contacto">Cuéntame tu idea</Link>
            </div>
          </ProjectList>
        </section>
      </main>
      <Footer />
    </>
  );
}
