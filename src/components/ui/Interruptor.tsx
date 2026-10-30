import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { ContratoInterruptor } from './contratos';
import { cn, TOQUE } from './clases';
import { Encaje } from './Encaje';
import { Spinner } from './Spinner';

type InterruptorProps = ContratoInterruptor &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type' | 'aria-pressed'> & {
    onCambio: (presionado: boolean) => void;
    icono?: ReactNode;
    /** Muestra el hueco y la pieza de `Encaje` (filtros, módulos del hero). */
    conEncaje?: boolean;
    /** Esperando confirmación: aria-busy y no acepta otro toque (sin perder el foco). */
    cargando?: boolean;
    /** id del mensaje visible que explica un error al cambiar. */
    idError?: string;
    ref?: Ref<HTMLButtonElement>;
  };

/**
 * Botón de dos estados (aria-pressed): vistas de la demo, voz del video, filtros. La etiqueta NO cambia
 * con el estado (lo comunica aria-pressed); lo presionado se distingue por borde, fondo y la pieza
 * encajada, no solo por color.
 */
export function Interruptor({
  presionado,
  etiqueta,
  onCambio,
  icono,
  conEncaje,
  cargando,
  idError,
  disabled,
  className,
  onClick,
  'aria-describedby': describedBy,
  ...rest
}: InterruptorProps) {
  return (
    <button
      type="button"
      aria-pressed={presionado}
      aria-busy={cargando || undefined}
      aria-disabled={cargando || undefined}
      aria-describedby={cn(describedBy, idError) || undefined}
      data-on={presionado}
      data-estado={cargando ? 'cargando' : idError ? 'error' : undefined}
      disabled={disabled}
      onClick={(e) => {
        if (cargando) return;
        onClick?.(e);
        if (!e.defaultPrevented) onCambio(!presionado);
      }}
      className={cn(
        'pop-on inline-flex min-h-tap items-center justify-center gap-2 rounded-full border px-4 text-small font-medium',
        idError
          ? 'border-control-error bg-tarjeta-fondo text-fg'
          : presionado
            ? 'border-seleccion-borde bg-seleccion-fondo text-fg'
            : 'border-tarjeta-borde bg-tarjeta-fondo text-muted hover:border-line-strong hover:text-fg',
        TOQUE,
        'disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none',
        className,
      )}
      {...rest}
    >
      {conEncaje &&
        (cargando ? (
          <span className="flex size-5 items-center justify-center">
            <Spinner tamanio={18} />
          </span>
        ) : (
          <Encaje on={presionado} size="sm" />
        ))}
      {!conEncaje && cargando && <Spinner tamanio={18} />}
      {icono}
      <span>{etiqueta}</span>
    </button>
  );
}
