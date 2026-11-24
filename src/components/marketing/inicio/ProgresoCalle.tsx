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

const tramo = (x: number) => Math.min(1, Math.max(0, x));
/**
 * Cuánto de noche es (0 a 1): anochece entre 0,10 y 0,30 y amanece entre 0,66 y 0,86. Es la misma cuenta
 * que hace el CSS con `--p` (home.css, `--noche`).
 */
export const nocheDe = (p: number) => Math.min(tramo((p - 0.1) / 0.2), tramo((0.86 - p) / 0.2));

/** Cuánto tarda el escenario en alcanzar al scroll (ms): un scroll rápido igual muestra el cambio. */
const INERCIA_MS = 140;

/**
 * Mueve la calle. Escribe en el hero `--p` (0 → 1), que sigue al scroll con inercia: aunque alguien baje
 * rápido, cada cambio se ve completo y suave. También `data-paso` (qué palabra del lema está encendida) y
 * `data-oscuro` cuando es de noche (avisa al header con `webya:tono`). Si alguien tocó la luna o el sol
 * (`data-cielo` en el hero), manda eso hasta el próximo momento del lema.
 *
 * En la compu, el puntero mueve apenas las capas (`--mx`, `--my`): la calle tiene profundidad.
 * Con movimiento reducido no hay tramo ni inercia: la calle queda quieta, de noche.
 * También avisa en <html> (`data-hero-paso`) cuando el hero quedó atrás, para la barra del celular.
 */
export function ProgresoCalle({ id }: { id: string }) {
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const punteroFino = matchMedia('(pointer: fine)').matches;
    const html = document.documentElement;
    let raf = 0;
    let p = -1;
    let objetivo = 0;
    let antes = 0;
    let oscuro: boolean | null = null;
    let pasoAnterior = '';

    const marcarOscuro = (o: boolean) => {
      if (o === oscuro) return;
      oscuro = o;
      el.toggleAttribute('data-oscuro', o);
      window.dispatchEvent(new Event('webya:tono'));
    };
    const cielo = () => el.dataset.cielo;

    const cuadro = (t: number) => {
      raf = 0;
      const dt = antes ? Math.min(64, t - antes) : 16;
      antes = t;
      if (p < 0) p = objetivo;
      else p += (objetivo - p) * (1 - Math.exp(-dt / INERCIA_MS));
      if (Math.abs(objetivo - p) < 0.0005) p = objetivo;
      el.style.setProperty('--p', p.toFixed(4));
      const paso = String(pasoDe(p));
      if (paso !== pasoAnterior) {
        // Cambió el momento: la luna o el sol que se tocó deja de mandar.
        if (pasoAnterior && el.dataset.cielo) {
          delete el.dataset.cielo;
          window.dispatchEvent(new Event('webya:cielo-suelto'));
        }
        pasoAnterior = paso;
        el.dataset.paso = paso;
      }
      const c = cielo();
      marcarOscuro(c ? c === 'noche' : nocheDe(p) >= 0.5);
      if (p !== objetivo) raf = requestAnimationFrame(cuadro);
      else antes = 0;
    };

    const medir = () => {
      const r = el.getBoundingClientRect();
      html.toggleAttribute('data-hero-paso', r.bottom < window.innerHeight * 0.55);
      if (quieto) {
        const c = cielo();
        marcarOscuro(c ? c === 'noche' : true);
        return;
      }
      objetivo = calcularProgreso(r.top, r.height, window.innerHeight);
      // Los píxeles fraccionarios del scroll no dejan llegar justo a los extremos: se pegan.
      if (objetivo > 0.997) objetivo = 1;
      else if (objetivo < 0.003) objetivo = 0;
      if (!raf) raf = requestAnimationFrame(cuadro);
    };

    let rafPuntero = 0;
    let mx = 0;
    let my = 0;
    const alMover = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      if (!rafPuntero)
        rafPuntero = requestAnimationFrame(() => {
          rafPuntero = 0;
          el.style.setProperty('--mx', mx.toFixed(3));
          el.style.setProperty('--my', my.toFixed(3));
        });
    };

    medir();
    window.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir, { passive: true });
    window.addEventListener('webya:cielo', medir);
    if (punteroFino && !quieto) el.addEventListener('pointermove', alMover, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafPuntero);
      window.removeEventListener('scroll', medir);
      window.removeEventListener('resize', medir);
      window.removeEventListener('webya:cielo', medir);
      el.removeEventListener('pointermove', alMover);
      html.removeAttribute('data-hero-paso');
    };
  }, [id]);
  return null;
}
