'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/components/ui/clases';
import { NOCHE_DEMO, PRODUCTOS, SECCIONES } from '@/content/demos/pedidos/carta';
import { COMANDA, PANEL, pesos } from '@/content/demos/pedidos/ui';
import { estadoFranja, minAHhmm, type EstadoFranja } from '@/domain/retiro/franjas';
import { Dibujo } from './Dibujo';
import {
  alternarAbierto,
  alternarBloqueo,
  alternarProducto,
  cambiarCapacidad,
  confirmarPedido,
  franjasConConteo,
  marcarComandaVista,
  type EstadoDemo,
  type Pedido,
  type StoreDemo,
} from './store';

interface Props {
  e: EstadoDemo;
  ahora: number;
  set: StoreDemo['set'];
  onComanda: () => void;
  onConfirmar: () => void;
  /** Se está viendo (en celular, el panel queda oculto mientras se mira la app del cliente). */
  visible?: boolean;
}

const TONO_FRANJA: Record<EstadoFranja, string> = {
  pasado: 'bg-[var(--p-fondo)] text-[var(--p-txt-2)]',
  pausado: 'bg-[var(--p-rojo-suave)] ring-[var(--p-rojo)]/25',
  lleno: 'bg-[var(--p-rojo-suave)] ring-[var(--p-rojo)]/25',
  casi: 'bg-[var(--p-card)]',
  libre: 'bg-[var(--p-card)]',
};

const TONO_BADGE: Record<EstadoFranja, string> = {
  pasado: 'bg-[var(--p-linea)] text-[var(--p-txt-2)]',
  pausado: 'bg-[var(--p-rojo-suave)] text-[var(--p-rojo-texto)]',
  lleno: 'bg-[var(--p-rojo-suave)] text-[var(--p-rojo-texto)]',
  casi: 'bg-[var(--p-ambar-suave)] text-[var(--p-txt)]',
  libre: 'bg-[var(--p-verde-suave)] text-[var(--p-txt)]',
};

