'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/components/ui/clases';
import { alcanza, medirCapacidad } from './capacidad';
import type { Escena } from './escena';
import { progresoHero } from './progreso';

/** Los tres estados renderizados con la misma escena (scripts/render-poster.mjs), 1600 × 1000. */
const POSTERS = ['/home3d/simbolo-0.webp', '/home3d/simbolo-1.webp', '/home3d/simbolo-2.webp'];
const ANCHO = 1600;
const ALTO = 1000;
const TAMANOS = '(min-width: 1024px) 68vw, 100vw';
/** Lienzo fijo para renderizar los posters (a DPR 2 da 1600 × 1000). */
const CAPTURA = { position: 'fixed', left: '0', top: '0', width: '800px', height: '500px', zIndex: '9999' };

declare global {
  interface Window {
    __simbolo?: 'listo' | 'poster';
  }
}

/**
 * El símbolo `<w>` del hero. Primero el poster (es el LCP: imagen con prioridad y medidas fijas); después,
 * solo si el dispositivo puede (ver capacidad.ts), la escena WebGL se importa diferida en un momento libre
 * y reemplaza al poster cuando dibuja su primer cuadro. Si el rendimiento no alcanza, vuelve el poster.
 *
 * Sin WebGL, los posters de los tres estados se funden con el scroll (CSS, con `--p`). Decorativo: el
 * mensaje vive en el texto del hero.
 *
 * `?simbolo=3d` fuerza la escena (capturas en headless), `?simbolo=poster` la apaga y `?captura=0|1|2` la dibuja quieta y transparente
 * para renderizar los posters.
 */
export function ObjetoHero({ className }: { className?: string }) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const [en3d, setEn3d] = useState(false);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const q = new URLSearchParams(window.location.search);
    const captura = q.get('captura');
    const forzar = q.get('simbolo') === '3d' || captura !== null;
    if (q.get('simbolo') === 'poster' || (!forzar && !alcanza(medirCapacidad()))) {
      window.__simbolo = 'poster';
      return;
    }
    if (captura !== null) {
      // 800 × 500 a DPR 2: el poster sale de 1600 × 1000, con el mismo encuadre que el canvas del hero.
      Object.assign(canvas.style, CAPTURA);
    }
    let escena: Escena | null = null;
    let cancelado = false;
    const arrancar = () => {
      import('./escena')
        .then(({ montarEscena }) => {
          if (cancelado) return;
          escena = montarEscena(canvas, {
            progreso: captura !== null ? () => Number(captura) / 2 : () => progresoHero.valor,
            captura: captura !== null,
            alPintar: () => {
              setEn3d(true);
              window.__simbolo = 'listo';
            },
            alRendirse: () => {
              setEn3d(false);
              window.__simbolo = 'poster';
              escena?.destruir();
              escena = null;
            },
          });
        })
        .catch(() => {
          window.__simbolo = 'poster';
        });
    };
    const ocio = 'requestIdleCallback' in window;
    const id = ocio
      ? window.requestIdleCallback(arrancar, { timeout: 2500 })
      : window.setTimeout(arrancar, 1200);
    return () => {
      cancelado = true;
      if (ocio) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      escena?.destruir();
    };
  }, []);

  return (
    <div className={cn('h3d-objeto', en3d && 'h3d-en3d', className)} aria-hidden="true">
      {POSTERS.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={ANCHO}
          height={ALTO}
          sizes={TAMANOS}
          preload={i === 0}
          loading={i === 0 ? undefined : 'lazy'}
          className={`h3d-poster h3d-poster-${i}`}
          draggable={false}
        />
      ))}
      <canvas ref={lienzo} className="h3d-canvas" />
    </div>
  );
}
