import Link from "next/link";
import { EMAIL } from "@/lib/site";

// Cierre de página: una ventana de «mensaje nuevo» ya dirigida a mi correo.
export default function ContactBand() {
  return (
    <section className="band wrap" aria-labelledby="contacto-titulo" id="contacto">
      <div className="win compose">
        <div className="win-bar"><div className="dots" aria-hidden="true"><i /><i /><i /></div><span className="win-title">mensaje nuevo</span><span /></div>
        <div className="compose-fields">
          <div><span>Para:</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
          <div><span>Asunto:</span>tu proyecto</div>
        </div>
        <div className="compose-body">
          <h2 id="contacto-titulo">¿tienes una idea? cuéntamela.</h2>
          <p>Te respondo con alcance, plazo y precio claros. Si hay un camino más simple que funciona igual, te lo digo ;)</p>
          <div className="actions">
            <Link className="btn" href="/contacto">cuéntame tu proyecto</Link>
            <a className="btn btn--line" href={`mailto:${EMAIL}`}>escribir un correo</a>
          </div>
        </div>
      </div>
    </section>
  );
}
