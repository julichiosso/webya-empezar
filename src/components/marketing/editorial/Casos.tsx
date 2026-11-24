'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/components/ui/clases';
import { CTA, PROYECTOS_UI as UI } from '@/content/home';
import type { Proyecto } from '@/content/proyectos';
import type { TipoId } from '@/content/servicios';
import { TextoBoton, TrazoBoton } from './Boton';

export interface CasoVista extends Proyecto {
  href: string;
  estadoTexto: string;
  dominio?: string;
}

/**
 * Las imágenes de cada caso, ya dibujadas en el servidor (composición del panel y teléfono de la tarjeta):
 * así los teléfonos y esquemas no viajan en el JavaScript de la página.
 */
export type VisualesCaso = Record<string, { panel: ReactNode; miniatura: ReactNode }>;

type Filtro = 'todos' | TipoId;

const BOTON = 'e-btn e-btn-chico';

function Estado({ caso }: { caso: CasoVista }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          caso.estado === 'produccion' ? 'bg-ed-fg' : 'border border-ed-fg',
        )}
      />
      {caso.estadoTexto}
    </span>
  );
}

/** Acciones de un caso: el caso completo y, si está publicado, el sitio. */
function Acciones({ caso }: { caso: CasoVista }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={caso.href} className={cn(BOTON, 'e-btn-primario')}>
        <TrazoBoton />
        <TextoBoton>{UI.verCaso}</TextoBoton>
      </Link>
      {caso.url && caso.estado === 'produccion' ? (
        <a
          href={caso.url}
          target="_blank"
          rel="noopener"
          aria-label={`${UI.verSitio} ${caso.dominio ?? ''}${CTA.pestana}`}
          className={cn(BOTON, 'e-btn-secundario')}
        >
          <TrazoBoton />
          <TextoBoton>{UI.verSitio}</TextoBoton>
        </a>
      ) : null}
    </div>
  );
}

/**
 * Casos de éxito. Escritorio: índice (pestañas: flechas del teclado, el indicador se desliza) y el panel
 * del caso activo con la composición escritorio + celular, el desafío en una línea y las acciones;
 * al pasar el mouse o con el foco cambia el panel (fundido corto), al hacer clic se abre el caso. Celular:
 * tarjetas apiladas que se expanden al tocarlas. Los filtros por tipo cambian las dos vistas.
 */
