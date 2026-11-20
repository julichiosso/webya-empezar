'use client';

import { useEffect } from 'react';

const CAMPO =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]), textarea, select';

/**
 * Marca <html data-teclado> mientras hay un campo de texto con foco (la barra de atajos se corre) y
 * publica el alto del teclado en --teclado (la barra del configurador sube con él). No dibuja nada.
 */
export function TecladoAbierto() {
  useEffect(() => {
    const raiz = document.documentElement;
    const entra = (e: FocusEvent) => {
      if (e.target instanceof Element && e.target.matches(CAMPO)) raiz.dataset.teclado = '';
    };
    const sale = () => {
      // El foco puede pasar de un campo a otro: se mira recién cuando se acomodó.
      requestAnimationFrame(() => {
        const el = document.activeElement;
        if (!(el instanceof Element && el.matches(CAMPO))) delete raiz.dataset.teclado;
      });
    };
    // Alto del teclado (iOS y Android lo dibujan encima): lo que falta del viewport visible. Las barras
    // fijas que tienen que subir con el teclado usan `bottom: var(--teclado)`.
    const vv = window.visualViewport;
    const medir = () => {
      if (!vv) return;
      const alto = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      raiz.style.setProperty('--teclado', `${Math.round(alto)}px`);
    };
    vv?.addEventListener('resize', medir);
    vv?.addEventListener('scroll', medir);
    document.addEventListener('focusin', entra);
    document.addEventListener('focusout', sale);
    return () => {
      vv?.removeEventListener('resize', medir);
      vv?.removeEventListener('scroll', medir);
      document.removeEventListener('focusin', entra);
      document.removeEventListener('focusout', sale);
      delete raiz.dataset.teclado;
      raiz.style.removeProperty('--teclado');
    };
  }, []);
  return null;
}
