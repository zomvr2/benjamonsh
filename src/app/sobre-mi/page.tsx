import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHead from "@/components/PageHead";
import ContactBand from "@/components/ContactBand";
import { BIO, FACTS, FAQ, LEDE, PERSON, SKILLS, SUMMARY, aboutJsonLd } from "@/lib/about";
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

        <PageHead crumb={`${PERSON.name} · ${PERSON.alias}`} title="hola, soy benjamín" lede={LEDE} />

        <div className="wrap">
          <div className="about-grid">
            <section className="win about-bio" aria-labelledby="bio-t">
              <div className="win-bar"><div className="dots" aria-hidden="true"><i /><i /><i /></div><h2 className="win-title" id="bio-t">quién soy</h2><span /></div>
              <div className="bio-body">
                {BIO.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
            <aside className="about-side" aria-label="Datos rápidos">
              <div className="win">
                <div className="win-bar"><div className="dots" aria-hidden="true"><i /><i /><i /></div><span className="win-title">datos rápidos</span><span /></div>
                <dl className="facts">
                  {FACTS.map((f) => (
                    <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
                  ))}
                </dl>
              </div>
              <div className="aside-block">
                <h2>en otros lados</h2>
                <ul className="tags" style={{ marginTop: ".75rem" }}>
                  {SOCIAL.map((s) => (
                    <li key={s.name}><a className="tag" href={s.url} target="_blank" rel="me noopener noreferrer">{s.name}</a></li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>

        <section className="wrap section" aria-labelledby="stack-t">
          <div className="section-head">
            <h2 className="section-title" id="stack-t">herramientas probadas, no modas</h2>
          </div>
          <div className="skills">
            {SKILLS.map((s) => (
              <div className="skill" key={s.area}>
                <h3>{s.area.toLowerCase()}</h3>
                <p>{s.text}</p>
                <ul className="tags">
                  {s.tools.map((t) => <li key={t}><span className="tag">{t}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section" aria-labelledby="trabajo-t" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2 className="section-title" id="trabajo-t">lo que he construido</h2>
          </div>
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
          <div style={{ textAlign: "center" }}><Link className="more" href="/proyectos">ver los proyectos con imágenes</Link></div>
        </section>

        <section className="wrap section" aria-labelledby="preguntas-t" id="preguntas" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2 className="section-title" id="preguntas-t">lo que suelen preguntarme</h2>
          </div>
          <dl className="chat faq">
            {FAQ.map((f) => (
              <div key={f.q}><dt className="msg msg--visita">{f.tu}</dt><dd className="msg msg--benja">{f.yo}</dd></div>
            ))}
          </dl>
        </section>

        <ContactBand />
      </main>
      <Footer />
    </>
  );
}
