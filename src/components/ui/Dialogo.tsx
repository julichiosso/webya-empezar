'use client';

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { Button } from './Button';
import type { ContratoDialogo } from './contratos';
import { cn } from './clases';

interface DialogoProps extends ContratoDialogo {
  onCerrar: () => void;
  children: ReactNode;
  /** Bajada corta debajo del título (se asocia con aria-describedby). */
  descripcion?: string;
  /** Acción fija abajo (p. ej. "Confirmar pedido"): queda visible aunque el contenido scrollee. */
  pie?: ReactNode;
  /** Trabajando (p. ej. enviando el pedido): el contenido queda aria-busy. */
  cargando?: boolean;
  /** Resultado de una acción adentro del diálogo, anunciado en una región viva. */
  mensaje?: { tipo: 'error' | 'exito'; texto: string };
  className?: string;
}

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PRESENTACIONES: Record<ContratoDialogo['presentacion'], string> = {
  // Centrado: cuadro de hasta 32 rem; entra con opacity.
  centro: 'fade-in m-auto w-11/12 max-w-lg rounded-panel',
  // Hoja inferior: pegada abajo, a todo el ancho en celular; sube desde abajo (transform).
  hoja: 'hoja mx-auto mt-auto mb-0 w-full max-w-none rounded-t-panel border-b-0 sm:max-w-xl',
};

/**
 * El único diálogo del sistema, sobre `<dialog>` nativo con `showModal()`: capa superior, fondo
 * inerte y Escape gratis. Encima: el foco va al diálogo al abrir (los lectores leen su nombre), Tab
 * da la vuelta adentro, tocar el fondo cierra y el foco vuelve a lo que lo abrió.
 * Es controlado: `abierto` manda y cualquier cierre pasa por `onCerrar`.
 * Movimiento: `fade-in` (centro) y `hoja` (hoja) ya tienen su versión quieta en reduced-motion.
 */
export function Dialogo({
  titulo,
  presentacion,
  etiquetaCerrar,
  abierto,
  onCerrar,
  children,
  descripcion,
  pie,
  cargando,
  mensaje,
  className,
}: DialogoProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();
  const idDescripcion = useId();
  const cerrar = useRef(onCerrar);
  useEffect(() => {
    cerrar.current = onCerrar;
  });

  useEffect(() => {
    const d = ref.current;
    if (!d || !abierto) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!d.open) d.showModal();
    // Foco al primer [autofocus] o al diálogo mismo: así se anuncia el título primero.
    const auto = d.querySelector<HTMLElement>('[autofocus]');
    (auto ?? d).focus({ preventScroll: true });

    // Cierres nativos (gesto atrás en Android, form method="dialog"): se avisan al dueño del estado.
    const onCancel = (e: Event) => {
      e.preventDefault();
      cerrar.current();
    };
    const onClose = () => cerrar.current();
    d.addEventListener('cancel', onCancel);
    d.addEventListener('close', onClose);
    return () => {
      d.removeEventListener('cancel', onCancel);
      d.removeEventListener('close', onClose);
      if (d.open) d.close();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [abierto]);

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    const d = ref.current;
    if (!d) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      cerrar.current();
      return;
    }
    if (e.key !== 'Tab') return;
    // Sin filtrar por visibilidad: los inputs "sr-only" de las opciones también son enfocables.
    const items = [...d.querySelectorAll<HTMLElement>(ENFOCABLES)];
    const primero = items[0];
    const ultimo = items.at(-1);
    if (!primero || !ultimo) {
      e.preventDefault();
      return;
    }
    const activo = document.activeElement;
    if (e.shiftKey && (activo === primero || activo === d)) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && activo === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      aria-describedby={descripcion ? idDescripcion : undefined}
      tabIndex={-1}
      data-presentacion={presentacion}
      onKeyDown={onKeyDown}
      // El fondo (::backdrop) es parte del <dialog>: el toque llega con target === dialog.
      onClick={(e) => e.target === e.currentTarget && cerrar.current()}
      className={cn(
        // open:flex (no flex a secas): cerrado, el <dialog> tiene que seguir en display none.
        'max-h-11/12 border border-panel-borde bg-panel-fondo p-0 text-fg shadow-raised backdrop:bg-bg/80 open:flex open:flex-col',
        PRESENTACIONES[presentacion],
        className,
      )}
    >
      {abierto && (
        <>
          <div className="flex items-start justify-between gap-4 px-6 pt-4 pb-2">
            <div className="min-w-0 pt-2">
              <h2 id={idTitulo} className="text-heading font-semibold text-balance">
                {titulo}
              </h2>
              {descripcion && (
                <p id={idDescripcion} className="mt-2 text-small text-muted">
                  {descripcion}
                </p>
              )}
            </div>
            <Button
              variante="icono"
              etiquetaAccesible={etiquetaCerrar}
              onClick={() => cerrar.current()}
              className="-mr-2"
            >
              <Icon name="cerrar" size={22} />
            </Button>
          </div>
          <div
            aria-busy={cargando || undefined}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6"
          >
            {children}
          </div>
          <div aria-live="polite" className="px-6">
            {mensaje && (
              <p
                data-tipo={mensaje.tipo}
                className={cn(
                  'pb-4 text-small font-medium',
                  mensaje.tipo === 'error' ? 'text-control-error' : 'text-fg',
                )}
              >
                {mensaje.texto}
              </p>
            )}
          </div>
          {pie && <div className="border-t border-line px-6 py-4">{pie}</div>}
        </>
      )}
    </dialog>
  );
}
