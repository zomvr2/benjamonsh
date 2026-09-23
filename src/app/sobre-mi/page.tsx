import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHead from "@/components/PageHead";
import ContactBand from "@/components/ContactBand";
import { BIO, FACTS, FAQ, PERSON, SKILLS, SUMMARY, aboutJsonLd } from "@/lib/about";
import { PROJECTS, SOCIAL } from "@/lib/site";

export const metadata = {
  title: "Sobre mí",
  description: SUMMARY,
  alternates: { canonical: "/sobre-mi" },
  openGraph: { title: `Sobre mí — ${PERSON.name}`, description: SUMMARY, url: "/sobre-mi", type: "profile" },
};

export default function SobreMi() {
  return (
    <>
      <Header current="/sobre-mi" />
      <main id="contenido">
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd()).replace(/</g, "\\u003c") }} />

        <PageHead label="Sobre mí" meta={`${PERSON.name} · ${PERSON.alias}`} title="Hola, soy Benjamín." lede={SUMMARY} />

        <div className="wrap">
          <div className="about-grid">
            <section className="about-bio" aria-labelledby="bio-t">
              <h2 id="bio-t">Quién soy</h2>
              {BIO.map((p) => <p key={p}>{p}</p>)}
            </section>
            <aside aria-labelledby="datos-t">
              <div className="aside-block">
                <h2 id="datos-t">Datos rápidos</h2>
                <dl className="facts">
                  {FACTS.map((f) => (
                    <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
                  ))}
                </dl>
              </div>
              <div className="aside-block">
                <h2>En otros lados</h2>
                <ul className="tags">
                  {SOCIAL.map((s) => (
                    <li key={s.name}><a className="tag" href={s.url} target="_blank" rel="me noopener noreferrer">{s.name}</a></li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>

        <section className="wrap section" aria-labelledby="stack-t" style={{ paddingTop: 0 }}>
          <div className="strip"><span id="stack-t">Con qué trabajo</span><span>{SKILLS.length} áreas</span></div>
          <h2 className="section-title">Herramientas probadas, no modas.</h2>
          <div className="grid-rules grid-3">
            {SKILLS.map((s) => (
              <div key={s.area}>
                <h3>{s.area}</h3>
                <p>{s.text}</p>
                <ul className="tags about-tools">
                  {s.tools.map((t) => <li key={t}><span className="tag">{t}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section" aria-labelledby="trabajo-t" style={{ paddingTop: 0 }}>
          <div className="strip"><span id="trabajo-t">Trabajo destacado</span><span>{PROJECTS.length} proyectos</span></div>
          <h2 className="section-title">Lo que he construido.</h2>
          <ul className="about-list">
            {PROJECTS.map((p) => (
              <li key={p.name}>
                <h3>{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a> : p.name}</h3>
                <div>
                  <p className="about-kind">{p.kind}</p>
                  <p>{p.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link className="more" href="/proyectos">Ver los proyectos con imágenes</Link>
        </section>

        <section className="wrap section" aria-labelledby="preguntas-t" id="preguntas" style={{ paddingTop: 0 }}>
          <div className="strip"><span id="preguntas-t">Preguntas frecuentes</span><span>{FAQ.length} respuestas</span></div>
          <h2 className="section-title">Lo que suelen preguntarme.</h2>
          <dl className="faq">
            {FAQ.map((f) => (
              <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>
            ))}
          </dl>
        </section>

        <ContactBand />
      </main>
      <Footer />
    </>
  );
}
