import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Stickers from "@/components/home/Stickers";

export const metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenido">
        <section className="lost wrap">
          <Stickers />
          <h1>esta página no existe <span className="wink">;)</span></h1>
          <p>Puede que el enlace esté mal escrito o que la página se haya movido. Desde el inicio llegas a todo.</p>
          <div className="actions">
            <Link className="btn" href="/">ir al inicio</Link>
            <Link className="btn btn--line" href="/blog">ver el blog</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
