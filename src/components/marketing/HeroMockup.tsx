'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { HERO_MOCKUP } from '@/content/empezar/hero';
import { getModulo, type ModuloId } from '@/content/modulos';
// eslint-disable-next-line no-restricted-imports -- deuda registrada en tests/arquitectura/excepciones.ts
import {
  alternarModuloStore,
  hayDecisionesManuales,
  useModulos,
} from '@/features/empezar/modulos-store';
import { track } from '@/lib/analytics';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { ModuloArte } from '@/brand/ilustracion/modulos/ModuloArte';
import { Encaje } from '@/components/ui/Encaje';

/** Los cuatro módulos que se ofrecen en el hero. El resto se elige en el paso 2 del wizard. */
const TILES: readonly ModuloId[] = ['turnos', 'catalogo', 'carta_qr', 'pagos'];

/** Cuánto dura la pista "Tocá para activar" si nadie toca nada: se va sola. */
const PISTA_MS = 4000;

/** Fracción del mockup que tiene que verse para mostrar la pista. */
const VISIBLE_MINIMO = 0.5;

const pieza = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * Mockup interactivo del hero: una mini web de negocio que se arma según los módulos activos.
 * Cada tarjeta es un <button aria-pressed> (teclado y lectores de pantalla gratis); el dibujo
 * de adentro y la barra de navegación son decorativos. Lo que se activa acá llega
 * pre-seleccionado al wizard (ver modulos-store). Solo anima transform/opacity.
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
  const resumen = cantidad === 0 ? '' : HERO_MOCKUP.activados(cantidad);
  // Cuantos más módulos, más se nota el resplandor (de 0,35 a 1).
  const brillo = Math.min(1, 0.35 + cantidad * 0.2);

  return (
    <div className="relative isolate mx-auto w-full max-w-sm lg:max-w-none">
      {/* Resplandor del acento muy sutil (solo escritorio): degradado estático, solo cambia la opacity. */}
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute -inset-16 -z-10 hidden lg:block"
        style={{ opacity: brillo }}
      />

      <div
        ref={grupo}
        role="group"
        aria-label={HERO_MOCKUP.ariaGrupo}
        className="rounded-panel border border-line-strong bg-surface p-4 shadow-raised lg:p-6"
      >
        {/* Barra del navegador de la mini web: decorativa. En escritorio muestra un acceso por módulo activo. */}
        <div aria-hidden="true" className="hero-piece" style={pieza(0)}>
          <div className="flex h-8 items-center justify-between rounded-control bg-surface-2 px-4 lg:h-10">
            <span className="h-2 w-14 rounded-full bg-fg" />
            <span className="hidden gap-4 lg:flex">
              {TILES.map((id) => (
                <span
                  key={id}
                  data-on={seleccionados.includes(id)}
                  className="pop-on h-2 w-10 rounded-full bg-line-strong data-[on=true]:bg-fg"
                />
              ))}
            </span>
            <span className="flex gap-2">
              <span className="size-2 rounded-full bg-subtle" />
              <span className="size-2 rounded-full bg-subtle" />
              <span className="size-2 rounded-full bg-subtle" />
            </span>
          </div>
        </div>
        <div aria-hidden="true" className="hero-piece mt-3 lg:mt-4" style={pieza(1)}>
          <div className="flex items-center justify-between gap-6 rounded-card bg-surface-2 p-4 lg:p-6">
            <div className="min-w-0 flex-1">
              <span className="block h-3 w-3/4 rounded-full bg-fg lg:h-4" />
              <span className="mt-2 block h-2 w-1/2 rounded-full bg-subtle lg:mt-4" />
              <span className="mt-4 block h-4 w-16 rounded-full bg-accent lg:mt-6 lg:h-6 lg:w-24" />
            </div>
            <span className="hidden size-20 shrink-0 rounded-card bg-line lg:block" />
          </div>
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-3 lg:mt-4 lg:gap-4">
          {TILES.map((id, i) => {
            const activo = seleccionados.includes(id);
            return (
              <li key={id} className="hero-piece" style={pieza(i + 2)}>
                <button
                  type="button"
                  aria-pressed={activo}
                  onClick={() => alternar(id)}
                  className="tile group relative flex h-full min-h-28 w-full flex-col justify-between gap-4 rounded-card border border-line bg-surface p-4 text-left transition-[transform] duration-100 hover:border-line-strong active:scale-[0.98] aria-pressed:border-accent aria-pressed:bg-accent-soft lg:min-h-48"
                >
                  <span className={activo ? 'text-accent' : 'text-fg'}>
                    <Icon name={id} size={28} draw active={activo} />
                  </span>
                  <span className="text-body leading-tight font-semibold text-balance">
                    {getModulo(id).nombre}
                  </span>
                  {/* Lo que aporta a la mini web: solo escritorio, decorativo. */}
                  <span aria-hidden="true" className="hidden lg:block">
                    <ModuloArte id={id} activo={activo} />
                  </span>
                  <Encaje on={activo} className="absolute top-3 right-3" />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Reserva su altura (sin layout shift) y avisa los cambios a lectores de pantalla. */}
        <p aria-live="polite" className="tabular mt-3 min-h-6 text-center text-small text-muted">
          {pista ? (
            <span className="hint-in inline-block text-fg">{HERO_MOCKUP.pista}</span>
          ) : (
            resumen
          )}
        </p>
      </div>
    </div>
  );
}
