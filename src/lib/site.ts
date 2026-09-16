export const SITE_URL = "https://www.benjamonsh.dev";
export const EMAIL = "zodev@proton.me";

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
}

// Edita aquí los proyectos: aparecen en el inicio y en /proyectos.
export const PROJECTS: Project[] = [
  {
    name: "Auticuidado",
    kind: "Plataforma de salud digital",
    image: "/auticuidado.png",
    description: "Plataforma de salud digital para personas neurodivergentes, sus familias y especialistas, publicada en auticuidado.cl. Desarrollo full-stack de principio a fin: arquitectura y base de datos en PostgreSQL, autenticación, gestión de usuarios, agenda y servicios, con Next.js, Node.js y despliegue en Microsoft Azure.",
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
