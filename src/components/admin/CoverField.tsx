"use client";

import { useRef, useState } from "react";
import { adminMediaSrc } from "@/lib/admin/shared";
import { uploadImage } from "@/components/admin/client";

export default function CoverField({ value, folder, onChange, onError, onBusy }: {
  value: string; folder: string; onChange: (v: string) => void; onError: (msg: string) => void; onBusy: (delta: number) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);

  async function upload(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    onBusy(1);
    try {
      const { url } = await uploadImage(file, folder);
      onChange(url);
    } catch (e) {
      onError(`No se subió la portada: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      onBusy(-1);
    }
  }

  return (
    <div style={{ display: "grid", gap: ".6rem" }}>
      <div
        role="button"
        tabIndex={0}
        className={`coverbox${value ? " has-img" : ""}${over ? " is-drop" : ""}`}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files[0]); }}
        aria-label={value ? "Cambiar portada" : "Subir portada"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value && <img src={adminMediaSrc(value)} alt="" />}
        <span className="cta">{busy ? <><span className="spin" /> Subiendo…</> : value ? "Cambiar portada" : "Arrastra una foto o haz clic"}</span>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      <div className="row">
        <input className="input" placeholder="…o pega una URL" value={value} onChange={(e) => onChange(e.target.value.trim())} aria-label="URL de la portada" />
        {value && <button type="button" className="btn btn--ghost btn--sm" onClick={() => onChange("")}>Quitar</button>}
      </div>
      <p className="hint">Se muestra en blanco y negro. Mejor una foto de trabajo real, horizontal.</p>
    </div>
  );
}
