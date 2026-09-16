"use client";

export interface ToastState { text: string; error?: boolean; href?: string; hrefLabel?: string }

export default function Toast({ toast, onClose }: { toast: ToastState | null; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div className={`toast${toast.error ? " is-error" : ""}`} role={toast.error ? "alert" : "status"}>
      <span>
        {toast.text}
        {toast.href && <> <a href={toast.href} target="_blank" rel="noopener noreferrer">{toast.hrefLabel ?? "Ver"}</a></>}
      </span>
      <button type="button" onClick={onClose} aria-label="Cerrar">×</button>
    </div>
  );
}
