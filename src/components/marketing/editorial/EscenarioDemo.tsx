'use client';

import type { ReactNode, RefObject } from 'react';
import { cn } from '@/components/ui/clases';
import { getDemo, type DemoInfo } from '@/content/demos/hub';
import { BarraDemo } from './BarraDemo';
import { EnUso } from './EnUso';
import { Tilde } from './Iconos';
import { Telefono } from './Pantallas';
import { Escalado } from '@/components/patterns/Escalado';

export type Vista = 'cliente' | 'duenio';
type Instancia = 'escritorio' | 'movil';

/**
 * Escenario común de las demos. En escritorio, la guía, el celular del cliente (la app dibujada a 375 px
 * y escalada) y el panel del dueño, del mismo alto y dentro de la pantalla. En celular, una cara a la vez
 * a pantalla completa y el selector abajo, con su propio lugar. La app y el panel se montan una vez por
 * forma (escritorio y celular), por eso llegan como funciones.
 */
export function EscenarioDemo({
  demo,
  titulo,
  claseRaiz,
  guia,
  hechos,
  lados,
  vistas,
  colorBarra,
  vista,
  onVista,
  novedad,
  onReiniciar,
  panelRef,
  cliente,
  panel,
}: {
  demo: DemoInfo['id'];
  titulo: string;
  claseRaiz?: string;
  guia: { aria: string; hecho: string; pasos: readonly { titulo: string; texto: string }[] };
  hechos: readonly boolean[];
  lados: { cliente: string; panel: string };
  vistas: { aria: string; cliente: string; duenio: string; novedad: string };
  colorBarra?: { fondo: string; claro: boolean };
  vista: Vista;
  onVista: (v: Vista) => void;
  novedad: boolean;
  onReiniciar: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
  cliente: (i: Instancia) => ReactNode;
  panel: (i: Instancia, visible: boolean) => ReactNode;
}) {
  const enUso = getDemo(demo).enUso;
  const actual = hechos.findIndex((h) => !h);
  return (
    <div className={cn('tono-oscuro min-h-svh bg-ed-bg text-ed-fg', claseRaiz)}>
      <BarraDemo demo={demo} onReiniciar={onReiniciar} />
      <main>
        <h1 className="sr-only">{titulo}</h1>
        <div className="d-escenario hidden justify-center gap-8 px-6 py-6 lg:flex xl:gap-12">
          <div className="w-52 shrink-0 pt-2">
            <ol aria-label={guia.aria} className="space-y-2">
              {guia.pasos.map((p, i) => (
                <li
                  key={p.titulo}
                  aria-current={actual === i ? 'step' : undefined}
                  className={cn(
                    'flex gap-3 rounded-xl border p-3 transition-colors',
                    actual === i ? 'border-ed-fg' : 'border-transparent',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full text-[0.6875rem] font-bold tabular-nums',
                      hechos[i] ? 'bg-lima text-tinta' : 'border border-ed-line-strong',
                    )}
                  >
                    {hechos[i] ? <Tilde className="size-3" /> : i + 1}
                    {hechos[i] ? <span className="sr-only">{guia.hecho}</span> : null}
                  </span>
                  <span>
                    <span className="block text-[0.8125rem] font-semibold">{p.titulo}</span>
                    <span className="mt-0.5 block text-[0.75rem] leading-snug text-ed-muted">
                      {p.texto}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            {enUso ? <EnUso proyecto={enUso} className="mt-6" /> : null}
          </div>
          <div className="shrink-0">
            <p className="mb-2 text-center text-[0.75rem] text-ed-muted">{lados.cliente}</p>
            <Telefono className="d-tel shrink-0" decorativo={false} colorBarra={colorBarra}>
              <Escalado>{cliente('escritorio')}</Escalado>
            </Telefono>
          </div>
          <div className="w-full max-w-120 min-w-0">
            <p className="mb-2 text-center text-[0.75rem] text-ed-muted">{lados.panel}</p>
            <div
              ref={panelRef}
              tabIndex={-1}
              className="d-ventana w-full overflow-hidden rounded-[1.5rem] border border-ed-line outline-none focus-visible:ring-2 focus-visible:ring-lima"
            >
              {panel('escritorio', true)}
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100svh-2.75rem)] flex-col lg:hidden">
          <div className="relative min-h-0 flex-1">
            <div className={vista === 'cliente' ? 'h-full' : 'hidden'}>{cliente('movil')}</div>
            <div className={vista === 'duenio' ? 'h-full' : 'hidden'}>
              {panel('movil', vista === 'duenio')}
            </div>
          </div>
          <nav
            aria-label={vistas.aria}
            className="flex shrink-0 justify-center border-t border-ed-line bg-ed-bg px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex gap-1 rounded-full border border-ed-line-strong p-1">
              <BotonVista activa={vista === 'cliente'} onClick={() => onVista('cliente')}>
                {vistas.cliente}
              </BotonVista>
              <BotonVista activa={vista === 'duenio'} onClick={() => onVista('duenio')}>
                {vistas.duenio}
                {novedad && vista === 'cliente' ? (
                  <span className="size-2 rounded-full bg-lima">
                    <span className="sr-only">{vistas.novedad}</span>
                  </span>
                ) : null}
              </BotonVista>
            </div>
          </nav>
        </div>
      </main>
    </div>
  );
}

function BotonVista({
  activa,
  onClick,
  children,
}: {
  activa: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className="flex min-h-11 items-center gap-2 rounded-full px-5 text-[0.875rem] font-semibold text-ed-muted aria-pressed:bg-ed-fg aria-pressed:text-ed-bg"
    >
      {children}
    </button>
  );
}
