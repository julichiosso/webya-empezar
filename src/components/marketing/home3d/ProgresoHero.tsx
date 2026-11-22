'use client';

import { useEffect } from 'react';
import { calcularProgreso, progresoHero } from './progreso';

/**
 * Escribe el progreso de los tres estados en `--p` del hero (y para la escena 3D) mientras se scrollea
 * por su recorrido fijo. Un listener pasivo y un requestAnimationFrame: no bloquea nada. Con movimiento
 * reducido no mueve `--p` (el CSS muestra todo quieto). También avisa (`data-hero-paso` en <html>) cuando
 * el hero quedó atrás, para que la barra de atajos del celular no tape la franja de clientes.
 */
export function ProgresoHero({ id }: { id: string }) {
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // La barra de atajos del celular aparece cuando el hero ya quedó atrás.
      html.toggleAttribute('data-hero-paso', r.bottom < window.innerHeight * 0.55);
      if (quieto) return;
      const p = calcularProgreso(r.top, r.height, window.innerHeight);
      progresoHero.valor = p;
      el.style.setProperty('--p', p.toFixed(3));
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', pedir);
      window.removeEventListener('resize', pedir);
      html.removeAttribute('data-hero-paso');
    };
  }, [id]);
  return null;
}
