import { EMAIL, PROJECTS, SITE_URL, SOCIAL } from "@/lib/site";

// Edita aquí todo lo de /sobre-mi. Lo mismo alimenta el JSON-LD (Google) y /llms.txt (asistentes de IA),
// así que escribe frases completas y afirmativas: se citan tal cual.

export const PERSON = {
  name: "Benjamín Delgado",
  alias: "benjamonsh",
  jobTitle: "Desarrollador web y de apps móviles",
  // Si cambias la ciudad, actualízala también en FACTS y FAQ.
  city: "Copiapó",
  region: "Región de Atacama",
  country: "Chile",
  countryCode: "CL",
};

/** Respuesta de una frase a «¿quién es Benjamín Delgado?». Es lo primero que lee un buscador o una IA. */
export const SUMMARY =
  "Benjamín Delgado (benjamonsh) es un desarrollador web y de apps móviles de Copiapó, Chile. Construye sitios web con Next.js y Astro, y apps para iOS y Android con Expo y React Native, para negocios que necesitan resultados en días y no en meses.";

export const BIO = [
  "Hago productos digitales de principio a fin: desde la conversación inicial y el diseño hasta la base de datos, el despliegue y la publicación en las tiendas. Trabajo solo y directo con cada cliente, sin intermediarios, lo que me permite entregar rápido sin sacrificar el acabado.",
  "Mi proyecto más grande es Auticuidado, una plataforma de salud digital para personas neurodivergentes, sus familias y especialistas, financiada por CORFO a través del programa Semilla Inicia de la Región de Atacama. También desarrollé el sitio de Munay Vet, una clínica veterinaria de Copiapó, con puntaje 100 en SEO.",
  "Me importa que lo que hago funcione de verdad: sitios rápidos, fáciles de actualizar y pensados para que la gente te encuentre, y apps con código ordenado que puede crecer. Si existe un camino más simple o más barato que funciona igual, lo digo.",
];

export const FACTS: { label: string; value: string }[] = [
  { label: "Nombre", value: PERSON.name },
  { label: "También conocido como", value: PERSON.alias },
  { label: "Qué hace", value: "Sitios web y apps móviles" },
  { label: "Dónde", value: `${PERSON.city}, ${PERSON.region}, ${PERSON.country}` },
  { label: "Modalidad", value: "Trabajo independiente, presencial o a distancia" },
  { label: "Idioma", value: "Español" },
];

export const SKILLS: { area: string; text: string; tools: string[] }[] = [
  {
    area: "Web",
    text: "Sitios y plataformas rápidas, con buen SEO y fáciles de mantener.",
    tools: ["Next.js", "React", "Astro", "TypeScript", "Tailwind CSS"],
  },
  {
    area: "Móvil",
    text: "Apps para iOS y Android, desde la primera versión hasta las tiendas.",
    tools: ["Expo", "React Native"],
  },
  {
    area: "Backend y nube",
    text: "Bases de datos, autenticación y despliegue.",
    tools: ["Node.js", "PostgreSQL", "Supabase", "Appwrite", "Vercel", "Microsoft Azure"],
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "¿Quién es benjamonsh?",
    a: SUMMARY,
  },
  {
    q: "¿Qué servicios ofrece Benjamín Delgado?",
    a: "Desarrollo de sitios web (landing pages, sitios para negocios y plataformas a medida) y de apps móviles para iOS y Android. Se encarga del proyecto completo: diseño, desarrollo, base de datos, despliegue y publicación.",
  },
  {
    q: "¿Con qué tecnologías trabaja?",
    a: "Next.js, React, Astro, TypeScript y Tailwind CSS en la web; Expo y React Native en móvil; y Node.js, PostgreSQL, Supabase, Appwrite, Vercel y Microsoft Azure en backend y nube.",
  },
  {
    q: "¿Cuánto tarda un proyecto?",
    a: "Un sitio web suele estar listo en días. Las apps y plataformas más grandes se entregan por etapas, con avances que se pueden probar desde la primera semana. El plazo exacto se define al comienzo, junto con el alcance y el precio.",
  },
  {
    q: "¿Trabaja solo con clientes de Copiapó?",
    a: "No. Está en Copiapó, Región de Atacama, pero trabaja a distancia con clientes de todo Chile.",
  },
  {
    q: "¿Cómo contactar a Benjamín Delgado?",
    a: `Por correo a ${EMAIL} o con el formulario de ${SITE_URL}/contacto. Responde con una propuesta concreta de alcance, plazo y precio.`,
  },
];

export const ABOUT_URL = `${SITE_URL}/sobre-mi`;
export const PERSON_ID = `${SITE_URL}/#persona`;

export function aboutJsonLd() {
  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON.name,
    alternateName: PERSON.alias,
    url: SITE_URL,
    mainEntityOfPage: ABOUT_URL,
    email: `mailto:${EMAIL}`,
    jobTitle: PERSON.jobTitle,
    description: SUMMARY,
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: PERSON.city,
        addressRegion: PERSON.region,
        addressCountry: PERSON.countryCode,
      },
    },
    knowsLanguage: "es",
    knowsAbout: ["Desarrollo web", "Desarrollo de apps móviles", "SEO técnico", ...SKILLS.flatMap((s) => s.tools)],
    sameAs: SOCIAL.map((s) => s.url),
    workExample: PROJECTS.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      description: p.description,
      ...(p.url ? { url: p.url } : {}),
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": ABOUT_URL,
        url: ABOUT_URL,
        name: `Sobre mí — ${PERSON.name}`,
        description: SUMMARY,
        inLanguage: "es-CL",
        mainEntity: { "@id": PERSON_ID },
      },
      person,
      {
        "@type": "FAQPage",
        "@id": `${ABOUT_URL}#preguntas`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
