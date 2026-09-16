export default function PageHead({
  label, meta, title, lede, children,
}: { label: React.ReactNode; meta?: React.ReactNode; title: React.ReactNode; lede?: string; children?: React.ReactNode }) {
  return (
    <section className="page-head">
      <div className="wrap">
        <div className="strip"><span>{label}</span>{meta && <span>{meta}</span>}</div>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
