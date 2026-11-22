'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HOME3D } from '@/brand/tokens/colores';
import { cn } from '@/components/ui/clases';
import { aVec3 } from '@/lib/color';
import { alcanza, medirCapacidad } from './capacidad';

/** San Francisco (Córdoba) y San Jorge (Santa Fe): [latitud, longitud]. */
const CIUDADES: [number, number][] = [
  [-31.428, -62.083],
  [-31.896, -61.86],
];
/** Mirando a la zona: cobe gira con `phi` (longitud) e inclina con `theta` (latitud). */
const PHI_ZONA = Math.PI - ((-62 * Math.PI) / 180 - Math.PI / 2);
const THETA_ZONA = -0.42;

/**
 * Globo de puntos que gira y se detiene en la zona, con las dos ciudades marcadas. Lleva a /zona. Es un
 * WebGL diminuto (cobe, 13 KB) que se pide recién cuando el globo entra en pantalla y solo si el
 * dispositivo puede; si no, queda el dibujo estático (que ya está en el HTML).
 */
export function Globo({ href, aria, className }: { href: string; aria: string; className?: string }) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const [vivo, setVivo] = useState(false);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const modo = new URLSearchParams(window.location.search).get('simbolo');
    if (modo === 'poster' || (modo !== '3d' && !alcanza(medirCapacidad()))) return;
    let destruir: (() => void) | null = null;
    let cancelado = false;
    const io = new IntersectionObserver((entradas) => {
      if (!entradas[0]?.isIntersecting || destruir || cancelado) return;
      import('cobe').then(({ default: crearGlobo }) => {
        if (cancelado) return;
        const lado = canvas.clientWidth;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const t0 = performance.now();
        let phi = PHI_ZONA - 2.6;
        let raf = 0;
        const globo = crearGlobo(canvas, {
          width: lado * dpr,
          height: lado * dpr,
          devicePixelRatio: dpr,
          phi,
          theta: THETA_ZONA,
          dark: 0,
          diffuse: 0.5,
          mapSamples: 12000,
          mapBrightness: 7,
          mapBaseBrightness: 0,
          baseColor: aVec3(HOME3D.hueso),
          markerColor: aVec3(HOME3D.brote),
          glowColor: aVec3(HOME3D.hueso),
          markers: CIUDADES.map((location) => ({ location, size: 0.045 })),
          opacity: 0.95,
        });
        // Gira rápido al entrar y frena en la zona; después, un vaivén mínimo.
        const paso = (t: number) => {
          const s = Math.min(1, (t - t0) / 2600);
          const frenado = 1 - Math.pow(1 - s, 3);
          phi = PHI_ZONA - 2.6 * (1 - frenado) + Math.sin((t - t0) / 2400) * 0.06 * frenado;
          globo.update({ phi });
          raf = requestAnimationFrame(paso);
        };
        raf = requestAnimationFrame(paso);
        setVivo(true);
        destruir = () => {
          cancelAnimationFrame(raf);
          globo.destroy();
        };
      });
    });
    io.observe(canvas);
    return () => {
      cancelado = true;
      io.disconnect();
      destruir?.();
    };
  }, []);

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={aria}
      className={cn('h3d-globo', vivo && 'h3d-globo-vivo', className)}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="h3d-globo-dibujo">
        <circle cx="50" cy="50" r="47" />
        <ellipse cx="50" cy="50" rx="20" ry="47" />
        <ellipse cx="50" cy="50" rx="38" ry="47" />
        <path d="M3 50h94M8 30h84M8 70h84" />
        <circle cx="47" cy="66" r="2.6" className="h3d-globo-punto" />
        <circle cx="49.5" cy="68.5" r="2.6" className="h3d-globo-punto" />
      </svg>
      <canvas ref={lienzo} className="h3d-globo-canvas" aria-hidden="true" />
    </Link>
  );
}
