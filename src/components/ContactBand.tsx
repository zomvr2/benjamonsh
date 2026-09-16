import Link from "next/link";
import { EMAIL } from "@/lib/site";

// En las páginas de artículo va en tinta para no sumar el rojo al color del artículo.
export default function ContactBand({ ink = false }: { ink?: boolean }) {
  return (
    <section className={ink ? "band band--ink" : "band"} aria-labelledby="contacto-titulo" id="contacto">
      <div className="wrap">
        <h2 id="contacto-titulo">¿Tienes una idea? Cuéntamela.</h2>
        <div className="band-foot">
          <div>
            <a className="band-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <p>Te respondo con una propuesta concreta ;)</p>
          </div>
          <Link className="btn btn--paper" href="/contacto">Cuéntame tu proyecto</Link>
        </div>
      </div>
    </section>
  );
}
