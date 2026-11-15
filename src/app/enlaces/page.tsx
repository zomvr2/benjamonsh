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
      <Header current="/enlaces" />
      <main id="contenido">
        <section className="wrap links-body">
          <div className="links-ava" aria-hidden="true">;)</div>
          <h1>benjamonsh</h1>
          <p className="lede">Webs y apps que funcionan, en días. Todo lo mío, en un solo lugar.</p>
          <ul className="links-list">
            <li><Link className="btn" href="/contacto"><strong>cuéntame tu proyecto</strong></Link></li>
            <li><Link className="btn btn--line" href="/proyectos"><strong>proyectos</strong><span>{PROJECTS.length} {PROJECTS.length === 1 ? "publicado" : "publicados"}</span></Link></li>
            <li><Link className="btn btn--line" href="/blog"><strong>blog</strong><span>{postCount} {postCount === 1 ? "artículo" : "artículos"}</span></Link></li>
            {SOCIAL.map((s) => (
              <li key={s.name}>
                <a className="btn btn--line" href={s.url} target="_blank" rel="me noopener noreferrer"><strong>{s.name}</strong><span>{s.handle}</span></a>
              </li>
            ))}
            <li><a className="btn btn--line" href={`mailto:${EMAIL}`}><strong>correo</strong><span>{EMAIL}</span></a></li>
          </ul>
          <NowPlaying favorites={favorites as FavoriteTrack[]} />
        </section>
      </main>
      <Footer />
    </>
  );
}
