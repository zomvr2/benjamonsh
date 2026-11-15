import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHead from "@/components/PageHead";
import ContactForm from "@/components/ContactForm";
import { EMAIL } from "@/lib/site";

export const metadata = {
  title: "Contacto",
  description: "Cuéntame tu proyecto de sitio web o app móvil y te respondo con una propuesta concreta.",
  alternates: { canonical: "/contacto" },
};

export default function Contacto() {
  return (
    <>
      <Header current="/contacto" />
      <main id="contenido">
        <PageHead title="cuéntame tu proyecto" lede="Tu nombre, qué necesitas, para cuándo y tu idea en un par de frases. Con eso te propongo algo concreto." />
        <div className="wrap">
          <div className="contact-grid">
            <div className="win">
              <div className="win-bar"><div className="dots" aria-hidden="true"><i /><i /><i /></div><span className="win-title">mensaje nuevo para benja</span><span /></div>
              <div className="form-body"><ContactForm /></div>
            </div>
            <aside className="aside-stack">
              <div className="aside-block">
                <h2>escríbeme directo</h2>
                <p>Si prefieres tu propio correo, escribe a:</p>
                <p style={{ marginTop: ".5rem" }}><a className="aside-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              </div>
              <div className="aside-block">
                <h2>correcciones o ayuda</h2>
                <p>¿Ya trabajamos juntos y algo no funciona? Usa el mismo correo y cuéntame qué pasó y en qué página.</p>
              </div>
              <div className="aside-block">
                <h2>qué pasa después</h2>
                <p>Te respondo con alcance, plazo y precio. Si te parece, nos ponemos manos a la obra.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
