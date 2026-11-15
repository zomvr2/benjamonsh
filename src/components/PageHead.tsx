export default function PageHead({
  crumb, title, lede, children,
}: { crumb?: React.ReactNode; title: React.ReactNode; lede?: string; children?: React.ReactNode }) {
  return (
    <section className="page-head wrap">
      {crumb && <span className="crumb">{crumb}</span>}
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {children}
    </section>
  );
}
