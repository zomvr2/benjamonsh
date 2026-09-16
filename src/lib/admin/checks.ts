// Checklist de SEO y marca (Manual de marca v1.0). Se ejecuta en el navegador mientras escribes.
import { countWords, isValidSlug, type Frontmatter } from "@/lib/admin/shared";

export type CheckLevel = "ok" | "warn" | "fail";
export interface Check {
  id: string;
  group: "SEO" | "Contenido" | "Marca";
  level: CheckLevel;
  label: string;
  hint?: string;
}

const between = (n: number, min: number, max: number) => n >= min && n <= max;

const JERGA = [
  "disruptiv", "sinergia", "alto impacto", "entregables", "apalancar", "best-in-class",
  "de clase mundial", "soluciones integrales", "alinear", "holístic",
];

export function runChecks(fm: Frontmatter, slug: string, content: string): Check[] {
  const checks: Check[] = [];
  const add = (c: Check) => checks.push(c);
  const title = fm.title.trim();
  const desc = fm.description.trim();
  const words = countWords(content);
  // Sin bloques de código: ahí un "#" es un comentario, no un título.
  const prose = content.replace(/^(```|~~~)[\s\S]*?^\1/gm, "");
  const fullText = `${title}\n${desc}\n${prose}`;

  // ---------- SEO ----------
  add({
    id: "title", group: "SEO",
    level: !title ? "fail" : between(title.length, 30, 60) ? "ok" : "warn",
    label: `Título de ${title.length} caracteres`,
    hint: "Ideal entre 30 y 60 para que Google no lo corte.",
  });
  add({
    id: "desc", group: "SEO",
    level: !desc ? "fail" : between(desc.length, 70, 160) ? "ok" : "warn",
    label: `Descripción de ${desc.length} caracteres`,
    hint: "Entre 70 y 160. Es el texto que aparece bajo el título en Google.",
  });
  add({
    id: "slug", group: "SEO",
    level: !isValidSlug(slug) ? "fail" : slug.length <= 60 ? "ok" : "warn",
    label: isValidSlug(slug) ? `URL /blog/${slug}` : "URL no válida",
    hint: "Solo minúsculas, números y guiones. Corta y con la palabra clave.",
  });
  add({
    id: "cover", group: "SEO",
    level: fm.cover ? "ok" : "warn",
    label: fm.cover ? "Tiene portada" : "Sin portada",
    hint: "La portada se usa al compartir en redes (Open Graph).",
  });
  add({
    id: "tags", group: "SEO",
    level: fm.tags.length === 0 ? "fail" : between(fm.tags.length, 2, 5) ? "ok" : "warn",
    label: `${fm.tags.length} ${fm.tags.length === 1 ? "tema" : "temas"}`,
    hint: "Entre 2 y 5 temas.",
  });
  const badTags = fm.tags.filter((t) => t !== t.toLowerCase() || /\s{2,}|^\s|\s$/.test(t));
  if (badTags.length) add({ id: "tags-case", group: "SEO", level: "warn", label: `Temas con mayúsculas: ${badTags.join(", ")}`, hint: "Los temas van en minúscula para no duplicar páginas." });
  const firstPara = prose.split(/\n\s*\n/).find((p) => p.trim() && !p.trim().startsWith("#")) ?? "";
  const keyword = fm.tags[0];
  if (keyword) {
    const inIntro = firstPara.toLowerCase().includes(keyword.toLowerCase());
    add({ id: "kw", group: "SEO", level: inIntro ? "ok" : "warn", label: inIntro ? `«${keyword}» aparece en el primer párrafo` : `«${keyword}» no aparece en el primer párrafo`, hint: "El primer tema funciona como palabra clave principal." });
  }
  const links = [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((m) => m[1]).filter((u) => !/\.(png|jpe?g|webp|gif|avif)$/i.test(u));
  const internal = links.filter((u) => u.startsWith("/") || u.includes("benjamonsh.dev"));
  add({ id: "internal", group: "SEO", level: internal.length ? "ok" : "warn", label: `${internal.length} ${internal.length === 1 ? "enlace interno" : "enlaces internos"}`, hint: "Enlaza al menos a otro artículo o página del sitio." });

  // ---------- Contenido ----------
  add({
    id: "words", group: "Contenido",
    level: words >= 300 ? "ok" : words >= 150 ? "warn" : "fail",
    label: `${words} palabras`,
    hint: "Al menos 300 para que el artículo posicione.",
  });
  const h1 = /^#\s/m.test(prose);
  add({ id: "h1", group: "Contenido", level: h1 ? "fail" : "ok", label: h1 ? "Hay un título # en el cuerpo" : "Sin # en el cuerpo", hint: "El título ya es el H1. Usa ## para secciones." });
  const h2 = (prose.match(/^##\s/gm) || []).length;
  add({ id: "h2", group: "Contenido", level: h2 >= 2 ? "ok" : "warn", label: `${h2} ${h2 === 1 ? "sección" : "secciones"} (##)`, hint: "Divide el texto en al menos dos secciones." });
  const imgs = [...content.matchAll(/!\[([^\]]*)\]\(([^)]*)\)/g)];
  const noAlt = imgs.filter((m) => !m[1].trim());
  if (imgs.length) add({ id: "alt", group: "Contenido", level: noAlt.length ? "fail" : "ok", label: noAlt.length ? `${noAlt.length} ${noAlt.length === 1 ? "imagen" : "imágenes"} sin texto alternativo` : "Imágenes con texto alternativo", hint: "Escribe qué muestra la imagen entre los corchetes." });
  const placeholderAlt = imgs.filter((m) => m[1].trim() === "Describe la imagen").length;
  if (placeholderAlt) add({ id: "alt-placeholder", group: "Contenido", level: "warn", label: `${placeholderAlt} ${placeholderAlt === 1 ? "imagen" : "imágenes"} con el texto de ejemplo`, hint: "Cambia «Describe la imagen» por lo que muestra la foto." });
  const uploading = /!\[Subiendo[^\]]*\]\(\)/.test(content);
  if (uploading) add({ id: "uploading", group: "Contenido", level: "fail", label: "Hay imágenes subiéndose", hint: "Espera a que terminen antes de guardar." });
  const longParas = prose.split(/\n\s*\n/).filter((p) => countWords(p) > 120).length;
  add({ id: "paras", group: "Contenido", level: longParas ? "warn" : "ok", label: longParas ? `${longParas} ${longParas === 1 ? "párrafo largo" : "párrafos largos"}` : "Párrafos cortos", hint: "Más de 120 palabras cansa. Parte el párrafo." });
  add({ id: "date", group: "Contenido", level: /^\d{4}-\d{2}-\d{2}$/.test(fm.date) ? "ok" : "fail", label: fm.date ? `Fecha ${fm.date}` : "Sin fecha" });

  // ---------- Marca ----------
  const badName = fullText.match(/\b(?:benja)?monsh\b/gi)?.filter((w) => w !== w.toLowerCase()) ?? [];
  add({ id: "name", group: "Marca", level: badName.length ? "fail" : "ok", label: badName.length ? `Escribiste «${badName[0]}»` : "benjamonsh y monsh en minúscula", hint: "Los dos nombres van siempre en minúscula." });
  const winks = (prose.match(/;\)/g) || []).length + (title.match(/;\)/g) || []).length + (desc.match(/;\)/g) || []).length;
  const endsWithWink = /;\)\s*$/.test(prose.trim());
  add({
    id: "wink", group: "Marca",
    level: winks > 1 ? "fail" : winks === 1 && !endsWithWink ? "warn" : "ok",
    label: winks === 0 ? "Sin guiño ;)" : winks === 1 ? (endsWithWink ? "Un guiño, al cierre" : "El guiño no está al cierre") : `${winks} guiños`,
    hint: "Máximo un ;) por texto, y siempre al final.",
  });
  const emoji = /\p{Extended_Pictographic}/u.test(fullText);
  add({ id: "emoji", group: "Marca", level: emoji ? "warn" : "ok", label: emoji ? "Hay emojis" : "Sin emojis", hint: "La marca no usa emojis; el guiño es tipográfico." });
  const italics = /(^|[^*\w])\*(?!\*)[^*\n]+\*(?!\*)|(^|\W)_[^_\n]+_(?=\W|$)/m.test(prose.replace(/`[^`]*`/g, "").replace(/^\s*[*-]\s/gm, ""));
  add({ id: "italic", group: "Marca", level: italics ? "warn" : "ok", label: italics ? "Usas cursivas" : "Sin cursivas", hint: "El manual no usa cursivas. En el sitio se muestran en peso 600." });
  const jerga = JERGA.filter((j) => fullText.toLowerCase().includes(j));
  add({ id: "jerga", group: "Marca", level: jerga.length ? "warn" : "ok", label: jerga.length ? `Jerga: ${jerga.join(", ")}` : "Sin jerga corporativa", hint: "Claro y breve: explica sin jerga." });
  const stock = /unsplash|pexels|pixabay|shutterstock|istockphoto/i.test(`${fm.cover} ${content}`);
  add({ id: "stock", group: "Marca", level: stock ? "warn" : "ok", label: stock ? "Imagen de banco de fotos" : "Sin fotos de stock", hint: "El manual pide fotos de trabajo real, no stock genérico." });
  const exclam = (fullText.match(/!/g) || []).length - (fullText.match(/!\[/g) || []).length;
  if (exclam > 2) add({ id: "exclam", group: "Marca", level: "warn", label: `${exclam} signos de exclamación`, hint: "Tono claro y tranquilo: pocas exclamaciones." });

  return checks;
}

export function scoreChecks(checks: Check[]): number {
  if (!checks.length) return 0;
  const pts = checks.reduce((s, c) => s + (c.level === "ok" ? 1 : c.level === "warn" ? 0.5 : 0), 0);
  return Math.round((pts / checks.length) * 100);
}

export const hasBlockingIssues = (checks: Check[]) =>
  checks.some((c) => c.level === "fail" && ["slug", "title", "date", "uploading"].includes(c.id));
