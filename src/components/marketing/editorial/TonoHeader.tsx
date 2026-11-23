'use client';

import { useEffect } from 'react';

/** Lo que cuenta como fondo oscuro: las secciones en tono oscuro y lo que se marca a mano (el hero de noche). */
const OSCUROS = '.tono-oscuro, [data-oscuro]';

/**
 * El header es transparente: cuando lo que pasa por debajo del logo es oscuro, le pone `data-sobre="oscuro"`
 * y el CSS lo pasa a blanco (logo y píldoras). Mira el punto exacto debajo del logo, en cada cuadro en que
 * hubo scroll o cambió el tamaño (un listener pasivo y un requestAnimationFrame). También escucha
 * `webya:tono` para cuando una sección cambia de tono sin scroll (el hero al hacerse de noche).
 */
export function TonoHeader() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('header.a-nav');
    const logo = header?.querySelector<HTMLElement>('[data-logo]');
    if (!header || !logo) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const l = logo.getBoundingClientRect();
      const x = l.left + l.width / 2;
      const y = l.top + l.height / 2;
      let oscuro = false;
      for (const el of document.querySelectorAll<HTMLElement>(OSCUROS)) {
        if (header.contains(el) || el.offsetParent === null) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y && r.left <= x && r.right >= x) {
          oscuro = true;
          break;
        }
      }
      if (oscuro) header.dataset.sobre = 'oscuro';
      else delete header.dataset.sobre;
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir, { passive: true });
    window.addEventListener('webya:tono', pedir);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', pedir);
      window.removeEventListener('resize', pedir);
      window.removeEventListener('webya:tono', pedir);
    };
  }, []);
  return null;
}
