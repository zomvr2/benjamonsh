---
name: benjamonsh
description: Manual de marca v2.0 — el escritorio de benjamonsh. Cercano, indie y nostálgico, nunca corporativo.
colors:
  tapete: "#f5f5f5"
  punto: "#d6d6d6"
  superficie: "#ffffff"
  tinta: "#1f1d1c"
  tinta-suave: "#55514d"
  tinta-tenue: "#6b6763"
  linea: "#d4d2d0"
  linea-fina: "#e6e4e2"
  chip: "#efeeec"
  mandarina: "#ff7a1a"
  mandarina-texto: "#b34a00"
  azul-mensaje: "#0a6be0"
  link: "#0a5fc7"
  error: "#c4213f"
  frutilla: "#e8365d"
  sol: "#ffd23f"
  lima: "#6cc24a"
  uva: "#7b4fb6"
  bondi: "#3cb6dd"
  noche: "#161514"
  noche-punto: "#2f2d2b"
  noche-superficie: "#22201f"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.875rem, 8.2vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  control: "12px"
  ventana: "14px"
  tarjeta: "20px"
  panel: "28px"
  pildora: "999px"
spacing:
  gutter: "clamp(1rem, 4vw, 2.5rem)"
  seccion: "clamp(4rem, 9vw, 7.5rem)"
  max: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.mandarina}"
    textColor: "#3a1600"
    rounded: "{rounded.pildora}"
    padding: "0.8em 1.5em"
  button-secondary:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pildora}"
    padding: "0.8em 1.5em"
  window:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.ventana}"
  bubble-benja:
    backgroundColor: "#e9e9eb"
    textColor: "{colors.tinta}"
    rounded: "22px"
    padding: "0.6rem 1rem"
  bubble-visita:
    backgroundColor: "{colors.azul-mensaje}"
    textColor: "{colors.superficie}"
    rounded: "22px"
    padding: "0.6rem 1rem"
  tag:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.pildora}"
    padding: "0.5rem 0.7rem"
  input:
    backgroundColor: "{colors.tapete}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    padding: "0.8rem 0.95rem"
---

# Manual de marca v2.0 — el escritorio de benjamonsh

## Overview

