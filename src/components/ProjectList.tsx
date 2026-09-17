"use client";
import { useState, type CSSProperties } from "react";
import { PROJECTS, type Project } from "@/lib/site";

function Shot({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const style = project.scrollPan
    ? ({ "--pan": project.scrollPan } as CSSProperties)
    : undefined;
  return (
    <div className={`shot${project.scrollPan ? " shot--scroll" : ""}`}>
      <span className="shot-fallback" aria-hidden="true">{project.name.toLowerCase()}</span>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.image} alt={`Captura de ${project.name}`} loading="lazy" style={style} onError={() => setFailed(true)} />
      )}
    </div>
  );
}

/** Si la URL del proyecto aparece mencionada en la descripción (ej. "auticuidado.cl"), la convierte en link a nueva pestaña. */
function Description({ project }: { project: Project }) {
  const { description, url } = project;
  if (!url) return <p>{description}</p>;

  let hostname = "";
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    hostname = "";
  }

  const idx = hostname ? description.indexOf(hostname) : -1;
  if (idx === -1) return <p>{description}</p>;

  const before = description.slice(0, idx);
  const match = description.slice(idx, idx + hostname.length);
  const after = description.slice(idx + hostname.length);

  return (
    <p>
      {before}
      <a href={url} target="_blank" rel="noopener noreferrer">{match}</a>
      {after}
    </p>
  );
}

export default function ProjectList({ children }: { children?: React.ReactNode }) {
  return (
    <div className="projects">
      {PROJECTS.map((p) => (
        <article className="project" key={p.name}>
          <Shot project={p} />
          <div>
            <h3>{p.name}</h3>
            <p className="kind">{p.kind}</p>
            <Description project={p} />
            {p.badges && p.badges.length > 0 && (
              <ul className="tags project-badges">
                {p.badges.map((b) => (
                  <li key={b} className="tag">{b}</li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
      {children}
    </div>
  );
}