export function Casos({
  casos,
  visuales,
}: {
  casos: readonly CasoVista[];
  visuales: VisualesCaso;
}) {
  const router = useRouter();
  const base = useId();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const visibles = filtro === 'todos' ? casos : casos.filter((c) => c.tipo === filtro);
  const [activoId, setActivoId] = useState(casos[0]?.id ?? '');
  const activo = visibles.find((c) => c.id === activoId) ?? visibles[0];
  const tipos = (['pedidos', 'turnero', 'tienda', 'web'] as const).filter((t) =>
    casos.some((c) => c.tipo === t),
  );

  // El indicador del índice se desliza hasta la fila activa (mide su posición real).
  const filas = useRef(new Map<string, HTMLButtonElement>());
  const [indicador, setIndicador] = useState<{ y: number; alto: number } | null>(null);
  useLayoutEffect(() => {
    const el = activo ? filas.current.get(activo.id) : undefined;
    setIndicador(el ? { y: el.offsetTop, alto: el.offsetHeight } : null);
  }, [activo, filtro]);

  const mover = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const siguiente =
      e.key === 'ArrowDown'
        ? i + 1
        : e.key === 'ArrowUp'
          ? i - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? visibles.length - 1
              : null;
    if (siguiente === null) return;
    e.preventDefault();
    const destino = visibles[(siguiente + visibles.length) % visibles.length];
    if (!destino) return;
    setActivoId(destino.id);
    filas.current.get(destino.id)?.focus();
  };

  return (
    <div>
      <div
        role="group"
        aria-label={UI.filtros.aria}
        className="d-sin-barra -mx-[clamp(1rem,4vw,3rem)] flex gap-2 overflow-x-auto px-[clamp(1rem,4vw,3rem)] pb-1 lg:mx-0 lg:px-0"
      >
        {(['todos', ...tipos] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filtro === f}
            onClick={() => setFiltro(f)}
            className="min-h-11 shrink-0 rounded-full bg-ed-surface px-4 text-[0.875rem] font-medium text-ed-muted transition-colors hover:text-ed-fg aria-pressed:bg-ed-fg aria-pressed:text-ed-bg"
          >
            {f === 'todos' ? UI.filtros.todos : UI.filtros.tipos[f]}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? <p className="e-cuerpo mt-8 text-ed-muted">{UI.vacio}</p> : null}

      {/* ---------- Escritorio: índice + panel ---------- */}
      <div className="mt-8 hidden grid-cols-12 gap-x-10 lg:grid">
        <div
          role="tablist"
          aria-label={UI.indice}
          aria-orientation="vertical"
          className="relative col-span-5"
        >
          {indicador ? (
            <span
              aria-hidden="true"
              className="e-indicador-caso absolute left-0 w-0.5 rounded-full bg-ed-fg"
              style={{ transform: `translateY(${indicador.y}px)`, height: indicador.alto }}
            />
          ) : null}
          {visibles.map((c, i) => {
            const sel = c.id === activo?.id;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  if (el) filas.current.set(c.id, el);
                  else filas.current.delete(c.id);
                }}
                id={`${base}-tab-${c.id}`}
                type="button"
                role="tab"
                aria-selected={sel}
                aria-controls={`${base}-panel`}
                tabIndex={sel ? 0 : -1}
                onMouseEnter={() => setActivoId(c.id)}
                onFocus={() => setActivoId(c.id)}
                onClick={() => router.push(c.href)}
                onKeyDown={(e) => mover(e, i)}
                className={cn(
                  'grid w-full grid-cols-[2.5rem_1fr] gap-x-2 rounded-r-xl py-4 pr-4 pl-5 text-left transition-colors duration-300',
                  sel ? 'text-ed-fg' : 'text-ed-muted hover:text-ed-fg',
                )}
              >
                <span className="pt-1.5 text-[0.8125rem] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block text-[1.75rem] leading-tight font-semibold tracking-[-0.035em]">
                    {c.cliente}
                  </span>
                  <span className="e-chico mt-1 block text-ed-muted">
                    {c.rubro}, {c.ciudad}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={activo ? `${base}-tab-${activo.id}` : undefined}
          className="col-span-7 min-w-0 rounded-[1.75rem] bg-ed-surface p-7"
        >
          {activo ? (
            <>
              <div className="e-chico flex items-center justify-between gap-4 text-ed-muted">
                <span>
                  {activo.rubro}, {activo.ciudad}
                </span>
                <Estado caso={activo} />
              </div>
              <div className="relative mt-5">
                {visibles.map((c, i) => (
                  <div
                    key={c.id}
                    aria-hidden={c.id !== activo.id}
                    data-activo={c.id === activo.id || undefined}
                    className={cn('e-capa-caso', i > 0 && 'absolute inset-0')}
                  >
                    {visuales[c.id]?.panel}
                  </div>
                ))}
              </div>
              {/* Poco texto: el desafío en una línea y las acciones. El detalle vive en la página del caso. */}
              <div key={activo.id} className="e-texto-caso mt-7">
                <p className="e-lead max-w-[48ch]">{activo.desafio}</p>
                <div className="mt-5">
                  <Acciones caso={activo} />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* ---------- Celular y tablet: tarjetas apiladas que se expanden ---------- */}
      <ul className="mt-6 space-y-3 lg:hidden">
        {visibles.map((c) => {
          return (
            <li key={c.id}>
              <details className="e-tarjeta-caso group rounded-[1.5rem] bg-ed-surface">
                <summary className="flex min-h-11 cursor-pointer list-none gap-4 p-4 [&::-webkit-details-marker]:hidden">
                  <span className="relative w-22 shrink-0 sm:w-28">
                    {visuales[c.id]?.miniatura}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="e-chico text-ed-muted">
                      <Estado caso={c} />
                    </span>
                    <span className="mt-2 text-[1.25rem] leading-tight font-semibold tracking-[-0.03em]">
                      {c.cliente}
                    </span>
                    <span className="e-chico mt-1 text-ed-muted">
                      {c.rubro}, {c.ciudad}
                    </span>
                    <span className="e-chico mt-auto pt-3 font-medium">
                      <span className="group-open:hidden">{UI.abrir}</span>
                      <span className="hidden group-open:inline">{UI.cerrar}</span>
                    </span>
                  </span>
                </summary>
                <div className="space-y-4 px-4 pb-5">
                  <p className="e-cuerpo">{c.desafio}</p>
                  <Acciones caso={c} />
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
