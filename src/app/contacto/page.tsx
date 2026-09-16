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
        <PageHead label="Contacto" meta="Correo o formulario" title="Cuéntame tu proyecto."
          lede="Con tres datos me basta para proponerte algo concreto: qué necesitas, para cuándo y cómo te contacto." />
        <div className="wrap">
          <div className="contact-grid">
            <ContactForm />
            <aside>
              <div className="aside-block">
                <h2>Escríbeme directo</h2>
                <p>Si prefieres tu propio correo, escribe a:</p>
                <p style={{ marginTop: ".5rem" }}><a className="aside-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              </div>
              <div className="aside-block">
                <h2>Correcciones o ayuda</h2>
                <p>¿Ya trabajamos juntos y algo no funciona? Usa el mismo correo y cuéntame qué pasó y en qué página.</p>
              </div>
              <div className="aside-block">
                <h2>Qué pasa después</h2>
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
