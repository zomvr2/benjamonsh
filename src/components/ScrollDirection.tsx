'use client';

import { useEffect } from 'react';

// Marca en <html> si el scroll va bajando o subiendo (data-scroll="down" | "up").
// El desenfoque al pasar (globals.css) se marca más al bajar y casi nada al subir.
export default function ScrollDirection() {
  useEffect(() => {
    const root = document.documentElement;
    let anchor = scrollY;
    const onScroll = () => {
      const dy = scrollY - anchor;
      // Solo cambia tras 24px en la misma dirección: los rebotes del trackpad no hacen parpadear el desenfoque.
      if (Math.abs(dy) < 24) return;
      root.dataset.scroll = dy > 0 ? 'down' : 'up';
      anchor = scrollY;
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
