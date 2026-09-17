# benjamonsh.cl

Sitio personal de Benjamín Delgado (benjamonsh). Next.js 15, MDX y Tailwind 4, con el diseño del Manual de marca v1.0.

## Desarrollo

```bash
npm install
npm run dev
```

## Dónde está cada cosa

- `src/app/globals.css`: sistema visual (colores, Archivo, radio 0, filos de 2 px).
- `src/lib/site.ts`: correo, redes y proyectos.
- `src/content/*.mdx`: artículos del blog.
- `src/app/`: páginas (inicio, proyectos, blog, temas, contacto, enlaces, 404, sitemap y robots).

## Panel del blog (`/admin`)

Escribe, revisa y publica sin tocar código: editor Markdown con vista previa real,
subida de imágenes (se convierten a WebP), checklist de SEO y marca, borradores y
artículos programados. Cada guardado es un commit en GitHub y Vercel despliega solo.

### Configurar (una vez)

1. En GitHub → Settings → Developer settings → Fine-grained tokens, crea un token con
   acceso solo a `zomvr2/benjamonsh` y permiso **Contents: Read and write**.
2. En Vercel → Settings → Environment Variables agrega las variables de `.env.example`
   (`ADMIN_PASSWORD`, `ADMIN_SECRET`, `GITHUB_TOKEN`; el resto es opcional).
3. Para los programados: crea un Deploy Hook (Settings → Git → Deploy Hooks, rama
   `master`), guárdalo en `VERCEL_DEPLOY_HOOK_URL` y define `CRON_SECRET`.
   `vercel.json` corre el cron cada madrugada y despliega si hoy sale un artículo.
4. Despliega y entra a `https://benjamonsh.cl/admin`.

En local, `npm run dev` con `ADMIN_PASSWORD` y `ADMIN_SECRET` en `.env.local` y **sin**
`GITHUB_TOKEN` hace que el panel escriba directo en `src/content` y `public/media/blog`.

### Cómo funciona

- **Borrador** (`draft: true`): no aparece en el sitio. El commit lleva `[sin-deploy]`
  y Vercel se salta el build (`ignoreCommand` en `vercel.json`).
- **Programado**: publicado con fecha futura. Se oculta hasta ese día (hora de Chile).
- **Publicado**: visible en el blog, las etiquetas y el sitemap.
- Las imágenes quedan en `public/media/blog/<slug>/` y salen con el siguiente deploy.
- Si editas un artículo ya publicado, se agrega `updated` y se usa en el sitemap y Open Graph.

## Música (`/admin/musica` y «Escuchando ahora»)

La página `/enlaces` muestra lo que suena en tu cuenta de **Last.fm** (se consulta cada 10 s
desde `/api/now-playing`, sin exponer la API key). Si no suena nada, aparece una de tus favoritas.

1. Crea una API key gratis en https://www.last.fm/api/account/create.
2. Agrega en Vercel `LASTFM_API_KEY` y `LASTFM_USER` (tu usuario de Last.fm).
3. Conecta Spotify a Last.fm (Last.fm → Settings → Applications → Spotify) para que registre lo que escuchas.

En `/admin/musica` agregas favoritas pegando un enlace de Spotify o desde tus escuchas recientes
de Last.fm, les pones una frase propia y las ordenas. Se guardan en `src/data/favoritas.json`
(un commit, igual que los artículos). Una favorita se reconoce por título y artista.

## Publicar un artículo a mano

Crea `src/content/mi-articulo.mdx` con este encabezado:

```yaml
---
title: "Título en minúscula inicial"
description: "Una o dos frases."
date: "2026-09-15"
cover: "https://…"
color: "cian"          # cian, violeta, ambar o verde: un solo color por artículo
tags: ["tema", "otro-tema"]
draft: true            # opcional: borrador, no se publica
---
```

Las tablas usan sintaxis Markdown (GFM). La foto de portada se muestra en blanco y negro.

## Reglas de marca rápidas

Radio 0, todo alineado a la izquierda, sin degradados ni sombras, un color por pieza,
«benjamonsh» siempre en minúscula y máximo un guiño `;)` por texto, al cierre.
