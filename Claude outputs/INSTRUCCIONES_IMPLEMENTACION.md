# Implementación de botón "Copiar código" al portapapeles

## Resumen
Se ha creado un componente React que agrega un botón para copiar código al portapapeles en todos los bloques de código del blog.

## Archivos a modificar/crear

### 1. Crear nuevo componente `CodeBlock.tsx`
**Ruta:** `src/components/CodeBlock.tsx`

- Copia el contenido del archivo `CodeBlock.tsx` que se adjunta
- Este componente:
  - Es un client component (usa `'use client'`)
  - Maneja el estado del botón (copiado/no copiado)
  - Muestra un SVG de ícono dependiendo del estado
  - Copia el texto al portapapeles con `navigator.clipboard.writeText()`
  - Muestra feedback visual por 2 segundos

### 2. Actualizar `mdx-components.tsx`
**Ruta:** `src/mdx-components.tsx`

- Reemplaza el contenido con la versión actualizada que adjuntamos
- **Cambios principales:**
  - Importa el nuevo componente `CodeBlock`
  - Agrega un manejador `pre` que detecta bloques de código con lenguaje
  - Envuelve los bloques de código en el nuevo componente
  - Mantiene la compatibilidad con código inline (`code` tags sin `pre`)

### 3. Actualizar estilos CSS
**Ruta:** `src/app/globals.css`

- Copia y pega el contenido de `code-block-styles.css` al final de `globals.css`
- **Los estilos incluyen:**
  - Posicionamiento del botón en la esquina superior derecha
  - Estilos de hover y focus
  - Transiciones suaves
  - Modo oscuro (dark mode)
  - Responsividad móvil (oculta el texto en móvil, solo muestra ícono)

## Detalles de implementación

### Estructura del componente CodeBlock
```tsx
<div class="code-block-wrapper">
  <button class="copy-button">
    [SVG Ícono] [Texto "Copiar" o "Copiado"]
  </button>
  <code class={className}>{children}</code>
</div>
```

### Cómo funciona en el MDX
1. Markdown con bloques de código:
   ```javascript
   const hello = "world";
   ```
   
2. Se convierte a:
   ```html
   <pre class="language-javascript">
     <code>...</code>
   </pre>
   ```

3. El manejador `pre` detecta esto y envuelve el contenido con `CodeBlock`

### Características
- ✅ Ícono de copiar (clipboard)
- ✅ Ícono de confirmación (checkmark) cuando se copia
- ✅ Feedback visual durante 2 segundos
- ✅ Funciona en light mode y dark mode
- ✅ Responsive (en móvil solo muestra el ícono)
- ✅ Accesibilidad (aria-label, focus-visible)
- ✅ Transiciones suaves

## Pruebas
Después de implementar:

1. Abre el blog en desarrollo (`npm run dev`)
2. Abre un artículo que tenga bloques de código
3. Verifica que el botón aparezca en la esquina superior derecha
4. Haz click en el botón y verifica que:
   - El código se copie al portapapeles
   - El ícono cambie a un checkmark
   - El texto cambie a "Copiado"
   - Después de 2 segundos vuelva al estado original

## Notas técnicas

### Variables CSS utilizadas
- `--code-bg`: Color de fondo del código
- `--code-fg`: Color del texto del código
- `--gris-700`, `--gris-500`, etc.: Colores para los estados del botón
- `--acento-texto`: Color del outline en focus
- `--font`: Familia de fuentes

### Compatibilidad
- Requiere navegador moderno con soporte para `navigator.clipboard.writeText()`
- Es un cliente component, funciona solo en el navegador
- Compatible con Next.js 13+ (App Router)

### Alternativa sin client component
Si prefieres no usar `'use client'`, puedes crear dos versiones:
1. Una versión SSR que solo muestre el botón
2. Usa Suspense y lazy loading para cargar el componente interactivo

Pero la versión actual es más simple y efectiva.

## Customización

Puedes cambiar:
- Los textos "Copiar" y "Copiado" (busca en CodeBlock.tsx)
- Los ícono SVG
- Los colores del botón (en code-block-styles.css)
- El tiempo que muestra "Copiado" (2000ms en CodeBlock.tsx)
- El tamaño y posición del botón (en code-block-styles.css)
