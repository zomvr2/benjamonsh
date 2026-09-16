import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NowPlaying from "@/components/NowPlaying";
import { getAllPosts } from "@/lib/blogFunctions";
import { EMAIL, PROJECTS, SOCIAL } from "@/lib/site";
import favorites from "@/data/favoritas.json";
import type { FavoriteTrack } from "@/lib/music";

export const metadata = {
  title: "Enlaces",
  description: "Todos mis enlaces: proyectos, blog, GitHub, Instagram, Spotify y contacto.",
  alternates: { canonical: "/enlaces" },
};

export default function Enlaces() {
  const postCount = getAllPosts().length;
  return (
    <>
      <div className="links-page">
        <Header current="/enlaces" />
        <main id="contenido">
          <section className="wrap links-body">
            <span className="links-wink" aria-hidden="true">;)</span>
            <h1>benjamonsh</h1>
            <p className="lede">Webs y apps que funcionan, en días. Todo lo mío, en un solo lugar.</p>
            <NowPlaying favorites={favorites as FavoriteTrack[]} />
            <ul className="links-list">
              <li><Link href="/contacto"><strong>Cuéntame tu proyecto</strong><span>Formulario</span></Link></li>
              <li><Link href="/proyectos"><strong>Proyectos</strong><span>{PROJECTS.length} publicados</span></Link></li>
              <li><Link href="/blog"><strong>Blog</strong><span>{postCount} artículos</span></Link></li>
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <a href={s.url} target="_blank" rel="me noopener noreferrer"><strong>{s.name}</strong><span>{s.handle}</span></a>
                </li>
              ))}
              <li><a href={`mailto:${EMAIL}`}><strong>Correo</strong><span>{EMAIL}</span></a></li>
            </ul>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