benjamonsh.cl es el escritorio de un computador de los 2000, mirado con cariño: un tapete gris con puntos, stickers pegados encima, ventanas abiertas con el trabajo real y una conversación como forma de contacto. Reemplaza al manual v1.0 (radio 0, filos de 2 px, sin sombras, todo a la izquierda, solo Archivo, rojo #ec3013), que se descartó entero en noviembre de 2026.

La marca pasó de ruda a **cercana y amigable**. Se siente indie y nostálgica, pero quien llega con un negocio entiende en segundos qué hago y cómo escribirme. Nada corporativo: ni logos de clientes, ni métricas inventadas, ni hero partido de agencia.

Lo único que sobrevive del v1.0:

- **«benjamonsh» siempre en minúscula.**
- **El guiño `;)` como firma.** Máximo uno por texto, al cierre.

Modos por superficie:

- **Persuade** (inicio, proyectos, contacto, enlaces, 404): stickers, ventanas, burbujas, píldoras con brillo.
- **Read** (artículos del blog): la hoja blanca manda; el color del artículo vive solo en su cabecera.
- **Operate** (`/admin`, `/benjapuntos`): mismo tapete, tipos y píldoras, sin stickers ni movimiento decorativo. Densidad y claridad antes que expresión.

## Colors

Estrategia: **tapete + tinta + una acción**. La interfaz vive en grises cálidos con la mandarina como único color de acción. Los «sabores» (guiño a los colores del iMac G3) se usan solo en stickers y en el color propio de cada artículo, nunca para decorar la interfaz.

- **Tapete** `#f5f5f5` con una cuadrícula de puntos `#d6d6d6` de 22 px (`radial-gradient` en `body`). Es la superficie de todo el sitio.
- **Superficie** `#ffffff`: ventanas, tarjetas, burbujas, hojas de lectura.
- **Tinta** `#1f1d1c` para texto; **tinta suave** `#55514d` para bajadas; **tinta tenue** `#6b6763` para metadatos.
- **Mandarina** `#ff7a1a`: el botón principal, siempre con texto oscuro `#3a1600` (el blanco sobre mandarina no pasa contraste). Para texto de acento sobre el tapete se usa `#b34a00`.
- **Azul mensaje** `#0a6be0`: burbujas de quien visita, opciones elegidas y foco. **Link** `#0a5fc7` para enlaces de texto.
- **Error** `#c4213f`.
- **Sabores**: frutilla `#e8365d`, sol `#ffd23f`, lima `#6cc24a`, uva `#7b4fb6`, bondi `#3cb6dd`. Los valores `color` del frontmatter de los artículos se mapean así: `cian` → bondi, `violeta` → uva, `ambar` → sol, `verde` → lima.
- **Modo oscuro = escritorio de noche**: tapete `#161514`, puntos `#2f2d2b`, superficie `#22201f`, texto `#f3f1ee`. Los sabores y la mandarina no cambian. Funciona con `prefers-color-scheme` y con `data-theme` en `<html>`.
- `theme-color` va por esquema: `#f5f5f5` en claro, `#161514` en oscuro.

## Typography

Tres voces, cargadas con `next/font/google` (sin dependencias nuevas):

- **Bricolage Grotesque** (variable, con eje de tamaño óptico) para títulos, el wordmark y los stickers. Pesos 700–800, tracking entre -0.02 y -0.035em, nunca menos de -0.04em. Display máximo 6rem.
- **Atkinson Hyperlegible Next** para texto e interfaz: humanista, muy legible, con un aire a Lucida Grande de Mac OS X.
- **Atkinson Hyperlegible Mono** solo para datos de verdad: fechas, horas, tiempo de lectura, etiquetas, código. Nunca como disfraz de lo «técnico».

Mayúsculas:

- **Títulos, navegación, botones y etiquetas van en minúscula** («hago webs y apps que funcionan, en días ;)», «cuéntame tu proyecto»).
- **El texto corrido lleva mayúsculas normales del español**, para que se lea bien. Los nombres propios de proyectos (Auticuidado, Munay Vet) y los títulos de artículos se respetan tal como vienen.
- Nada de etiquetas en mayúsculas espaciadas sobre los títulos: el título habla solo.

## Layout

- Contenedor `.wrap` de máximo 72rem, con margen lateral `clamp(1rem, 4vw, 2.5rem)` (16 px en teléfono).
- Secciones con `clamp(4rem, 9vw, 7.5rem)` de aire vertical. Cada sección abre con un `.section-head` centrado (título + bajada opcional).
- El hero y las cabeceras de página van **centrados**; el texto largo, alineado a la izquierda.
- Cortes de diseño: 1100 px (los stickers se reacomodan en tablet), 860 px (las grillas pasan a una columna), 820 px (la navegación pasa a menú), 760 px (layout de teléfono).
- Medida de lectura de los artículos: 44rem sobre una hoja blanca.

## Elevation & Depth

Hay profundidad, pero suave y siempre con desplazamiento y desenfoque; nada de halos de color ni sombras duras.

- `--shadow-1`: tarjetas, burbujas, la barra superior.
- `--shadow-win`: ventanas macOS y paneles desplegables.
- `--sticker-shadow`: `drop-shadow` doble que respeta la silueta troquelada de los stickers.
- La barra superior es vidrio esmerilado (`backdrop-filter: blur(12px)`) sobre la superficie al 86 %, porque es la única capa que flota sobre el contenido al hacer scroll.
- Se declara una sola elevación por elemento: o borde fino, o sombra, no un borde marcado bajo una sombra ancha.

## Shapes

- **Píldora** (999 px): botones, etiquetas, opciones, la barra superior, los selectores del panel.
- **Ventana** (14 px): marcos macOS con los tres puntos (rojo `#ff5f57`, amarillo `#febc2e`, verde `#28c840`) y una barra con degradé muy suave.
- **Tarjeta** (20 px): posts, bloques laterales, proyectos del «sobre mí».
- **Panel** (28 px): la cabecera de color de cada artículo y el contenedor del chat.
- **Control** (12–14 px): inputs y bloques de código.
- Las burbujas tienen 22 px, con la esquina de la cola en 7 px (abajo a la izquierda para benja, abajo a la derecha para quien visita).
- Stickers: SVG dibujados a mano con borde blanco troquelado. Nada de ilustraciones que imiten fotos.

