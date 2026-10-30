import type { HTMLAttributes, ReactNode } from 'react';
import { cn, TOQUE } from './clases';
import { Spinner } from './Spinner';

type Nivel = 'tarjeta' | 'panel';
type Estado = 'cargando' | 'error' | 'exito';

interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** `tarjeta` (radio 16, p-4) dentro de una sección; `panel` (radio 24, p-6) agrupa tarjetas. */
  nivel?: Nivel;
  /** Etiqueta del contenedor cuando no es un enlace. */
  como?: 'div' | 'section' | 'article' | 'li';
  /** Si tiene destino, toda la tarjeta es un enlace (hover, foco y toque propios). */
  href?: string;
  /** Enlace no disponible: se ve atenuado, no navega y sale del orden de Tab. */
  deshabilitada?: boolean;
  /**
   * cargando: aria-busy y spinner (el contenido reserva su lugar); error y exito: borde de estado.
   * El texto que explica el error o el éxito va adentro, nunca solo el color.
   */
  estado?: Estado;
  /** Texto del spinner en carga (desde content), si la tarjeta no tiene otro anuncio. */
  etiquetaCargando?: string;
  children: ReactNode;
}

const NIVELES: Record<Nivel, string> = {
  tarjeta: 'rounded-card bg-tarjeta-fondo p-4',
  panel: 'rounded-panel bg-panel-fondo p-6',
};

/** Un solo color de borde por vez: dos utilidades de borde chocarían en el CSS generado. */
const BORDE_NIVEL: Record<Nivel, string> = {
  tarjeta: 'border-tarjeta-borde',
  panel: 'border-panel-borde',
};

const BORDE_ESTADO: Partial<Record<Estado, string>> = {
  error: 'border-control-error',
  exito: 'border-seleccion-borde',
};

/**
 * Superficie de WebYa: borde de 1 px por token + `shadow-raised`. Dos jerarquías (tarjeta < panel)
 * para no usar un mismo radio en todo. Sin hover animado salvo que sea un enlace.
 */
export function Card({
  nivel = 'tarjeta',
  como: Etiqueta = 'div',
  href,
  deshabilitada,
  estado,
  etiquetaCargando,
  className,
  children,
  ...rest
}: CardProps) {
  const interactiva = href !== undefined && !deshabilitada;
  const clases = cn(
    'relative block border shadow-raised',
    NIVELES[nivel],
    (estado && BORDE_ESTADO[estado]) || BORDE_NIVEL[nivel],
    interactiva && cn('hover:border-line-strong', TOQUE),
    deshabilitada && 'opacity-45',
    className,
  );
  const contenido = (
    <>
      <div className={cn(estado === 'cargando' && 'opacity-0')}>{children}</div>
      {estado === 'cargando' && (
        <span className="absolute inset-0 flex items-center justify-center text-muted">
          <Spinner etiqueta={etiquetaCargando} />
        </span>
      )}
    </>
  );
  const comunes = {
    'aria-busy': estado === 'cargando' || undefined,
    'data-estado': estado,
    className: clases,
    ...rest,
  };

  if (href !== undefined) {
    return (
      <a
        href={deshabilitada ? undefined : href}
        // Sin href pierde el rol: se lo devolvemos para que se anuncie como enlace deshabilitado.
        role={deshabilitada ? 'link' : undefined}
        aria-disabled={deshabilitada || undefined}
        {...comunes}
      >
        {contenido}
      </a>
    );
  }
  return <Etiqueta {...comunes}>{contenido}</Etiqueta>;
}
