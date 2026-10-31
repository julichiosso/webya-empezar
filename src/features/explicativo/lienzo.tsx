import type { CSSProperties, ReactNode } from 'react';
import { ICONS, type IconName } from '@/brand/ilustracion/iconos/paths';

/**
 * Primitivas de los lienzos SVG del video explicativo (escenas de la demo, escenas del flujo y el
 * poster de /empezar). Sin hooks ni estado: sirven igual en el servidor (poster) que en el cliente.
 *
 * Regla de armado: la POSICIÓN va en un <g transform> exterior y la ANIMACIÓN en un <g> interior
 * con clase `.mg-*` (si no, el transform de la animación CSS pisa el de la posición). Solo se
 * anima transform/opacity, una vez por escena; con reduced-motion todo aparece quieto (globals.css).
 */
export type Animacion = 'entra' | 'encaja' | 'pop' | 'desliza' | 'sale' | 'recorre' | 'pulso';

/** Pieza animada: `en` = posición, `anim` = cómo entra, `d` = demora en ms. */
export function P({
  en = [0, 0],
  anim = 'entra',
  d = 0,
  children,
}: {
  en?: [number, number];
  anim?: Animacion;
  d?: number;
  children: ReactNode;
}) {
  return (
    <g transform={`translate(${en[0]} ${en[1]})`}>
      <g className={`mg mg-${anim}`} style={{ '--d': `${d}ms` } as CSSProperties}>
        {children}
      </g>
    </g>
  );
}

export function Telefono({
  x,
  y,
  ancho = 260,
  alto = 540,
  papel = false,
  children,
}: {
  x: number;
  y: number;
  ancho?: number;
  alto?: number;
  papel?: boolean;
  children?: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={ancho}
        height={alto}
        rx="40"
        className="fill-surface-2 stroke-line-strong"
        strokeWidth="2"
      />
      <rect
        x="12"
        y="12"
        width={ancho - 24}
        height={alto - 24}
        rx="30"
        className={papel ? 'fill-paper' : 'fill-bg'}
      />
      <rect x={ancho / 2 - 30} y="22" width="60" height="8" rx="4" className="fill-line-strong" />
      {children}
    </g>
  );
}

export function IconoSvg({
  nombre,
  x,
  y,
  escala = 2,
  clase = 'stroke-fg',
}: {
  nombre: IconName;
  x: number;
  y: number;
  escala?: number;
  clase?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${escala})`}
      fill="none"
      className={clase}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[nombre].map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

export function Texto({
  x,
  y,
  children,
  tam = 24,
  clase = 'fill-fg',
  peso = 600,
  ancla = 'start',
}: {
  x: number;
  y: number;
  children: ReactNode;
  tam?: number;
  clase?: string;
  peso?: number;
  ancla?: 'start' | 'middle' | 'end';
}) {
  return (
    <text x={x} y={y} fontSize={tam} fontWeight={peso} textAnchor={ancla} className={clase}>
      {children}
    </text>
  );
}

export function Burbuja({
  x,
  y,
  ancho,
  texto,
  mia = false,
}: {
  x: number;
  y: number;
  ancho: number;
  texto: string;
  mia?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={ancho} height="44" rx="22" className={mia ? 'fill-accent' : 'fill-surface-2'} />
      <Texto x={18} y={29} tam={18} peso={500} clase={mia ? 'fill-accent-fg' : 'fill-fg'}>
        {texto}
      </Texto>
    </g>
  );
}
