'use client';

import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { MICROCOPY } from '@/content/microcopy';

interface HojaProps {
  abierta: boolean;
  onCerrar: () => void;
  titulo: string;
  children: ReactNode;
  /** Acción fija abajo (p. ej. "Agregar"). Queda visible aunque el contenido scrollee. */
  pie?: ReactNode;
  /** Lo que queda detrás: se marca `inert` mientras la hoja está abierta (foco y lectores). */
  fondo?: RefObject<HTMLElement | null>;
}

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Cuánto hay que arrastrar hacia abajo (px) para cerrarla. */
const UMBRAL_CIERRE = 120;

/**
 * Hoja inferior (bottom sheet) accesible: diálogo modal con el foco atrapado adentro, Escape y
 * el fondo para cerrar, y el foco de vuelta en lo que la abrió. Se cierra también arrastrándola
 * hacia abajo desde la manija (solo `transform`). En celular ocupa la pantalla; en escritorio se
 * posiciona dentro del contenedor `relative` más cercano (el celular de la demo).
 */
export function Hoja({ abierta, onCerrar, titulo, children, pie, fondo }: HojaProps) {
  const panel = useRef<HTMLDivElement>(null);
  const idTitulo = useId();
  const cerrar = useRef(onCerrar);
  useEffect(() => {
    cerrar.current = onCerrar;
  });

  useEffect(() => {
    if (!abierta) return;
    const el = panel.current;
    const detras = fondo?.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // Inerte y foco en el cuadro siguiente: hacerlo al montar fuerza un recálculo de layout antes
    // del primer pintado (medido: ~40 ms de INP con CPU ×4). Así la hoja se ve primero.
    // Sin desplazar la página: la hoja ya aparece a la vista.
    const cuadro = requestAnimationFrame(() => {
      detras?.setAttribute('inert', '');
      // Si en ese cuadro ya se tocó algo de adentro, no se le roba el foco.
      if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (!el) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        cerrar.current();
        return;
      }
      if (e.key !== 'Tab') return;
      // Sin filtrar por visibilidad: los radios "sr-only" de las opciones también son enfocables.
      const items = [...el.querySelectorAll<HTMLElement>(ENFOCABLES)];
      const primero = items[0];
      const ultimo = items.at(-1);
      if (!primero || !ultimo) {
        e.preventDefault();
        return;
      }
      const activo = document.activeElement;
      if (e.shiftKey && (activo === primero || activo === el)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && activo === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(cuadro);
      document.removeEventListener('keydown', onKey);
      detras?.removeAttribute('inert');
      // Si lo que la abrió sigue en pantalla, el foco vuelve ahí.
      if (opener?.isConnected) opener.focus();
    };
  }, [abierta, fondo]);

  // Arrastre hacia abajo desde la manija: se mueve con transform y, al soltar, cierra o vuelve.
  const inicio = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    inicio.current = e.clientY;
    // Captura el puntero para seguir el arrastre aunque salga de la manija (no existe en todos lados).
    e.currentTarget.setPointerCapture?.(e.pointerId);
    panel.current?.style.setProperty('transition', 'none');
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (inicio.current === null || !panel.current) return;
    const dy = Math.max(0, e.clientY - inicio.current);
    panel.current.style.transform = `translateY(${dy}px)`;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (inicio.current === null || !panel.current) return;
    const dy = Math.max(0, e.clientY - inicio.current);
    inicio.current = null;
    panel.current.style.removeProperty('transition');
    panel.current.style.removeProperty('transform');
    if (dy > UMBRAL_CIERRE) cerrar.current();
  };

  if (!abierta) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end lg:absolute">
      {/* Fondo: tocarlo cierra. Es un botón sin foco (Escape y "Cerrar" cubren el teclado). */}
      <div
        aria-hidden="true"
        onClick={() => cerrar.current()}
        className="hoja-fondo absolute inset-0 bg-paper-fg/50"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        className="hoja papel relative flex max-h-[88%] flex-col rounded-t-panel bg-paper text-paper-fg shadow-raised outline-none"
      >
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="cursor-grab touch-none px-4 pt-2 active:cursor-grabbing"
        >
          {/* Manija: indica que se puede arrastrar (decorativa). */}
          <span aria-hidden="true" className="mx-auto block h-1 w-10 rounded-full bg-paper-line" />
          <div className="flex items-center justify-between gap-4 pt-2 pb-2">
            <h2 id={idTitulo} className="text-heading font-semibold">
              {titulo}
            </h2>
            <button
              type="button"
              onClick={() => cerrar.current()}
              aria-label={MICROCOPY.cerrar}
              className="-mr-2 flex size-12 items-center justify-center rounded-full text-paper-fg hover:bg-paper-line"
            >
              <Icon name="cerrar" size={22} />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 [scrollbar-width:thin] overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-4">
          {children}
        </div>
        {pie && <div className="border-t border-paper-line px-4 py-4">{pie}</div>}
      </div>
    </div>
  );
}
