"use client";
import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/site";

function Shot({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="shot">
      <span className="shot-fallback" aria-hidden="true">{project.name.toLowerCase()}</span>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.image} alt={`Captura de ${project.name}`} loading="lazy" onError={() => setFailed(true)} />
      )}
    </div>
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
            <p>{p.description}</p>
          </div>
        </article>
      ))}
      {children}
    </div>
  );
}
