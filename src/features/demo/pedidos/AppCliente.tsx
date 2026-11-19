'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/components/ui/clases';
import { Tilde, WhatsApp } from '@/components/marketing/editorial/Iconos';
import {
  ES_MITAD,
  NOCHE_DEMO,
  PRODUCTOS,
  SECCIONES,
  TAMANIOS,
  type Producto,
  type SeccionId,
  type Tamanio,
} from '@/content/demos/pedidos/carta';
import { APP, CARRITO, ENVIADO, mensajeWhatsapp, pesos } from '@/content/demos/pedidos/ui';
import { franjasElegibles, minAHhmm } from '@/domain/retiro/franjas';
import { Dibujo } from './Dibujo';
import {
  agregar,
  cambiarCantidad,
  cantidadCarrito,
  confirmarPedido,
  cotizar,
  crearPedido,
  destacados,
  franjasConConteo,
  getProducto,
  nombreItem,
  precioItem,
  productosVisibles,
  totalItems,
  type EstadoDemo,
  type ModoRetiro,
  type Pedido,
  type StoreDemo,
} from './store';

type Pantalla =
  | { tipo: 'inicio' }
  | { tipo: 'seccion'; id: SeccionId }
  | { tipo: 'producto'; id: string }
  | { tipo: 'carrito' };

interface Props {
  e: EstadoDemo;
  ahora: number;
  set: StoreDemo['set'];
  onPedido: (p: Pedido) => void;
  onEnviado: (p: Pedido) => void;
  onVerPanel: () => void;
  /** Deja lugar abajo para los controles flotantes de la demo (celular). */
  margenInferior?: boolean;
  ctaHref: string;
  onCta: () => void;
}

const desdePrecio = (p: Producto) => Math.min(...Object.values(p.precios));

