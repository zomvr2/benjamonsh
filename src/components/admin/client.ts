"use client";

export async function api<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    throw new Error("Tu sesión expiró. Abre /admin/login en otra pestaña, entra y vuelve a intentar (no pierdes lo escrito).");
  }
  if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
  return data as T;
}

const MAX_SIDE = 1800;

/** Reduce y convierte a WebP en el navegador antes de subir (menos peso, menos límites). */
export async function prepareImage(file: File): Promise<{ type: string; data: string; name: string }> {
  const passthrough = ["image/gif", "image/svg+xml"].includes(file.type);
  if (!passthrough && file.type.startsWith("image/")) {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.82));
      if (blob && blob.type === "image/webp") {
        return { type: "image/webp", data: await toBase64(blob), name: file.name };
      }
    } catch {
      /* si falla, se sube el original */
    }
  }
  return { type: file.type, data: await toBase64(file), name: file.name };
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function uploadImage(file: File, folder: string): Promise<{ url: string; path: string }> {
  const img = await prepareImage(file);
  return api("/api/admin/media", {
    method: "POST",
    body: JSON.stringify({ folder, filename: img.name, type: img.type, data: img.data }),
  });
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

export function scoreClass(score: number) {
  return score >= 80 ? "score--ok" : score >= 60 ? "score--warn" : "score--fail";
}

export const STATUS_LABEL = { publicado: "Publicado", programado: "Programado", borrador: "Borrador" } as const;