## Components

- **Botón principal** `.btn`: píldora con brillo Aqua mandarina. Un degradé de cuatro paradas hace el «caramelo», un `::before` blanco da el reflejo superior, una sombra interior clara y una sombra neutra desplazada. Presionado: `scale(.97)`. Hover (solo con mouse): un poco más de brillo.
- **Botón secundario** `.btn--line`: la misma píldora en «vidrio» blanco-gris. En modo oscuro pasa a grafito con un reflejo más tenue.
- **Barra superior** `.site-head .bar`: píldora flotante y pegajosa con el wordmark, los links en píldoras grises al pasar el mouse y el botón «escríbeme». Bajo 820 px, un `<details>` «menú» abre un panel redondeado.
- **Ventana** `.win` + `.win-bar` + `.dots`: marco de todas las capturas, de la hoja «quién soy», de «datos rápidos», del formulario («mensaje nuevo para benja») y de «Escuchando ahora». Las capturas largas recorren el sitio en loop (`--pan`).
- **Chat** `.chat` + `.msg--benja` / `.msg--visita`: la sección «esto es lo que hago» del inicio y las preguntas frecuentes del «sobre mí». Benja escribe a la izquierda en gris; quien visita, a la derecha en azul.
- **Post** `.post-card`: cada artículo se muestra como una publicación mía (avatar `;)` en sol, fecha y tiempo de lectura en mono) con una barra de su color propio. No se imitan testimonios: no existen y no se inventan.
- **Cierre** `ContactBand`: ventana de «mensaje nuevo» ya dirigida a hola@benjamonsh.cl, con dos acciones (formulario y correo).
- **Stickers** `Stickers.tsx`: credencial «hola, me llamo benja», carpeta «proyectos», sello «hecho en coquimbo · chile», disquete «v2.0», carita guiñando el ojo y cursor. Solo en el hero del inicio y en la 404.
- **Formularios**: inputs redondeados sobre el tapete con foco azul de 4 px, opciones en píldora que se vuelven azules al elegirse, errores con `aria-invalid` y texto en `--error`.
- **Código**: bloque oscuro redondeado con el botón «Copiar» en píldora; al copiar se pone lima.
- **Operate** (`.strip`, `.stats`, `.seg`, `.badge`, `.ptable`): encabezados de sección con conteo en mono, métricas en tarjetas, filtros segmentados en píldora y estados en píldoras de color suave (publicado lima, programado bondi, borrador gris).

### Movimiento

- **Stickers**: se «pegan» al cargar (resorte con `stiffness: 420`, `damping: 18`, uno tras otro cada 70 ms), se enderezan al pasar el mouse y se pueden arrastrar dentro del hero.
- **Chat del inicio**: se escribe una sola vez al verse. Cada burbuja crece desde su cola en 380 ms `cubic-bezier(.23,1,.32,1)`, en orden de conversación.
- **Presión**: `scale(.97)` en 160 ms en botones y opciones.
- Todo hover va detrás de `(hover: hover) and (pointer: fine)`.
- Con `prefers-reduced-motion`, los stickers aparecen quietos, el chat solo hace un fundido de 150 ms y el loop de capturas se detiene.

## Do's and Don'ts

**Sí**

- Escribir «benjamonsh» en minúscula y cerrar con un solo `;)`.
- Mostrar trabajo real en ventanas antes que promesas.
- Hacer que escribir sea lo más fácil del sitio: «cuéntame tu proyecto» siempre a mano.
- Usar los sabores solo en stickers y en el color de cada artículo.
- Mantener `/admin` y `/benjapuntos` sobrios: misma identidad, cero decoración.

**No**

- Inventar testimonios, clientes, logos ni precios.
- Volver al v1.0: radio 0, filos de 2 px, todo a la izquierda, rojo #ec3013, Archivo.
- Poner texto blanco sobre la mandarina o sobre el sol.
- Sumar stickers fuera del hero y de la 404, ni animaciones de entrada en cada sección.
- Usar texto en degradé, halos de color o sombras duras desplazadas.
- Usar mono como adorno, ni etiquetas en mayúsculas espaciadas sobre los títulos.