/** La app del cliente: inicio, carta por sección, producto, carrito y confirmación. */
export function AppCliente(props: Props) {
  const { e, set, margenInferior } = props;
  const [pantalla, setPantalla] = useState<Pantalla>({ tipo: 'inicio' });
  /** El aviso de agregado vive en la pantalla donde se agregó: al cambiar de pantalla no se muestra. */
  const [aviso, setAviso] = useState<Pantalla | false>(false);
  const [confirmacion, setConfirmacion] = useState<{ p: Pedido; enviado: boolean }>();
  const scroller = useRef<HTMLDivElement>(null);
  const n = cantidadCarrito(e);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [pantalla]);
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(false), 1800);
    return () => clearTimeout(t);
  }, [aviso]);

  const ir = (p: Pantalla) => setPantalla(p);
  const volver = () =>
    setPantalla((p) => {
      if (p.tipo === 'producto') {
        const prod = getProducto(p.id);
        return prod ? { tipo: 'seccion', id: prod.seccion } : { tipo: 'inicio' };
      }
      return { tipo: 'inicio' };
    });

  return (
    <div className="m-app relative h-full overflow-hidden">
      <div
        ref={scroller}
        className="d-sin-barra absolute inset-0 overflow-y-auto overscroll-contain"
      >
        <Encabezado
          atras={pantalla.tipo !== 'inicio' ? volver : undefined}
          onInicio={() => ir({ tipo: 'inicio' })}
          onCarrito={() => ir({ tipo: 'carrito' })}
          cantidad={n}
        />
        {pantalla.tipo === 'inicio' && <Inicio e={e} ahora={props.ahora} ir={ir} />}
        {pantalla.tipo === 'seccion' && <Seccion e={e} id={pantalla.id} ir={ir} />}
        {pantalla.tipo === 'producto' && (
          <Detalle
            e={e}
            id={pantalla.id}
            onAgregar={(t, mitad) => {
              set((x) => agregar(x, pantalla.id, t, mitad));
              setAviso(pantalla);
            }}
          />
        )}
        {pantalla.tipo === 'carrito' && (
          <Carrito
            {...props}
            irCarta={() => ir({ tipo: 'inicio' })}
            onConfirmado={(p) => setConfirmacion({ p, enviado: false })}
          />
        )}
        <div className={margenInferior ? 'h-36' : 'h-24'} />
      </div>

      {n > 0 && pantalla.tipo !== 'carrito' && pantalla.tipo !== 'producto' ? (
        <button
          type="button"
          onClick={() => ir({ tipo: 'carrito' })}
          className={cn(
            'm-tocar m-aparece absolute inset-x-4 z-10 rounded-full bg-[var(--m-acento)] px-5 py-3.5 text-[0.875rem] font-bold text-[var(--m-sobre-acento)]',
            margenInferior ? 'bottom-24' : 'bottom-5',
          )}
        >
          {APP.verPedido(n, pesos(totalItems(e.carrito)))}
        </button>
      ) : null}

      {confirmacion ? (
        <Confirmacion
          {...props}
          c={confirmacion}
          onEnviar={() => {
            set((x) => confirmarPedido(x, confirmacion.p.id));
            setConfirmacion({ ...confirmacion, enviado: true });
            props.onEnviado(confirmacion.p);
          }}
          onSeguir={() => {
            setConfirmacion(undefined);
            ir({ tipo: 'inicio' });
          }}
        />
      ) : null}

      {aviso && aviso === pantalla ? (
        <p
          role="status"
          className="m-aparece absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[var(--m-acento)] px-4 py-2 text-[0.8125rem] font-bold whitespace-nowrap text-[var(--m-sobre-acento)]"
        >
          {APP.agregado}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------- Partes ---------------- */

function Bolsa() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" strokeLinejoin="round" />
    </svg>
  );
}

function Atras() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Signo({ mas }: { mas?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d={mas ? 'M3 8h10M8 3v10' : 'M3 8h10'} strokeLinecap="round" />
    </svg>
  );
}

function Encabezado({
  atras,
  onInicio,
  onCarrito,
  cantidad,
}: {
  atras?: () => void;
  onInicio: () => void;
  onCarrito: () => void;
  cantidad: number;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-[var(--m-oscuro)] px-4 py-2.5">
      {atras ? (
        <button
          type="button"
          onClick={atras}
          aria-label={APP.volver}
          className="grid size-10 place-items-center rounded-full bg-[var(--m-blanco-8)]"
        >
          <Atras />
        </button>
      ) : (
        <span className="size-10" />
      )}
      <button
        type="button"
        onClick={onInicio}
        aria-label={APP.inicioAria}
        className="m-titulo text-[1.375rem]"
      >
        {APP.marca}
      </button>
      <button
        type="button"
        onClick={onCarrito}
        aria-label={APP.carritoAria(cantidad)}
        className="relative grid size-10 place-items-center rounded-full bg-[var(--m-blanco-8)]"
      >
        <Bolsa />
        {cantidad > 0 ? (
          <span
            key={cantidad}
            className="m-pop absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-[var(--m-acento)] text-[0.6875rem] font-bold text-[var(--m-sobre-acento)]"
          >
            {cantidad}
          </span>
        ) : null}
      </button>
    </div>
  );
}

function Rotulo({ children }: { children: ReactNode }) {
  return (
    <h2 className="px-5 text-[0.6875rem] font-semibold tracking-[0.12em] text-[var(--m-blanco-60)] uppercase">
      {children}
    </h2>
  );
}

function Inicio({ e, ahora, ir }: { e: EstadoDemo; ahora: number; ir: (p: Pantalla) => void }) {
  const muzza = PRODUCTOS[0]!;
  return (
    <div className="m-aparece">
      <section className="px-4 pt-2 pb-7">
        <div className="relative flex min-h-[15rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-[var(--m-blanco-8)] p-5">
          <Dibujo producto={muzza} className="absolute -top-10 -right-12 size-52 opacity-90" />
          <span className="relative w-fit rounded-full bg-[var(--m-acento)] px-3 py-1 text-[0.6875rem] font-bold tracking-wide text-[var(--m-sobre-acento)] uppercase">
            {APP.takeAway}
          </span>
          <h2 className="m-titulo relative mt-3 text-[1.875rem]">
            {APP.titulo[0]}
            <br />
            {APP.titulo[1]}
          </h2>
          <EstadoLocal e={e} ahora={ahora} />
        </div>
      </section>
      <Rotulo>{APP.elegi}</Rotulo>
      <ul className="d-sin-barra mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
        {SECCIONES.map((s) => {
          const primero = PRODUCTOS.find((p) => p.seccion === s.id)!;
          return (
            <li key={s.id} className="w-[72%] shrink-0 snap-start">
              <button
                type="button"
                onClick={() => ir({ tipo: 'seccion', id: s.id })}
                className="m-tocar relative flex h-32 w-full flex-col justify-end overflow-hidden rounded-2xl bg-[var(--m-blanco-8)] p-4 text-left"
              >
                <Dibujo producto={primero} className="absolute -top-4 -right-4 size-28" />
                <span className="relative text-[1.0625rem] font-bold">{s.nombre}</span>
                <span className="relative text-[0.75rem] text-[var(--m-blanco-60)]">
                  {APP.verMenu}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-7">
        <Rotulo>{APP.destacadas}</Rotulo>
        <ul className="mt-3 space-y-2.5 px-4">
          {destacados(e).map((p) => (
            <li key={p.id} className="m-aparece">
              <button
                type="button"
                onClick={() => ir({ tipo: 'producto', id: p.id })}
                className="m-tocar flex w-full items-center gap-3 rounded-2xl bg-[var(--m-blanco-8)] p-3 text-left"
              >
                <Dibujo producto={p} className="size-14 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9375rem] font-semibold">{p.nombre}</span>
                  <span className="block text-[0.75rem] text-[var(--m-blanco-60)]">
                    {APP.desde(pesos(desdePrecio(p)))}
                  </span>
                </span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--m-acento)] text-[var(--m-sobre-acento)]">
                  <Signo mas />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 px-5 text-[0.6875rem] text-[var(--m-blanco-60)]">{APP.avisoEjemplo}</p>
    </div>
  );
}

function EstadoLocal({ e, ahora }: { e: EstadoDemo; ahora: number }) {
  const c = cotizar(e, ahora, { modo: 'asap' });
  const texto = !e.abierto ? APP.cerrado : c ? APP.abierto(minAHhmm(c.franja.inicio)) : APP.sinCupo;
  return (
    <p className="relative mt-3 flex items-center gap-2 text-[0.75rem] text-[var(--m-blanco-60)]">
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          e.abierto ? 'bg-[var(--m-acento)]' : 'bg-[var(--m-salsa)]',
        )}
      />
      {texto}
    </p>
  );
}

function Panelcrema({ children }: { children: ReactNode }) {
  return (
    <div className="m-aparece min-h-[70%] rounded-t-[28px] bg-[var(--m-crema)] px-4 pt-5 pb-6 text-[var(--m-oscuro)]">
      {children}
    </div>
  );
}

function Seccion({ e, id, ir }: { e: EstadoDemo; id: SeccionId; ir: (p: Pantalla) => void }) {
  const lista = productosVisibles(e, id);
  const nombre = SECCIONES.find((s) => s.id === id)?.nombre ?? '';
  return (
    <>
      <div className="px-5 pt-3 pb-5">
        <h2 className="m-titulo text-[2.25rem]">{nombre}</h2>
        <p className="text-[0.75rem] text-[var(--m-blanco-60)]">
          {APP.cantidadProductos(lista.length)}
        </p>
        <div className="d-sin-barra mt-4 flex gap-2 overflow-x-auto">
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={s.id === id}
              onClick={() => ir({ tipo: 'seccion', id: s.id })}
              className="shrink-0 rounded-full bg-[var(--m-blanco-8)] px-4 py-2 text-[0.8125rem] font-semibold aria-pressed:bg-[var(--m-acento)] aria-pressed:text-[var(--m-sobre-acento)]"
            >
              {s.nombre}
            </button>
          ))}
        </div>
      </div>
      <Panelcrema>
        <ul className="space-y-2.5">
          {lista.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => ir({ tipo: 'producto', id: p.id })}
                className="m-tocar flex w-full items-center gap-3 rounded-2xl bg-[var(--m-crema-3)] p-3 text-left ring-1 ring-[var(--m-linea)]"
              >
                <Dibujo producto={p} className="size-16 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-bold">{p.nombre}</span>
                  <span className="mt-0.5 block text-[0.75rem] text-[var(--m-gris)]">
                    {(Object.entries(p.precios) as [Tamanio, number][])
                      .filter(([t]) => !ES_MITAD[t])
                      .map(([t, precio]) => `${TAMANIOS[t]} ${pesos(precio)}`)
                      .join(' · ')}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-[var(--m-oscuro)] px-3.5 py-2 text-[0.75rem] font-bold text-[var(--m-acento-claro)]">
                  {APP.agregar}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Panelcrema>
    </>
  );
}

function Detalle({
  e,
  id,
  onAgregar,
}: {
  e: EstadoDemo;
  id: string;
  onAgregar: (t: Tamanio, mitad?: string) => void;
}) {
  const p = getProducto(id)!;
  const tamanios = Object.keys(p.precios) as Tamanio[];
  const [t, setT] = useState<Tamanio>(tamanios[0]!);
  const [mitad, setMitad] = useState<string>();
  const otras = ES_MITAD[t]
    ? productosVisibles(e, p.seccion).filter((o) => o.id !== p.id && o.precios[t] != null)
    : [];
  const falta = ES_MITAD[t] && !mitad;
  const seccion = SECCIONES.find((s) => s.id === p.seccion)?.nombre;
  return (
    <>
      <div className="grid place-items-center px-5 pt-2 pb-6">
        <Dibujo producto={p} className="size-48" />
      </div>
      <Panelcrema>
        <p className="text-[0.6875rem] font-semibold tracking-[0.12em] text-[var(--m-gris)] uppercase">
          {seccion}
        </p>
        <h2 className="m-titulo mt-1 text-[1.75rem]">{p.nombre}</h2>
        <p className="mt-5 text-[0.8125rem] font-bold">{APP.tamanio}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {tamanios.map((x) => (
            <button
              key={x}
              type="button"
              aria-pressed={x === t}
              onClick={() => {
                setT(x);
                setMitad(undefined);
              }}
              className="m-tocar rounded-xl bg-[var(--m-crema-3)] px-3 py-2.5 text-left ring-1 ring-[var(--m-linea)] aria-pressed:bg-[var(--m-oscuro)] aria-pressed:text-white"
            >
              <span className="block text-[0.8125rem] font-bold">{TAMANIOS[x]}</span>
              <span className="block text-[0.75rem] opacity-70">{pesos(p.precios[x]!)}</span>
            </button>
          ))}
        </div>
        {ES_MITAD[t] ? (
          <>
            <p className="mt-5 text-[0.8125rem] font-bold">{APP.otraMitad}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {otras.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={o.id === mitad}
                  onClick={() => setMitad(o.id)}
                  className="rounded-full bg-[var(--m-crema-3)] px-3 py-1.5 text-[0.75rem] font-semibold ring-1 ring-[var(--m-linea)] aria-pressed:bg-[var(--m-oscuro)] aria-pressed:text-white"
                >
                  {o.nombre}
                </button>
              ))}
            </div>
          </>
        ) : null}
        <button
          type="button"
          disabled={falta}
          onClick={() => {
            onAgregar(t, mitad);
            setMitad(undefined);
          }}
          className="m-tocar sticky bottom-4 mt-6 w-full rounded-full bg-[var(--m-oscuro)] px-5 py-3.5 text-[0.875rem] font-bold text-[var(--m-acento-claro)] disabled:opacity-40"
        >
          {falta ? APP.otraMitad : APP.agregarPrecio(pesos(p.precios[t]!))}
        </button>
      </Panelcrema>
    </>
  );
}

