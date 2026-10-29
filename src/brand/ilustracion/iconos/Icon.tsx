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
  /** Si comunica algo por sí solo; si no, es decorativo y se oculta a lectores de pantalla. */
  title?: string;
}

export function Icon({
  name,
  size = 24,
  className,
  draw = false,
  active = false,
  title,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${draw ? 'ic-draw' : ''} ${className ?? ''}`.trim()}
      data-active={active ? 'true' : undefined}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {ICONS[name].map((d) => (
        <path key={d} d={d} pathLength={1} className="ic-path" />
      ))}
    </svg>
  );
}
