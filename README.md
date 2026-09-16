# benjamonsh.dev

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

## Publicar un artículo

Crea `src/content/mi-articulo.mdx` con este encabezado:

```yaml
---
title: "Título en minúscula inicial"
description: "Una o dos frases."
date: "2026-09-15"
cover: "https://…"
color: "cian"          # cian, violeta, ambar o verde: un solo color por artículo
tags: ["tema", "otro-tema"]
---
```

Las tablas usan sintaxis Markdown (GFM). La foto de portada se muestra en blanco y negro.

## Reglas de marca rápidas

Radio 0, todo alineado a la izquierda, sin degradados ni sombras, un color por pieza,
«benjamonsh» siempre en minúscula y máximo un guiño `;)` por texto, al cierre.
