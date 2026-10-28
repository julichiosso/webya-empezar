'use client';

import { useEffect, useRef } from 'react';
import { MODULO_ICONS } from '../icons/paths';

type Pieza = { x: number; y: number; icono: keyof typeof MODULO_ICONS };

// Cuatro módulos que "encajan" en la web. Cada rubro arma los suyos; acá se muestran los más comunes.
const TILES: readonly Pieza[] = [
  { x: 36, y: 160, icono: 'turnos' },
  { x: 164, y: 160, icono: 'catalogo' },
  { x: 36, y: 232, icono: 'carta_qr' },
  { x: 164, y: 232, icono: 'pagos' },
];

const TRAZO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/**
 * Ilustración del hero: una web que se arma por bloques (los módulos encajan como piezas).
 * SVG inline propio. Solo anima transform/opacity con CSS (clase .hero-piece en globals.css).
 * Se pausa fuera de pantalla y con la pestaña oculta; con prefers-reduced-motion queda estática
 * y completa. El aspect-ratio reserva el espacio: sin layout shift.
 */
export function HeroArt() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = true;
    const aplicar = () => {
      el.dataset.playing = String(visible && document.visibilityState === 'visible');
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      aplicar();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', aplicar);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', aplicar);
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 320 320"
      aria-hidden="true"
      focusable="false"
      data-playing="true"
      className="hero-art mx-auto aspect-square w-full max-w-sm"
    >
      <rect
        x="16"
        y="8"
        width="288"
        height="304"
        rx="28"
        className="fill-surface stroke-line-strong"
      />

      {/* 0 · Barra superior */}
      <g className="hero-piece" style={{ '--i': 0 } as React.CSSProperties}>
        <rect x="36" y="28" width="248" height="28" rx="10" className="fill-surface-2" />
        <rect x="48" y="38" width="56" height="8" rx="4" className="fill-fg" />
        <circle cx="252" cy="42" r="3" className="fill-subtle" />
        <circle cx="262" cy="42" r="3" className="fill-subtle" />
        <circle cx="272" cy="42" r="3" className="fill-subtle" />
      </g>

      {/* 1 · Portada del negocio */}
      <g className="hero-piece" style={{ '--i': 1 } as React.CSSProperties}>
        <rect x="36" y="66" width="248" height="84" rx="14" className="fill-surface-2" />
        <rect x="52" y="82" width="128" height="10" rx="5" className="fill-fg" />
        <rect x="52" y="100" width="92" height="8" rx="4" className="fill-subtle" />
        <rect x="52" y="120" width="64" height="18" rx="9" className="fill-accent" />
      </g>

      {/* 2-5 · Módulos */}
      {TILES.map((t, i) => (
        <g key={t.icono} className="hero-piece" style={{ '--i': i + 2 } as React.CSSProperties}>
          <rect
            x={t.x}
            y={t.y}
            width="120"
            height="64"
            rx="14"
            className="fill-surface stroke-line-strong"
          />
          <g
            transform={`translate(${t.x + 14} ${t.y + 14}) scale(1.5)`}
            className="text-fg"
            {...TRAZO}
          >
            {MODULO_ICONS[t.icono].map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <rect x={t.x + 62} y={t.y + 22} width="44" height="7" rx="3.5" className="fill-fg" />
          <rect x={t.x + 62} y={t.y + 36} width="30" height="6" rx="3" className="fill-subtle" />
        </g>
      ))}

      {/* 6 · Aviso que entra */}
      <g className="hero-piece" style={{ '--i': 6 } as React.CSSProperties}>
        <rect x="198" y="118" width="114" height="36" rx="18" className="fill-accent" />
        <g transform="translate(212 124)" className="text-accent-fg" {...TRAZO}>
          {MODULO_ICONS.notificaciones.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <rect x="244" y="132" width="56" height="7" rx="3.5" className="fill-accent-fg" />
      </g>
    </svg>
  );
}
