import { Icon } from '@/brand/ilustracion/iconos/Icon';

interface EncajeProps {
  /** Pieza puesta: Brasa con check. Sin poner: queda el hueco punteado esperándola. */
  on: boolean;
  size?: 'sm' | 'md';
  /** Posición desde afuera (p. ej. `absolute top-3 right-3`). */
  className?: string;
}

/**
 * El "clic" del encastre (ver skill webya-brand): un hueco punteado que, al activarse, recibe la
 * pieza. Hueco y pieza comparten la misma celda, así que nada cambia de tamaño al elegir.
 * Es decorativo: el estado real lo comunica el control (checkbox, radio o aria-pressed).
 */
export function Encaje({ on, size = 'md', className }: EncajeProps) {
  const caja = size === 'sm' ? 'size-5' : 'size-6';
  return (
    <span
      aria-hidden="true"
      data-on={on}
      className={`encaje grid ${caja} shrink-0 ${className ?? ''}`.trim()}
    >
      <span className="col-start-1 row-start-1 rounded-full border border-dashed border-line-strong" />
      <span className="encaje-pieza col-start-1 row-start-1 flex items-center justify-center rounded-full bg-accent text-accent-fg">
        <Icon name="check" size={size === 'sm' ? 14 : 16} />
      </span>
    </span>
  );
}