function Carrito({
  e,
  ahora,
  set,
  onPedido,
  irCarta,
  onConfirmado,
}: Props & { irCarta: () => void; onConfirmado: (p: Pedido) => void }) {
  const ids = useId();
  const [modo, setModo] = useState<'asap' | 'franja'>('asap');
  const [elegida, setElegida] = useState<number>();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [error, setError] = useState(false);

  const elegibles = franjasElegibles(franjasConConteo(e), ahora);
  const modoRetiro: ModoRetiro =
    modo === 'franja' && elegida != null ? { modo: 'franja', inicio: elegida } : { modo: 'asap' };
  const cot = modo === 'franja' && elegida == null ? null : cotizar(e, ahora, modoRetiro);
  const sinCupo = e.abierto && !cotizar(e, ahora, { modo: 'asap' });
  const puede =
    e.abierto && !sinCupo && e.carrito.length > 0 && (modo === 'asap' || elegida != null);

  const confirmar = () => {
    if (!nombre.trim() || !apellido.trim()) return setError(true);
    const r = crearPedido(e, ahora, {
      nombre: `${nombre.trim()} ${apellido.trim()}`,
      modo: modoRetiro,
    });
    if (!r) return;
    set(() => r.estado);
    onConfirmado(r.pedido);
    onPedido(r.pedido);
  };

  return (
    <>
      <div className="px-5 pt-3 pb-5">
        <h2 className="m-titulo text-[2.25rem]">{CARRITO.titulo}</h2>
      </div>
      <Panelcrema>
        {e.carrito.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[0.875rem] text-[var(--m-gris)]">{CARRITO.vacio}</p>
            <button
              type="button"
              onClick={irCarta}
              className="mt-4 rounded-full bg-[var(--m-oscuro)] px-5 py-3 text-[0.8125rem] font-bold text-[var(--m-acento-claro)]"
            >
              {CARRITO.verCarta}
            </button>
          </div>
        ) : (
          <>
            <ul className="space-y-2">
              {e.carrito.map((it) => (
                <li
                  key={it.clave}
                  className="m-aparece flex items-center gap-3 rounded-2xl bg-[var(--m-crema-3)] p-3 ring-1 ring-[var(--m-linea)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.875rem] font-bold">{nombreItem(it)}</span>
                    <span className="block text-[0.75rem] text-[var(--m-gris)]">
                      {TAMANIOS[it.tamanio]} · {pesos(precioItem(it))}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => set((x) => cambiarCantidad(x, it.clave, -1))}
                      aria-label={CARRITO.quitar(nombreItem(it))}
                      className="grid size-8 place-items-center rounded-full bg-[var(--m-crema-2)]"
                    >
                      <Signo />
                    </button>
                    <span className="w-4 text-center text-[0.875rem] font-bold tabular-nums">
                      {it.cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => set((x) => cambiarCantidad(x, it.clave, 1))}
                      aria-label={CARRITO.sumar(nombreItem(it))}
                      className="grid size-8 place-items-center rounded-full bg-[var(--m-crema-2)]"
                    >
                      <Signo mas />
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <section className="mt-4 rounded-3xl bg-[var(--m-crema-2)] p-4">
              <h2 className="text-[0.875rem] font-bold">{CARRITO.retiro}</h2>
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-[var(--m-crema-3)] p-1">
                {(['asap', 'franja'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={modo === m}
                    onClick={() => setModo(m)}
                    className="rounded-lg px-2 py-2 text-[0.75rem] font-semibold text-[var(--m-gris)] aria-pressed:bg-[var(--m-oscuro)] aria-pressed:text-white"
                  >
                    {m === 'asap' ? CARRITO.asap : CARRITO.elegir}
                  </button>
                ))}
              </div>
              {modo === 'franja' ? (
                <>
                  <p className="mt-3 text-[0.75rem] text-[var(--m-gris)]">{CARRITO.elegiFranja}</p>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {elegibles.map((f) => (
                      <button
                        key={f.inicio}
                        type="button"
                        aria-pressed={elegida === f.inicio}
                        onClick={() => setElegida(f.inicio)}
                        className="rounded-xl bg-[var(--m-crema-3)] py-2 text-[0.75rem] font-semibold tabular-nums ring-1 ring-[var(--m-linea)] aria-pressed:bg-[var(--m-oscuro)] aria-pressed:text-white"
                      >
                        {CARRITO.franjaHora(minAHhmm(f.inicio))}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
              {cot ? (
                <p className="mt-3 flex gap-2 rounded-xl bg-[var(--m-acento-suave)] p-3 text-[0.75rem] font-medium text-[var(--m-acento-texto)]">
                  {CARRITO.demora(cot.retiro.minutosEspera, minAHhmm(cot.retiro.hora))}
                </p>
              ) : null}
              {modo === 'asap' && cot?.huboSalto ? (
                <p className="mt-2 text-[0.6875rem] text-[var(--m-gris)]">{CARRITO.salto}</p>
              ) : null}
            </section>

            <section className="mt-4">
              <h2 className="text-[0.875rem] font-bold">{CARRITO.datos}</h2>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  {
                    id: `${ids}-n`,
                    label: CARRITO.nombre,
                    v: nombre,
                    setV: setNombre,
                    ac: 'given-name',
                  },
                  {
                    id: `${ids}-a`,
                    label: CARRITO.apellido,
                    v: apellido,
                    setV: setApellido,
                    ac: 'family-name',
                  },
                ].map((c) => (
                  <label key={c.id} htmlFor={c.id} className="block">
                    <span className="text-[0.6875rem] font-semibold text-[var(--m-gris)]">
                      {c.label}
                    </span>
                    <input
                      id={c.id}
                      value={c.v}
                      maxLength={40}
                      autoComplete={c.ac}
                      onChange={(ev) => {
                        c.setV(ev.target.value);
                        setError(false);
                      }}
                      className="mt-1 w-full rounded-xl bg-white px-3 py-2.5 text-[1rem] ring-1 ring-[var(--m-linea)] outline-none focus:ring-2 focus:ring-[var(--m-oscuro)]"
                    />
                  </label>
                ))}
              </div>
              {error ? (
                <p role="alert" className="mt-2 text-[0.75rem] font-semibold text-[var(--m-salsa)]">
                  {CARRITO.falta}
                </p>
              ) : null}
            </section>

            <div className="sticky bottom-3 mt-5 rounded-3xl bg-[var(--m-crema)] pt-2">
              <p className="flex items-baseline justify-between px-1 text-[0.875rem]">
                <span className="font-semibold">{CARRITO.total}</span>
                <span className="text-[1.125rem] font-bold tabular-nums">
                  {pesos(totalItems(e.carrito))}
                </span>
              </p>
              <button
                type="button"
                disabled={!puede}
                onClick={confirmar}
                className="m-tocar mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--m-oscuro)] px-5 py-3.5 text-[0.875rem] font-bold text-white disabled:opacity-40"
              >
                <WhatsApp className="size-4" />
                {!e.abierto ? CARRITO.localCerrado : sinCupo ? APP.sinCupo : CARRITO.confirmar}
              </button>
            </div>
          </>
        )}
      </Panelcrema>
    </>
  );
}

function Confirmacion({
  c,
  onEnviar,
  onSeguir,
  onVerPanel,
  ctaHref,
  onCta,
}: Props & { c: { p: Pedido; enviado: boolean }; onEnviar: () => void; onSeguir: () => void }) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-end bg-[var(--m-oscuro)]/60"
      role="dialog"
      aria-modal="true"
      aria-label={c.enviado ? ENVIADO.listo : ENVIADO.titulo}
    >
      <div className="m-aparece max-h-[92%] w-full overflow-y-auto rounded-t-[28px] bg-[var(--m-crema)] p-5 text-[var(--m-oscuro)]">
        {!c.enviado ? (
          <>
            <h2 className="m-titulo text-[1.5rem]">{ENVIADO.titulo}</h2>
            <p className="mt-1 text-[0.75rem] text-[var(--m-gris)]">{ENVIADO.texto}</p>
            <p className="mt-4 rounded-2xl rounded-tl-sm bg-white p-3.5 text-[0.8125rem] whitespace-pre-line ring-1 ring-[var(--m-linea)]">
              {mensajeWhatsapp({
                nombre: c.p.nombre,
                lineas: c.p.lineas,
                total: pesos(c.p.total),
                retiro: `${NOCHE_DEMO.dia} ${minAHhmm(c.p.retiro)} hs`,
              })}
            </p>
            <button
              type="button"
              onClick={onEnviar}
              className="m-tocar mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--m-acento)] px-5 py-3.5 text-[0.875rem] font-bold text-[var(--m-sobre-acento)]"
            >
              <WhatsApp className="size-4" />
              {ENVIADO.enviar}
            </button>
          </>
        ) : (
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--m-acento)] text-[var(--m-sobre-acento)]">
              <Tilde className="size-6" />
            </span>
            <h2 className="m-titulo mt-3 text-[1.5rem]">{ENVIADO.listo}</h2>
            <p className="mt-1 text-[0.8125rem] text-[var(--m-gris)]">{ENVIADO.listoTexto}</p>
            <button
              type="button"
              onClick={onVerPanel}
              className="m-tocar mt-4 w-full rounded-full bg-[var(--m-oscuro)] px-5 py-3.5 text-[0.875rem] font-bold text-[var(--m-acento-claro)]"
            >
              {ENVIADO.verPanel}
            </button>
            <button
              type="button"
              onClick={onSeguir}
              className="mt-2 w-full rounded-full px-5 py-3 text-[0.8125rem] font-semibold"
            >
              {ENVIADO.seguir}
            </button>
            <a
              href={ctaHref}
              onClick={onCta}
              className="mt-1 inline-block text-[0.8125rem] font-semibold underline underline-offset-4"
            >
              {ENVIADO.cta}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
