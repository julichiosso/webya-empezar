'use client';

import { useEffect } from 'react';

/**
 * El mazo de "Qué hacemos" (como las tarjetas de Mercado Pago): mientras la tarjeta de adelante sube a
 * taparla, la de atrás se achica apenas desde su borde de arriba, que queda asomando. Escribe `--d` en
 * cada tarjeta (cuántas tarjetas tiene encima, de 0 a N, con fracciones). Un listener pasivo y un
 * requestAnimationFrame; con movimiento reducido no hace nada (quedan apiladas sin escala).
 */
export function PilaTarjetas({ id }: { id: string }) {
  useEffect(() => {
    const raiz = document.getElementById(id);
    if (!raiz || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = [...raiz.querySelectorAll<HTMLElement>('.sv-item')];
    const tarjetas = items.map((li) => li.querySelector<HTMLElement>('.sv-tarjeta'));
    let raf = 0;
    const medir = () => {
      raf = 0;
      const alto = window.innerHeight * 0.75;
      // Cuánto subió cada tarjeta hacia su lugar fijo (0 lejos, 1 ya apilada).
      const avance = items.map((li) => {
        const tope = parseFloat(getComputedStyle(li).top) || 0;
        const r = li.getBoundingClientRect();
        return Math.min(1, Math.max(0, 1 - (r.top - tope) / alto));
      });
      tarjetas.forEach((t, i) => {
        if (!t) return;
        let encima = 0;
        for (let j = i + 1; j < avance.length; j++) encima += avance[j]!;
        t.style.setProperty('--d', encima.toFixed(3));
      });
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
    };
  }, [id]);
  return null;
}
