"use client";

import type { Check } from "@/lib/admin/checks";

const ICON = { ok: "✓", warn: "!", fail: "×" } as const;
const GROUPS = ["SEO", "Contenido", "Marca"] as const;

export default function Checklist({ checks, score }: { checks: Check[]; score: number }) {
  return (
    <div>
      <div className={`meter${score < 60 ? " is-low" : ""}`} role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label="Puntaje">
        <div style={{ width: `${score}%` }} />
      </div>
      {GROUPS.map((g) => {
        const items = checks.filter((c) => c.group === g).sort((a, b) => rank(a) - rank(b));
        return (
          <div className="checkgroup" key={g}>
            <h3>{g}</h3>
            <ul className="checklist">
              {items.map((c) => (
                <li key={c.id} className={c.level}>
                  <span className="ic" aria-label={c.level === "ok" ? "Bien" : c.level === "warn" ? "Mejorable" : "Falta"}>{ICON[c.level]}</span>
                  <span>
                    {c.label}
                    {c.level !== "ok" && c.hint && <small>{c.hint}</small>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

const rank = (c: Check) => (c.level === "fail" ? 0 : c.level === "warn" ? 1 : 2);
