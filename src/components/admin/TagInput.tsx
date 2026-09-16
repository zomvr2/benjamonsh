"use client";

import { useState } from "react";

const clean = (t: string) => t.trim().toLowerCase().replace(/^#/, "").replace(/\s+/g, "-");

export default function TagInput({ value, onChange, suggestions }: {
  value: string[]; onChange: (tags: string[]) => void; suggestions: string[];
}) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const parts = raw.split(",").map(clean).filter(Boolean);
    if (!parts.length) return;
    onChange([...new Set([...value, ...parts])]);
    setDraft("");
  }

  const q = clean(draft);
  const hints = suggestions.filter((s) => !value.includes(s) && (!q || s.includes(q))).slice(0, 10);

  return (
    <div>
      <div className="chips">
        {value.map((t) => (
          <span className="chip" key={t}>
            #{t}
            <button type="button" aria-label={`Quitar ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}>×</button>
          </span>
        ))}
        <input
          value={draft}
          placeholder={value.length ? "" : "python, tutorial…"}
          aria-label="Agregar tema"
          onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); add(draft); }
            if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={() => add(draft)}
        />
      </div>
      {hints.length > 0 && (
        <div className="suggest" aria-label="Temas usados antes">
          {hints.map((s) => <button key={s} type="button" onClick={() => add(s)}>+ {s}</button>)}
        </div>
      )}
      <p className="hint" style={{ marginTop: ".4rem" }}>El primero cuenta como palabra clave. Enter o coma para agregar.</p>
    </div>
  );
}
