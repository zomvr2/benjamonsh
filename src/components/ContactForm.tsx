"use client";
import { useRef, useState, type FormEvent } from "react";
import { EMAIL } from "@/lib/site";

const TIPOS = ["Sitio web", "App móvil", "Otra cosa"];
const PLAZOS = ["Lo antes posible", "Este mes", "Sin apuro"];

export default function ContactForm() {
  const [status, setStatus] = useState<{ text: string; error: boolean; field?: "nombre" | "idea" }>({ text: "", error: false });
  const nameRef = useRef<HTMLInputElement>(null);
  const ideaRef = useRef<HTMLTextAreaElement>(null);
  // Mensaje ya armado: si el mailto no abre nada (correo web, sin app de correo), queda Gmail o copiar.
  const [listo, setListo] = useState<{ subject: string; body: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const nombre = String(data.get("nombre") ?? "").trim();
    const idea = String(data.get("idea") ?? "").trim();
    if (!nombre) {
      setStatus({ text: "Escribe tu nombre para poder responderte.", error: true, field: "nombre" });
      nameRef.current?.focus();
      return;
    }
    if (!idea) {
      setStatus({ text: "Cuéntame tu idea en una o dos frases.", error: true, field: "idea" });
      ideaRef.current?.focus();
      return;
    }
    const tipo = String(data.get("tipo"));
    const plazo = String(data.get("plazo"));
    const subject = `Proyecto: ${tipo} (${nombre})`;
    const body = `Hola, soy ${nombre}.\n\nNecesito: ${tipo}\nPlazo: ${plazo}\n\n${idea}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setListo({ subject, body });
    setCopiado(false);
    setStatus({ text: "Tu mensaje está listo en tu app de correo. ¿No se abrió nada? Mándalo desde aquí:", error: false });
  }

  async function copiar() {
    if (!listo) return;
    try {
      await navigator.clipboard.writeText(`Para: ${EMAIL}
Asunto: ${listo.subject}

${listo.body}`);
      setCopiado(true);
    } catch {
      setStatus({ text: `No pude copiarlo. Escríbeme directo a ${EMAIL}.`, error: true });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-nombre">Tu nombre</label>
        <input ref={nameRef} className="input" id="f-nombre" name="nombre" autoComplete="name" required aria-invalid={status.field === "nombre" || undefined} />
      </div>
      <div className="field">
        <fieldset>
          <legend>Qué necesitas</legend>
          <div className="choices">
            {TIPOS.map((t, i) => (
              <label className="choice" key={t}>
                <input type="radio" name="tipo" value={t} defaultChecked={i === 0} /><span>{t}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="field">
        <fieldset>
          <legend>Para cuándo</legend>
          <div className="choices">
            {PLAZOS.map((p, i) => (
              <label className="choice" key={p}>
                <input type="radio" name="plazo" value={p} defaultChecked={i === 0} /><span>{p}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="field">
        <label htmlFor="f-idea">Tu idea</label>
        <span className="hint" id="f-idea-hint">Qué hace tu negocio y qué te gustaría lograr. No necesitas términos técnicos.</span>
        <textarea ref={ideaRef} className="input" id="f-idea" name="idea" aria-describedby="f-idea-hint" required aria-invalid={status.field === "idea" || undefined} />
      </div>
      <div className="form-actions">
        <button className="btn" type="submit">abrir correo con mi idea</button>
        <p className={`form-status${status.error ? " is-error" : ""}`} role="status" aria-live="polite">{status.text}</p>
      </div>
      {listo && (
        <div className="form-fallback">
          <a className="btn btn--line btn--sm" target="_blank" rel="noopener noreferrer"
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent(listo.subject)}&body=${encodeURIComponent(listo.body)}`}>
            enviar con gmail
          </a>
          <button className="btn btn--line btn--sm" type="button" onClick={copiar}>{copiado ? "copiado ;)" : "copiar mensaje"}</button>
        </div>
      )}
    </form>
  );
}