/** El panel del dueño: el local, las franjas de hoy con sus pedidos, y los productos. */
export function Panel({ e, ahora, set, onComanda, onConfirmar, visible = true }: Props) {
  const [pestana, setPestana] = useState<'turnos' | 'productos'>('turnos');
  const [abiertas, setAbiertas] = useState<ReadonlySet<number>>(new Set());
  const [comanda, setComanda] = useState<Pedido>();
  const scroller = useRef<HTMLDivElement>(null);
  const nuevo = e.ultimoPropio != null ? e.pedidos.find((p) => p.id === e.ultimoPropio) : undefined;

  // Entra un pedido propio: se abre su franja (estado derivado, en el render)...
  const [atendido, setAtendido] = useState<number>();
  if (nuevo && nuevo.id !== atendido) {
    setAtendido(nuevo.id);
    setPestana('turnos');
    setAbiertas((a) => new Set(a).add(nuevo.franja));
  }
  // ...y el panel la trae a la vista (solo DOM: no toca estado).
  const franjaNueva = nuevo?.franja;
  useEffect(() => {
    if (franjaNueva == null || !visible) return;
    const t = setTimeout(() => {
      const caja = scroller.current;
      const el = caja?.querySelector<HTMLElement>(`[data-franja="${franjaNueva}"]`);
      const cabecera = caja?.querySelector('header')?.offsetHeight ?? 0;
      if (el && caja) caja.scrollTo({ top: el.offsetTop - cabecera - 12, behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(t);
  }, [franjaNueva, e.ultimoPropio, visible]);

  const alternar = (inicio: number) =>
    setAbiertas((a) => {
      const s = new Set(a);
      if (s.has(inicio)) s.delete(inicio);
      else s.add(inicio);
      return s;
    });

  return (
    <div className="m-panel relative h-full overflow-hidden">
      <div
        ref={scroller}
        className="m-barra-fina relative h-full overflow-y-auto overscroll-contain"
      >
        <header className="sticky top-0 z-10 border-b border-[var(--p-linea)] bg-[var(--p-fondo)]/90 px-4 pt-4 pb-3 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[1.0625rem] font-bold">{PANEL.marca}</p>
              <p className="text-[0.75rem] text-[var(--p-txt-2)] tabular-nums">
                {PANEL.hoy(NOCHE_DEMO.dia, minAHhmm(ahora))}
              </p>
            </div>
            <span
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold',
                e.abierto
                  ? 'bg-[var(--p-verde-suave)]'
                  : 'bg-[var(--p-rojo-suave)] text-[var(--p-rojo-texto)]',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'size-1.5 rounded-full',
                  e.abierto ? 'bg-[var(--p-verde)]' : 'bg-[var(--p-rojo)]',
                )}
              />
              {e.abierto ? PANEL.abierto : PANEL.cerrado}
            </span>
          </div>
          <div
            role="tablist"
            aria-label={PANEL.pestanasAria}
            className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-[var(--p-linea)] p-1"
          >
            {(['turnos', 'productos'] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={pestana === p}
                onClick={() => setPestana(p)}
                className="rounded-lg py-1.5 text-[0.8125rem] font-semibold text-[var(--p-txt-2)] aria-selected:bg-[var(--p-card)] aria-selected:text-[var(--p-txt)]"
              >
                {p === 'turnos' ? PANEL.turnos : PANEL.productos}
              </button>
            ))}
          </div>
        </header>

        <div className="px-4 pt-3 pb-8">
          {pestana === 'turnos' ? (
            <>
              <div className="flex items-center justify-between rounded-2xl bg-[var(--p-card)] px-4 py-3">
                <span>
                  <span className="block text-[0.875rem] font-semibold">{PANEL.localAbierto}</span>
                  <span className="block text-[0.75rem] text-[var(--p-txt-2)]">
                    {PANEL.horario(NOCHE_DEMO.apertura, NOCHE_DEMO.cierre)}
                  </span>
                </span>
                <Interruptor
                  activo={e.abierto}
                  etiqueta={PANEL.localAbierto}
                  onClick={() => set(alternarAbierto)}
                />
              </div>
              <ul className="mt-3 space-y-2.5">
                {franjasConConteo(e).map((f) => {
                  const est = estadoFranja(f, ahora);
                  const rango = PANEL.rango(minAHhmm(f.inicio), minAHhmm(f.fin));
                  const pedidos = e.pedidos.filter((p) => p.franja === f.inicio);
                  const abierta = abiertas.has(f.inicio);
                  const conNuevo = nuevo?.franja === f.inicio;
                  return (
                    <li
                      key={f.inicio}
                      data-franja={f.inicio}
                      className={cn(
                        'rounded-2xl p-3.5 ring-1 ring-[var(--p-linea)] transition-shadow',
                        TONO_FRANJA[est],
                        conNuevo && 'ring-2 ring-[var(--p-azul)]',
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[0.9375rem] font-semibold tabular-nums">{rango}</p>
                          <span
                            className={cn(
                              'mt-1 inline-block rounded-md px-1.5 py-0.5 text-[0.6875rem] font-semibold',
                              TONO_BADGE[est],
                            )}
                          >
                            {PANEL.estados[est]}
                          </span>
                        </div>
                        {est !== 'pasado' ? (
                          <div className="flex items-center gap-1.5">
                            <BotonRedondo
                              etiqueta={PANEL.menos(rango)}
                              onClick={() => set((x) => cambiarCapacidad(x, f.inicio, -1))}
                            >
                              <Linea />
                            </BotonRedondo>
                            <span className="w-5 text-center text-[0.875rem] font-semibold tabular-nums">
                              {f.capacidad}
                            </span>
                            <BotonRedondo
                              etiqueta={PANEL.mas(rango)}
                              onClick={() => set((x) => cambiarCapacidad(x, f.inicio, 1))}
                            >
                              <Linea mas />
                            </BotonRedondo>
                          </div>
                        ) : null}
                      </div>
                      <div className="mt-2.5 flex items-center gap-2.5">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--p-linea)]">
                          <span
                            className={cn(
                              'block h-full rounded-full',
                              est === 'lleno' || est === 'pausado'
                                ? 'bg-[var(--p-rojo)]'
                                : est === 'casi'
                                  ? 'bg-[var(--p-ambar)]'
                                  : 'bg-[var(--p-verde)]',
                            )}
                            style={{
                              width: `${Math.min(100, (f.pedidos / Math.max(1, f.capacidad)) * 100)}%`,
                            }}
                          />
                        </span>
                        <span className="text-[0.75rem] text-[var(--p-txt-2)] tabular-nums">
                          {PANEL.ocupacion(f.pedidos, f.capacidad)}
                        </span>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {pedidos.length > 0 ? (
                          <button
                            type="button"
                            aria-expanded={abierta}
                            onClick={() => alternar(f.inicio)}
                            className="rounded-lg bg-[var(--p-azul-suave)] px-2.5 py-1.5 text-[0.75rem] font-semibold text-[var(--p-azul)]"
                          >
                            {abierta ? PANEL.ocultarPedidos : PANEL.verPedidos(pedidos.length)}
                          </button>
                        ) : null}
                        {est !== 'pasado' ? (
                          <button
                            type="button"
                            onClick={() => set((x) => alternarBloqueo(x, f.inicio))}
                            className="rounded-lg bg-[var(--p-linea)] px-2.5 py-1.5 text-[0.75rem] font-semibold"
                          >
                            {f.bloqueado ? PANEL.habilitar : PANEL.pausar}
                          </button>
                        ) : null}
                      </div>
                      {abierta ? (
                        <ul className="mt-3 space-y-2 border-t border-[var(--p-linea)] pt-3">
                          {[...pedidos].reverse().map((p) => (
                            <FilaPedido
                              key={p.id}
                              p={p}
                              nuevo={p.id === nuevo?.id}
                              onComanda={() => {
                                setComanda(p);
                                set(marcarComandaVista);
                                onComanda();
                              }}
                              onConfirmar={() => {
                                set((x) => confirmarPedido(x, p.id));
                                onConfirmar();
                              }}
                            />
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <Productos e={e} set={set} />
          )}
        </div>
      </div>
      {comanda ? <Comanda p={comanda} onCerrar={() => setComanda(undefined)} /> : null}
    </div>
  );
}

function FilaPedido({
  p,
  nuevo,
  onComanda,
  onConfirmar,
}: {
  p: Pedido;
  nuevo: boolean;
  onComanda: () => void;
  onConfirmar: () => void;
}) {
  return (
    <li
      className={cn(
        'm-aparece rounded-xl bg-[var(--p-card)] p-3 ring-1 ring-[var(--p-linea)]',
        nuevo && 'ring-2 ring-[var(--p-azul)]',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.8125rem] font-semibold">
          <span className="text-[var(--p-txt-2)] tabular-nums">{PANEL.numero(p.id)}</span>{' '}
          {p.nombre}
          {nuevo ? (
            <span className="ml-1.5 rounded bg-[var(--p-azul)] px-1.5 py-0.5 text-[0.625rem] font-bold text-white uppercase">
              {PANEL.nuevo}
            </span>
          ) : null}
        </p>
        <p className="text-[0.8125rem] font-semibold tabular-nums">{pesos(p.total)}</p>
      </div>
      <p className="mt-1 text-[0.75rem] text-[var(--p-txt-2)]">{p.lineas.join(' · ')}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={cn(
            'rounded-md px-1.5 py-0.5 text-[0.6875rem] font-semibold',
            p.estado === 'confirmado' ? 'bg-[var(--p-verde-suave)]' : 'bg-[var(--p-ambar-suave)]',
          )}
        >
          {PANEL.estadoPedido[p.estado]}
        </span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={onComanda}
          className="rounded-lg px-2 py-1 text-[0.75rem] font-semibold text-[var(--p-azul)]"
        >
          {PANEL.verComanda}
        </button>
        {p.estado === 'pendiente' ? (
          <button
            type="button"
            onClick={onConfirmar}
            className="rounded-lg bg-[var(--p-azul)] px-2.5 py-1 text-[0.75rem] font-semibold text-white"
          >
            {PANEL.confirmar}
          </button>
        ) : null}
      </div>
    </li>
  );
}

function Productos({ e, set }: { e: EstadoDemo; set: StoreDemo['set'] }) {
  return (
    <>
      <p className="rounded-xl bg-[var(--p-azul-suave)] px-3 py-2.5 text-[0.75rem]">
        {PANEL.avisoProductos}
      </p>
      {SECCIONES.map((s) => (
        <section key={s.id} className="mt-4">
          <h3 className="px-1 text-[0.75rem] font-semibold text-[var(--p-txt-2)] uppercase">
            {s.nombre}
          </h3>
          <ul className="mt-1.5 divide-y divide-[var(--p-linea)] overflow-hidden rounded-2xl bg-[var(--p-card)]">
            {PRODUCTOS.filter((p) => p.seccion === s.id).map((p) => {
              const est = e.productos[p.id]!;
              return (
                <li
                  key={p.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2',
                    !est.activo && 'text-[var(--p-txt-2)]',
                  )}
                >
                  <Dibujo producto={p} className="size-9 shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium">
                    {p.nombre}
                  </span>
                  <button
                    type="button"
                    aria-pressed={est.destacado}
                    aria-label={PANEL.destacado(p.nombre)}
                    onClick={() => set((x) => alternarProducto(x, p.id, 'destacado'))}
                    className="grid size-8 place-items-center rounded-full text-[var(--p-txt-2)] aria-pressed:text-[var(--p-ambar)]"
                  >
                    <Estrella llena={est.destacado} />
                  </button>
                  <Interruptor
                    activo={est.activo}
                    etiqueta={PANEL.visible(p.nombre)}
                    onClick={() => set((x) => alternarProducto(x, p.id, 'activo'))}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

function Comanda({ p, onCerrar }: { p: Pedido; onCerrar: () => void }) {
  const cerrar = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cerrar.current?.focus();
    const tecla = (ev: KeyboardEvent) => ev.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onCerrar]);
  const imprimir = () => {
    const html = document.documentElement;
    const fin = () => {
      html.classList.remove('m-imprimiendo');
      window.removeEventListener('afterprint', fin);
    };
    html.classList.add('m-imprimiendo');
    window.addEventListener('afterprint', fin);
    window.print();
  };
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={COMANDA.aria}
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--p-txt)]/50 p-4"
      onClick={(ev) => ev.target === ev.currentTarget && onCerrar()}
    >
      <div className="m-aparece w-full max-w-[20rem] rounded-[22px] bg-[var(--p-card)] p-4">
        <div className="m-ticket rounded-lg border border-dashed border-[var(--p-linea)] p-4">
          <p className="text-center font-bold">{COMANDA.marca}</p>
          <p className="mt-1 text-center">{COMANDA.titulo(p.id)}</p>
          <p className="text-center">{PANEL.hoy(NOCHE_DEMO.dia, minAHhmm(p.creado))}</p>
          <hr className="my-2 border-dashed" />
          <p>
            {COMANDA.cliente}: {p.nombre}
          </p>
          <p className="my-2 border-2 border-current py-1 text-center text-[14px] font-bold">
            {COMANDA.retira}: {minAHhmm(p.retiro)}
          </p>
          {p.lineas.map((l) => (
            <p key={l}>{l}</p>
          ))}
          <hr className="my-2 border-dashed" />
          <p className="flex justify-between font-bold">
            <span>{COMANDA.total}</span>
            <span>{pesos(p.total)}</span>
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            ref={cerrar}
            type="button"
            onClick={onCerrar}
            className="rounded-xl bg-[var(--p-linea)] py-2.5 text-[0.8125rem] font-semibold"
          >
            {COMANDA.cerrar}
          </button>
          <button
            type="button"
            onClick={imprimir}
            className="rounded-xl bg-[var(--p-azul)] py-2.5 text-[0.8125rem] font-semibold text-white"
          >
            {COMANDA.imprimir}
          </button>
        </div>
      </div>
    </div>
  );
}

function Interruptor({
  activo,
  etiqueta,
  onClick,
}: {
  activo: boolean;
  etiqueta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      onClick={onClick}
      className={cn(
        'relative h-[1.75rem] w-[2.875rem] shrink-0 rounded-full transition-colors duration-200',
        activo ? 'bg-[var(--p-verde)]' : 'bg-[var(--p-linea)]',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-0.5 left-0.5 size-6 rounded-full bg-[var(--p-card)] ring-1 ring-[var(--p-linea)] transition-transform duration-200',
          activo && 'translate-x-[1.125rem]',
        )}
      />
    </button>
  );
}

function BotonRedondo({
  etiqueta,
  onClick,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-full bg-[var(--p-linea)]"
    >
      {children}
    </button>
  );
}

function Linea({ mas }: { mas?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d={mas ? 'M3 8h10M8 3v10' : 'M3 8h10'} strokeLinecap="round" />
    </svg>
  );
}

function Estrella({ llena }: { llena: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill={llena ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path
        d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
