'use client';

import type { CSSProperties, ReactNode, RefObject } from 'react';
import { cn } from '@/components/ui/clases';
import { getDemo, type DemoInfo } from '@/content/demos/hub';
import type { ControlesEstudio } from '@/domain/studio/controles';
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
  estudio,
  extra,
  arriba,
  estilo,
  herramientas,
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
  /** Demo personalizable: historial, link y resumen para la barra. */
  estudio?: ControlesEstudio;
  /** Botón propio de la demo en la barra (por ejemplo, "Personalizar"). */
  extra?: ReactNode;
  /** Reemplaza al escenario mientras está (el asistente de la demo). */
  arriba?: ReactNode;
  /** Variables de la marca que armó la persona. */
  estilo?: CSSProperties;
  /** Herramientas del dueño (el simulador): bajo la guía en la compu, arriba del panel en el celular. */
  herramientas?: ReactNode;
}) {
  const enUso = getDemo(demo).enUso;
  const actual = hechos.findIndex((h) => !h);
  return (
    <div className={cn('tono-oscuro min-h-svh bg-ed-bg text-ed-fg', claseRaiz)} style={estilo}>
      <BarraDemo demo={demo} onReiniciar={onReiniciar} estudio={estudio} extra={extra} />
      <main>
        <h1 className="sr-only">{titulo}</h1>
        {arriba}
        <div className={arriba ? 'hidden' : 'contents'}>
          <div className="d-escenario hidden justify-center gap-8 px-6 py-6 lg:flex xl:gap-12">
            <div className="w-60 shrink-0 pt-2">
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
                        'grid size-7 shrink-0 place-items-center rounded-full text-[0.875rem] font-bold tabular-nums',
                        hechos[i] ? 'bg-lima text-tinta' : 'border border-ed-line-strong',
                      )}
                    >
                      {hechos[i] ? <Tilde className="size-3" /> : i + 1}
                      {hechos[i] ? <span className="sr-only">{guia.hecho}</span> : null}
                    </span>
                    <span>
                      <span className="block text-[1rem] font-semibold">{p.titulo}</span>
                      <span className="mt-0.5 block text-[0.9375rem] leading-snug text-ed-muted">
                        {p.texto}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              {herramientas ? <div className="mt-6">{herramientas}</div> : null}
              {enUso ? <EnUso proyecto={enUso} className="mt-6" /> : null}
            </div>
            <div className="shrink-0">
              <p className="mb-2 text-center text-[0.9375rem] text-ed-muted">{lados.cliente}</p>
              <Telefono className="d-tel shrink-0" decorativo={false} colorBarra={colorBarra}>
                <Escalado>{cliente('escritorio')}</Escalado>
              </Telefono>
            </div>
            <div className="w-full max-w-120 min-w-0">
              <p className="mb-2 text-center text-[0.9375rem] text-ed-muted">{lados.panel}</p>
              <div
                ref={panelRef}
                tabIndex={-1}
                className="d-ventana w-full overflow-hidden rounded-[1.5rem] border border-ed-line outline-none focus-visible:ring-2 focus-visible:ring-lima"
              >
                {panel('escritorio', true)}
              </div>
            </div>
          </div>

          <div className="flex h-[calc(100svh-3.5rem-var(--d-cta))] flex-col lg:hidden">
            <nav
              aria-label={vistas.aria}
              className="flex shrink-0 justify-center border-b border-ed-line bg-ed-bg px-4 py-2"
            >
              <div className="grid w-full max-w-sm grid-cols-2 gap-1 rounded-full border border-ed-line-strong p-1">
                <BotonVista activa={vista === 'cliente'} onClick={() => onVista('cliente')}>
                  {vistas.cliente}
                </BotonVista>
                <BotonVista activa={vista === 'duenio'} onClick={() => onVista('duenio')}>
                  {vistas.duenio}
                  {novedad && vista === 'cliente' ? (
                    <span className="size-2.5 rounded-full bg-lima">
                      <span className="sr-only">{vistas.novedad}</span>
                    </span>
                  ) : null}
                </BotonVista>
              </div>
            </nav>
            <div className="relative min-h-0 flex-1">
              <div className={vista === 'cliente' ? 'h-full' : 'hidden'}>{cliente('movil')}</div>
              <div className={vista === 'duenio' ? 'flex h-full flex-col' : 'hidden'}>
                {herramientas ? (
                  <div className="shrink-0 border-b border-ed-line px-4 py-3">{herramientas}</div>
                ) : null}
                <div className="min-h-0 flex-1">{panel('movil', vista === 'duenio')}</div>
              </div>
            </div>
          </div>
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
      className="flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[1.0625rem] font-semibold text-ed-muted aria-pressed:bg-ed-fg aria-pressed:text-ed-bg"
    >
      {children}
    </button>
  );
}
