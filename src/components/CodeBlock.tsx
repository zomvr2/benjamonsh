"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Estado = "listo" | "copiado" | "error";

const TEXTO: Record<Estado, string> = { listo: "Copiar", copiado: "Copiado", error: "No se pudo" };

// navigator.clipboard solo existe en contextos seguros (https o localhost).
// Si no está, se usa el método antiguo para que también funcione al probar desde otra IP de la red.
async function copiar(texto: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(texto);
    return;
  }
  const area = document.createElement("textarea");
  area.value = texto;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  if (!ok) throw new Error("copy falló");
}

export function CodeBlock({ text, language, children }: { text: string; language?: string; children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>("listo");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onClick = async () => {
    try {
      await copiar(text);
      setEstado("copiado");
    } catch {
      setEstado("error");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setEstado("listo"), 2000);
  };

  return (
    <div className="code-block">
      <button type="button" className="code-copy" data-state={estado} onClick={onClick}
        aria-label={estado === "listo" ? `Copiar código${language ? ` ${language}` : ""}` : TEXTO[estado]}>
        {TEXTO[estado]}
      </button>
      <span className="visually-hidden" aria-live="polite">
        {estado === "copiado" ? "Código copiado al portapapeles" : estado === "error" ? "No se pudo copiar el código" : ""}
      </span>
      {children}
    </div>
  );
}
