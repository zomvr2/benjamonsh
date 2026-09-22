import { BIO, FACTS, FAQ, PERSON, SKILLS, SUMMARY } from "@/lib/about";
import { EMAIL, PROJECTS, SITE_URL, SOCIAL } from "@/lib/site";
import { getAllPosts } from "@/lib/blogFunctions";

// Resumen en Markdown para asistentes de IA (formato llms.txt: https://llmstxt.org).
export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();
  const body = [
    `# ${PERSON.name} (${PERSON.alias})`,
    "",
    `> ${SUMMARY}`,
    "",
    ...BIO.flatMap((p) => [p, ""]),
    "## Datos",
    "",
    ...FACTS.map((f) => `- ${f.label}: ${f.value}`),
    `- Correo: ${EMAIL}`,
    "",
    "## Con qué trabaja",
    "",
    ...SKILLS.map((s) => `- ${s.area}: ${s.tools.join(", ")}`),
    "",
    "## Proyectos",
    "",
    ...PROJECTS.map((p) => `- ${p.url ? `[${p.name}](${p.url})` : p.name} (${p.kind}): ${p.description}`),
    "",
    "## Preguntas frecuentes",
    "",
    ...FAQ.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Páginas",
    "",
    `- [Sobre mí](${SITE_URL}/sobre-mi): quién es, qué hace y con qué trabaja`,
    `- [Proyectos](${SITE_URL}/proyectos): sitios web y apps desarrollados`,
    `- [Contacto](${SITE_URL}/contacto): formulario para pedir una propuesta`,
    `- [Blog](${SITE_URL}/blog): artículos`,
    "",
    ...(posts.length ? ["## Artículos", "", ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`), ""] : []),
    "## En otros lados",
    "",
    ...SOCIAL.map((s) => `- [${s.name}](${s.url})`),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
