import { GRILLA_ICONO, TRAZO } from '../grilla';
import { ICONS, type IconName } from './paths';

interface IconProps {
  name: IconName;
  /** Lado en px (el set está dibujado en 24×24). */
  size?: number;
  className?: string;
  /** Si el trazo se "dibuja" (stroke-dashoffset) al activarse o con hover del contenedor `.group`. */
  draw?: boolean;
  /** Dispara el dibujado (p. ej. cuando la tarjeta queda seleccionada). */
  active?: boolean;
  /**
   * Si comunica algo por sí solo (el texto viene de `src/content`); si no, es decorativo y se oculta
   * a lectores de pantalla.
   */
  title?: string;
}

export function Icon({
  name,
  size = GRILLA_ICONO.lado,
  className,
  draw = false,
  active = false,
  title,
}: IconProps) {
  return (
    <svg
      viewBox={GRILLA_ICONO.viewBox}
      width={size}
      height={size}
      {...TRAZO}
      strokeWidth={GRILLA_ICONO.trazo}
      className={`${draw ? 'ic-draw' : ''} ${className ?? ''}`.trim()}
      data-active={active ? 'true' : undefined}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {ICONS[name].map((d) => (
        <path key={d} d={d} pathLength={1} className="ic-path" />
      ))}
    </svg>
  );
}
