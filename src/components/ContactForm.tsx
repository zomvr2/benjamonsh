"use client";
import { useRef, useState, type FormEvent } from "react";
import { EMAIL } from "@/lib/site";

const TIPOS = ["Sitio web", "App móvil", "Otra cosa"];
const PLAZOS = ["Lo antes posible", "Este mes", "Sin apuro"];

export default function ContactForm() {
  const [status, setStatus] = useState<{ text: string; error: boolean }>({ text: "", error: false });
  const nameRef = useRef<HTMLInputElement>(null);
  const ideaRef = useRef<HTMLTextAreaElement>(null);

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const nombre = String(data.get("nombre") ?? "").trim();
    const idea = String(data.get("idea") ?? "").trim();
    if (!nombre) {
      setStatus({ text: "Escribe tu nombre para poder responderte.", error: true });
      nameRef.current?.focus();
      return;
    }
    if (!idea) {
      setStatus({ text: "Cuéntame tu idea en una o dos frases.", error: true });
      ideaRef.current?.focus();
      return;
    }
    const tipo = String(data.get("tipo"));
    const plazo = String(data.get("plazo"));
    const subject = `Proyecto: ${tipo} (${nombre})`;
    const body = `Hola, soy ${nombre}.\n\nNecesito: ${tipo}\nPlazo: ${plazo}\n\n${idea}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus({ text: `Abrimos tu app de correo con el mensaje listo. Si no se abrió, escribe a ${EMAIL}.`, error: false });
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-nombre">Tu nombre</label>
        <input ref={nameRef} className="input" id="f-nombre" name="nombre" autoComplete="name" required />
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
        <textarea ref={ideaRef} className="input" id="f-idea" name="idea" aria-describedby="f-idea-hint" required />
      </div>
      <div className="form-actions">
        <button className="btn" type="submit">Abrir correo con mi idea</button>
        <p className={`form-status${status.error ? " is-error" : ""}`} role="status" aria-live="polite">{status.text}</p>
      </div>
    </form>
  );
}
