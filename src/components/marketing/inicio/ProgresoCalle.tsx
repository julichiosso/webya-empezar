'use client';

import { useEffect } from 'react';

/** Cuánto del recorrido fijo del hero se scrolleó: 0 arriba, 1 cuando el escenario está por soltarse. */
export function calcularProgreso(top: number, altoSeccion: number, altoVentana: number): number {
  const recorrido = altoSeccion - altoVentana;
  if (recorrido <= 0) return top < 0 ? Math.min(1, -top / (altoVentana * 0.6)) : 0;
  return Math.min(1, Math.max(0, -top / recorrido));
}

/** Momento del lema según el progreso: 0 Creá, 1 Digitalizá, 2 Crecé. */
export const pasoDe = (p: number) => (p < 0.3 ? 0 : p < 0.6 ? 1 : 2);
/** Desde acá la calle ya es de noche (el texto y el header pasan a blanco). */
export const NOCHE = 0.26;

/**
 * Mueve la calle: escribe `--p` (0 → 1) en el hero mientras se scrollea su tramo fijo, `data-paso` (qué
 * palabra del lema está encendida) y `data-oscuro` cuando ya es de noche (avisa al header con
 * `webya:tono`). Un listener pasivo y un requestAnimationFrame.
 *
 * Con movimiento reducido no hay tramo: la calle queda quieta, ya de noche, y solo marca `data-oscuro`.
 * También avisa en <html> (`data-hero-paso`) cuando el hero quedó atrás, para la barra del celular.
 */
export function ProgresoCalle({ id }: { id: string }) {
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    let raf = 0;
    let oscuro: boolean | null = null;
    const marcarOscuro = (o: boolean) => {
      if (o === oscuro) return;
      oscuro = o;
      el.toggleAttribute('data-oscuro', o);
      window.dispatchEvent(new Event('webya:tono'));
    };
    const medir = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      html.toggleAttribute('data-hero-paso', r.bottom < window.innerHeight * 0.55);
      if (quieto) {
        marcarOscuro(true);
        return;
      }
      const p = calcularProgreso(r.top, r.height, window.innerHeight);
      el.style.setProperty('--p', p.toFixed(4));
      const paso = String(pasoDe(p));
      if (el.dataset.paso !== paso) el.dataset.paso = paso;
      marcarOscuro(p >= NOCHE);
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
