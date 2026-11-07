'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';

const CADA_MS = 3800;

/**
 * Sobrevive al cambio del HTML del servidor por el wizard ya cargado (se vuelve a montar la vitrina):
 * así no salta al primero justo cuando la persona empieza a scrollear.
 */
let ultimoRubro: string | null = null;

// Solo en el navegador: useLayoutEffect avisa si corre en el servidor.
const useEfectoAntesDePintar = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function mostrar(raiz: HTMLElement, rubro: string) {
  ultimoRubro = rubro;
  for (const el of raiz.querySelectorAll<HTMLElement>('[data-slide]')) {
    el.dataset.activa = String(el.dataset.slide === rubro);
  }
  // La tarjeta del rubro que se está viendo queda marcada: une la lista con el celular.
  for (const b of document.querySelectorAll<HTMLElement>('#wizard [data-rubro]')) {
    if (b.dataset.rubro === rubro) b.dataset.enVitrina = '';
    else delete b.dataset.enVitrina;
  }
}

/**
 * Cambia qué rubro se ve: pasa solo mientras está en pantalla y, al pasar el mouse o el foco por una
 * tarjeta, muestra esa. Toca atributos sin volver a dibujar nada. Con movimiento reducido no pasa
 * solo: cambia únicamente cuando la persona se lo pide.
 */
export function ControlVitrina({
  rubros,
  children,
}: {
  rubros: readonly string[];
  children: ReactNode;
}) {
  const raiz = useRef<HTMLDivElement>(null);

  useEfectoAntesDePintar(() => {
    if (raiz.current) mostrar(raiz.current, ultimoRubro ?? rubros[0]!);
  }, [rubros]);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    let visible = true;
    let fijado = false;

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const siguiente = () => {
      if (!visible || fijado || document.visibilityState === 'hidden') return;
      const i = rubros.indexOf(ultimoRubro ?? rubros[0]!);
      mostrar(el, rubros[(i + 1) % rubros.length]!);
    };
    const reloj = reducido ? undefined : setInterval(siguiente, CADA_MS);

    const observador = new IntersectionObserver(([e]) => {
      visible = Boolean(e?.isIntersecting);
    });
    observador.observe(el);

    const alEntrar = (e: Event) => {
      const rubro = (e.target as Element).closest<HTMLElement>('[data-rubro]')?.dataset.rubro;
      if (!rubro || !rubros.includes(rubro)) return;
      fijado = true;
      mostrar(el, rubro);
    };
    const alSalir = (e: Event) => {
      if ((e.target as Element).closest('[data-rubro]')) fijado = false;
    };
    document.addEventListener('pointerover', alEntrar);
    document.addEventListener('focusin', alEntrar);
    document.addEventListener('pointerout', alSalir);
    document.addEventListener('focusout', alSalir);
    return () => {
      if (reloj) clearInterval(reloj);
      observador.disconnect();
      document.removeEventListener('pointerover', alEntrar);
      document.removeEventListener('focusin', alEntrar);
      document.removeEventListener('pointerout', alSalir);
      document.removeEventListener('focusout', alSalir);
    };
  }, [rubros]);

  return <div ref={raiz}>{children}</div>;
}
