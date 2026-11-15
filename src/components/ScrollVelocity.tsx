'use client';

import { useEffect } from 'react';

// Publica la velocidad del scroll en <html> como --vel (-1 subiendo rápido … 1 bajando rápido).
// El desenfoque al pasar (globals.css) la usa para marcarse más al bajar y menos al subir.
export default function ScrollVelocity() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const style = document.documentElement.style;
    let last = scrollY, lastT = 0, v = 0, raf = 0;

    const tick = (t: number) => {
      const dy = scrollY - last, dt = Math.max(t - lastT, 1);
      last = scrollY; lastT = t;
      const target = Math.max(-1, Math.min(1, dy / dt / 3)); // 3 px/ms ≈ scroll rápido
      v += (target - v) * 0.15; // suavizado: sube y vuelve a 0 sin saltos
      if (Math.abs(v) < 0.005 && dy === 0) { v = 0; raf = 0; }
      else raf = requestAnimationFrame(tick);
      style.setProperty('--vel', v.toFixed(3));
    };
    const onScroll = () => {
      if (raf) return;
      lastT = performance.now() - 16;
      raf = requestAnimationFrame(tick);
    };

    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return null;
}
