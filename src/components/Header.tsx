import Link from "next/link";
import Wordmark from "@/components/Wordmark";

const ITEMS = [
  { href: "/sobre-mi", label: "sobre mí" },
  { href: "/proyectos", label: "proyectos" },
  { href: "/blog", label: "blog" },
  { href: "/enlaces", label: "enlaces" },
];

export default function Header({ current }: { current?: string }) {
  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <header className="site-head wrap">
        <div className="bar">
          <Wordmark />
          <nav className="nav" aria-label="Principal">
            {ITEMS.map((item) => (
              <Link key={item.href} href={item.href} aria-current={current === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            <Link className="btn btn--sm" href="/contacto" aria-current={current === "/contacto" ? "page" : undefined}>escríbeme</Link>
          </nav>
          <details className="menu">
            <summary>menú</summary>
            <nav className="menu-panel" aria-label="Principal">
              {ITEMS.map((item) => (
                <Link key={item.href} href={item.href} aria-current={current === item.href ? "page" : undefined}>{item.label}</Link>
              ))}
              <Link className="btn" href="/contacto">cuéntame tu proyecto</Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
