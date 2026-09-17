export const SITE_URL = "https://benjamonsh.cl";
export const EMAIL = "hola@benjamonsh.cl";

export const SOCIAL = [
  { name: "GitHub", url: "https://github.com/zomvr2", handle: "zomvr2" },
  { name: "Instagram", url: "https://www.instagram.com/benjamonsh/", handle: "@benjamonsh" },
  { name: "Spotify", url: "https://open.spotify.com/user/0h5li5o0jmc9r1pw12lxt4jvn", handle: "Mis playlists" },
];

export interface Project {
  name: string;
  kind: string;
  image: string;
  description: string;
  /** URL pública del proyecto. Si el dominio aparece mencionado en la descripción, se convierte en link (nueva pestaña). */
  url?: string;
  /** Para capturas de página completa: cuánto sube la imagen (ej. "-83%") para recorrer todo el sitio en un loop suave. */
  scrollPan?: string;
  /** Créditos cortos (financiamiento, patrocinadores, métricas) que se muestran como tags bajo la descripción. */
  badges?: string[];
}

// Edita aquí los proyectos: aparecen en el inicio y en /proyectos.
export const PROJECTS: Project[] = [
  {
    name: "Auticuidado",
    kind: "Plataforma de salud digital",
    image: "/auticuidado.png",
    url: "https://auticuidado.cl",
    description: "Plataforma de salud digital para personas neurodivergentes, sus familias y especialistas, publicada en auticuidado.cl. Desarrollo full-stack de principio a fin: arquitectura y base de datos en PostgreSQL, autenticación, gestión de usuarios, agenda y servicios, con Next.js, Node.js y despliegue en Microsoft Azure.",
    badges: ["Proyecto CORFO", "Semilla Inicia Región de Atacama", "CORPROA · Atacama Talento Emprendedor"],
    scrollPan: "-65.5%",
  },
  {
    name: "Munay Vet",
    kind: "Sitio web de clínica veterinaria",
    image: "/munayvet.jpg",
    url: "https://munayvet.cl",
    description: "Sitio web para Munay Vet, clínica veterinaria en Copiapó especializada en atención a domicilio, medicina preventiva y animales exóticos, publicado en munayvet.cl. Hecho con Astro y Tailwind.",
    badges: ["100 SEO", "2/2 navegación agéntica"],
    scrollPan: "-83%",
  },
  {
    name: "Playbox",
    kind: "Sitio web de películas",
    image: "/playbox.png",
    description: "Un sitio para explorar películas y decidir qué ver. Hecho con Next.js y Tailwind, publicado en Vercel.",
  },
  {
    name: "Echo",
    kind: "App móvil de música",
    image: "/echo.png",
    description: "Una app para escuchar música desde el teléfono, hecha con React Native y Supabase.",
  },
];
