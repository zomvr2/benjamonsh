# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dueños de pymes y emprendedores que necesitan un sitio web o una app y buscan a alguien que lo haga rápido y bien. Llegan desde una recomendación, Google o redes, y deciden en pocos minutos si escriben o no. Secundarios: lectores del blog (temas variados: música chilena, programación, básquet, cultura) y quien quiera saber quién es Benjamín.

## Product Purpose

benjamonsh.cl es el sitio personal y la vitrina comercial de Benjamín Delgado (benjamonsh), desarrollador independiente de Coquimbo, Chile. Muestra qué hace, lo que ya construyó y cómo trabaja, y lleva a escribirle. Éxito: que un negocio le escriba a hola@benjamonsh.cl (o use el formulario de /contacto) con su proyecto.

## Positioning

Una sola persona, directa con cada cliente, sin intermediarios: webs y apps que funcionan, entregadas en días y no en meses. Si hay un camino más simple o más barato que funciona igual, lo dice. Hecho a mano, sin plantillas.

## Operating Context

- Next.js 16 (App Router), MDX, Tailwind 4, desplegado en Vercel desde la rama `master`.
- Páginas públicas: inicio, sobre mí, proyectos, blog (+ etiquetas), contacto, enlaces (con «Escuchando ahora» de Last.fm y canciones favoritas), 404, llms.txt.
- Panel privado `/admin` para escribir y programar artículos, subir medios y gestionar la música favorita.
- `/benjapuntos`: área privada con login (puntos y ofertas canjeables) para un grupo cerrado de usuarios.
- Contenido editable en `src/lib/site.ts`, `src/lib/about.ts`, `src/content/*.mdx` y `src/data/favoritas.json`.

## Capabilities and Constraints

- Servicios: sitios web (landing pages, sitios para negocios, plataformas a medida) y apps móviles iOS/Android con Expo y React Native. No hace trabajo de diseño en Figma como servicio aparte.
- Sin precios publicados: cada propuesta trae alcance, plazo y precio claros.
- Contacto principal: correo hola@benjamonsh.cl y formulario de /contacto. Redes: LinkedIn, GitHub, Instagram, Spotify.
- Debe seguir siendo rápido, accesible y con buen SEO (JSON-LD, sitemap, Open Graph, llms.txt).
- Los artículos del blog tienen un color propio por artículo (campo `color` en el frontmatter) y los bloques de código llevan botón de copiar.

## Brand Commitments

- «benjamonsh» siempre en minúscula.
- El guiño `;)` es la firma de la marca.
- Voz: cercana, directa, en español de Chile, sin vueltas. El rediseño (nov 2026) cambia la marca de algo rudo a algo cercano y amigable; el resto de la identidad visual anterior (manual v1.0) se descarta.

## Evidence on Hand

- Proyectos reales: Auticuidado (plataforma de salud digital; CORFO, Semilla Inicia Región de Atacama, CORPROA · ATEM) con captura `public/auticuidado.webp`; Munay Vet (clínica veterinaria en Copiapó; 100 SEO, 2/2 navegación agéntica) con captura `public/munayvet.jpg`.
- Bio, datos, habilidades y FAQ en `src/lib/about.ts`.
- No hay testimonios, logos de clientes ni precios: no inventarlos.

## Product Principles

1. Que escribir sea lo más fácil del sitio.
2. Mostrar trabajo real antes que promesas.
3. Cercano como una conversación, nunca corporativo.
4. Rápido y liviano: el sitio es la prueba de lo que vende.
