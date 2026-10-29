'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { getModulo, type ModuloId } from '@/config/modulos';
import {
  alternarModuloStore,
  hayDecisionesManuales,
  useModulos,
} from '@/features/empezar/modulos-store';
import { track } from '@/lib/analytics';
import { Icon } from '../icons/Icon';

/** Los cuatro módulos que se ofrecen en el hero. El resto se elige en el paso 2 del wizard. */
const TILES: readonly ModuloId[] = ['turnos', 'catalogo', 'carta_qr', 'pagos'];

/** Cuánto dura la pista "Tocá para activar" si nadie toca nada: se va sola. */
const PISTA_MS = 4000;

/** Fracción del mockup que tiene que verse para mostrar la pista. */
const VISIBLE_MINIMO = 0.5;

const pieza = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * Mockup interactivo del hero: una web que se arma y cuyos módulos se activan tocándolos.
 * Cada tarjeta es un <button aria-pressed> (teclado y lectores de pantalla gratis). Lo que se
 * activa acá llega pre-seleccionado al wizard (ver modulos-store). Solo anima transform/opacity.
 */
export function HeroMockup() {
  const { seleccionados } = useModulos();
  const [pista, setPista] = useState(false);
  const grupo = useRef<HTMLDivElement>(null);
  /** La pista se muestra una sola vez: ya salió, o la persona ya tocó una tarjeta. */
  const pistaUsada = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // La pista aparece cuando el mockup entra en pantalla y todavía no se tocó ninguna tarjeta.
  // Es texto (sin movimiento que reducir) y se va sola, o al primer toque.
  useEffect(() => {
    const el = grupo.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting || pistaUsada.current || hayDecisionesManuales()) return;
        pistaUsada.current = true;
        io.disconnect();
        setPista(true);
        timer.current = setTimeout(() => setPista(false), PISTA_MS);
      },
      { threshold: VISIBLE_MINIMO },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer.current);
    };
  }, []);

  const alternar = (id: ModuloId) => {
    const activo = alternarModuloStore(id);
    track('modulo_alternado', { modulo: id, activo, origen: 'hero' });
    // Al primer toque la pista deja de tener sentido: se oculta y no vuelve.
    pistaUsada.current = true;
    clearTimeout(timer.current);
    setPista(false);
  };

  const cantidad = seleccionados.length;
  const resumen =
    cantidad === 0 ? '' : `${cantidad} ${cantidad === 1 ? 'módulo activado' : 'módulos activados'}`;

  return (
    <div
      ref={grupo}
      role="group"
      aria-label="Armá tu negocio: activá los módulos que necesitás"
      className="mx-auto w-full max-w-sm rounded-panel border border-line-strong bg-surface p-4 shadow-raised"
    >
      {/* Barra superior y portada: decorativas. */}
      <div aria-hidden="true" className="hero-piece" style={pieza(0)}>
        <div className="flex h-8 items-center justify-between rounded-control bg-surface-2 px-4">
          <span className="h-2 w-14 rounded-full bg-fg" />
          <span className="flex gap-2">
            <span className="size-2 rounded-full bg-subtle" />
            <span className="size-2 rounded-full bg-subtle" />
            <span className="size-2 rounded-full bg-subtle" />
          </span>
        </div>
      </div>
      <div aria-hidden="true" className="hero-piece mt-3" style={pieza(1)}>
        <div className="rounded-card bg-surface-2 p-4">
          <span className="block h-3 w-3/4 rounded-full bg-fg" />
          <span className="mt-2 block h-2 w-1/2 rounded-full bg-subtle" />
          <span className="mt-4 block h-4 w-16 rounded-full bg-accent" />
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-3">
        {TILES.map((id, i) => {
          const activo = seleccionados.includes(id);
          return (
            <li key={id} className="hero-piece" style={pieza(i + 2)}>
              <button
                type="button"
                aria-pressed={activo}
                onClick={() => alternar(id)}
                className="tile group relative flex min-h-28 w-full flex-col justify-between gap-4 rounded-card border border-line bg-surface p-4 text-left transition-[transform] duration-100 hover:border-line-strong active:scale-[0.98] aria-pressed:border-accent aria-pressed:bg-accent-soft"
              >
                <span className={activo ? 'text-accent' : 'text-fg'}>
                  <Icon name={id} size={28} draw active={activo} />
                </span>
                <span className="text-body leading-tight font-semibold text-balance">
                  {getModulo(id).nombre}
                </span>
                <span
                  aria-hidden="true"
                  className="tile-check absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-accent text-accent-fg"
                >
                  <Icon name="check" size={16} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Reserva su altura (sin layout shift) y avisa los cambios a lectores de pantalla. */}
      <p aria-live="polite" className="tabular mt-3 min-h-6 text-center text-small text-muted">
        {pista ? <span className="hint-in inline-block text-fg">Tocá para activar</span> : resumen}
      </p>
    </div>
  );
}
