import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { EMAIL, SOCIAL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Wordmark />
            <p className="tagline">De la idea al producto, sin rodeos.</p>
          </div>
          <div className="foot-col">
            <h2>Sitio</h2>
            <ul>
              <li><Link href="/sobre-mi">Sobre mí</Link></li>
              <li><Link href="/proyectos">Proyectos</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/enlaces">Enlaces</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h2>En otros lados</h2>
            <ul>
              {SOCIAL.map((s) => (
                <li key={s.name}><a href={s.url} target="_blank" rel="me noopener noreferrer">{s.name}</a></li>
              ))}
              <li><a href={`mailto:${EMAIL}`}>Correo</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-base">
          <span>© {new Date().getFullYear()} Benjamín Delgado</span>
          <span>Hecho a mano, sin plantillas.</span>
        </div>
      </div>
    </footer>
  );
}
