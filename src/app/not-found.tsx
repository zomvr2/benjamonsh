import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenido">
        <section className="lost">
          <div className="wrap">
            <span className="hero-wink" aria-hidden="true">;)</span>
            <h1>Esta página no existe.</h1>
            <p>Puede que el enlace esté mal escrito o que la página se haya movido. Desde el inicio llegas a todo.</p>
            <div className="actions">
              <Link className="btn" href="/">Ir al inicio</Link>
              <Link className="btn btn--line" href="/blog">Ver el blog</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
