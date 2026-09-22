import Link from "next/link";
import Wordmark from "@/components/Wordmark";

const ITEMS = [
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/blog", label: "Blog" },
  { href: "/enlaces", label: "Enlaces" },
];

export default function Header({ current }: { current?: string }) {
  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <header className="site-head">
        <div className="wrap">
          <Wordmark />
          <nav className="nav" aria-label="Principal">
            {ITEMS.map((item) => (
              <Link key={item.href} href={item.href} aria-current={current === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            <Link className="btn" href="/contacto">Cuéntame tu proyecto</Link>
          </nav>
          <details className="menu">
            <summary>Menú</summary>
            <nav className="menu-panel" aria-label="Principal">
              {ITEMS.map((item) => (
                <Link key={item.href} href={item.href}>{item.label}</Link>
              ))}
              <Link href="/contacto">Cuéntame tu proyecto</Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
