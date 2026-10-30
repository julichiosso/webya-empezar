import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import type { ContratoBoton } from './contratos';
import { cn } from './clases';
import { Spinner } from './Spinner';

import {
  buttonClasses,
  DE_ANTES,
  type ButtonStatus,
  type Tamanio,
  type Variante,
  type VarianteAnterior,
} from './boton-clases';

export { buttonClasses, type ButtonStatus, type Variante };

type Etiquetado =
  | { variante: 'icono'; etiquetaAccesible: string }
  | { variante?: Exclude<Variante, 'icono'>; etiquetaAccesible?: string };

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<ContratoBoton, 'variante' | 'etiquetaAccesible'> &
  Etiquetado & {
    /** Terminó bien: muestra el check y no acepta otro toque. */
    exito?: boolean;
    /**
     * Falló la acción: el botón queda habilitado para reintentar y se asocia al mensaje que explica qué
     * pasó (id de un texto visible, nunca solo color).
     */
    idError?: string;
    ref?: Ref<HTMLButtonElement>;
    /** @deprecated usar `variante`. */
    variant?: VarianteAnterior;
    /** @deprecated usar `cargando` / `exito`. */
    status?: ButtonStatus;
    /** @deprecated usar `anchoCompleto`. */
    fullWidth?: boolean;
  };

/**
 * Botón de WebYa. Estados: default, hover, focus (global), active (toque), disabled, loading
 * (`cargando`: spinner, aria-busy y sin doble envío), error (`idError`) y success (`exito`: check).
 * En carga o éxito no se deshabilita (el foco no se pierde): queda `aria-disabled` y el toque se ignora,
 * así un formulario no se envía dos veces. El ancho no cambia entre estados (sin layout shift).
 */
export function Button({
  variante,
  variant,
  tamanio = 'normal',
  anchoCompleto,
  fullWidth,
  cargando,
  exito,
  status = 'idle',
  etiquetaAccesible,
  idError,
  className,
  children,
  type = 'button',
  onClick,
  'aria-describedby': describedBy,
  ...rest
}: ButtonProps) {
  const v = variante ?? (variant ? DE_ANTES[variant] : 'primario');
  const enCarga = Boolean(cargando) || status === 'loading';
  const enExito = !enCarga && (Boolean(exito) || status === 'success');
  const ocupado = enCarga || enExito;

  const alTocar = (e: MouseEvent<HTMLButtonElement>) => {
    // Sin doble envío: el toque (y el submit implícito con Enter) se cancela mientras está ocupado.
    if (ocupado) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      aria-busy={enCarga || undefined}
      aria-disabled={ocupado || undefined}
      aria-label={etiquetaAccesible}
      aria-describedby={cn(describedBy, idError) || undefined}
      data-estado={enCarga ? 'cargando' : enExito ? 'exito' : idError ? 'error' : undefined}
      className={cn(buttonClasses(v, anchoCompleto ?? fullWidth, tamanio), className)}
      onClick={alTocar}
      {...rest}
    >
      <span
        className={cn(
          'inline-flex items-center gap-2 transition-opacity duration-150 motion-reduce:transition-none',
          ocupado ? 'opacity-0' : 'opacity-100',
        )}
      >
        {children}
      </span>
      <Overlay show={enCarga}>
        <Spinner />
      </Overlay>
      <Overlay show={enExito}>
        <Icon name="check" size={24} draw active={enExito} />
      </Overlay>
    </button>
  );
}

function Overlay({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 motion-reduce:transition-none',
        show ? 'opacity-100' : 'opacity-0',
      )}
    >
      {show && children}
    </span>
  );
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variante?: Exclude<Variante, 'icono'>;
  tamanio?: Tamanio;
  anchoCompleto?: boolean;
  /** @deprecated usar `variante`. */
  variant?: VarianteAnterior;
  /** @deprecated usar `anchoCompleto`. */
  fullWidth?: boolean;
}

/** Enlace con forma de botón (navega: no tiene estados de carga). */
export function ButtonLink({
  variante,
  variant,
  tamanio = 'normal',
  anchoCompleto,
  fullWidth,
  className,
  ...rest
}: ButtonLinkProps) {
  const v = variante ?? (variant ? DE_ANTES[variant] : 'primario');
  return (
    <a className={cn(buttonClasses(v, anchoCompleto ?? fullWidth, tamanio), className)} {...rest} />
  );
}
