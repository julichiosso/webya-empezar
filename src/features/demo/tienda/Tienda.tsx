'use client';

import { useState, type CSSProperties } from 'react';
import { DEMO_TIENDA_UI, type RubroTienda } from '@/content/demos/tienda/datos';
import { FotoProducto } from './Fotos';
import type { ProductoTienda } from './estado';

const T = DEMO_TIENDA_UI.tienda;
const PESOS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

type Pantalla = { tipo: 'inicio' } | { tipo: 'producto'; id: number } | { tipo: 'carrito' };

function Bolsa({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      className={className}
    >
      <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

/**
 * La tienda armada con los datos de la persona: inicio con categorías y productos, ficha de producto
 * y carrito. Responde al ancho (container queries): la misma tienda en el celular y en la compu. Lo
 * que en la tienda real sale a WhatsApp o a Mercado Pago acá muestra un aviso.
 */
export function Tienda({
  nombre,
  rubro,
  color,
  logo,
  productos,
}: {
  nombre: string;
  rubro: RubroTienda;
  color: string;
  logo?: string;
  productos: readonly ProductoTienda[];
}) {
  const [pantalla, setPantalla] = useState<Pantalla>({ tipo: 'inicio' });
  const [carrito, setCarrito] = useState<Record<number, number>>({});
  const [categoria, setCategoria] = useState<number | null>(null);
  const [aviso, setAviso] = useState(false);

  const titulo = nombre.trim() || T.sinNombre;
  const cantidad = Object.entries(carrito)
    .filter(([id]) => productos.some((p) => p.id === Number(id)))
    .reduce((t, [, n]) => t + n, 0);
  const agregar = (id: number) => setCarrito((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const visibles = productos.filter(
    (_, i) => categoria === null || i % rubro.categorias.length === categoria,
  );
  const enCarrito = productos.filter((p) => carrito[p.id]);
  const total = enCarrito.reduce((t, p) => t + p.precio * (carrito[p.id] ?? 0), 0);
  const producto =
    pantalla.tipo === 'producto' ? productos.find((p) => p.id === pantalla.id) : undefined;

  const botonMarca =
    'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--marca)] px-4 text-[0.9375rem] font-semibold text-white active:opacity-80';

  return (
    <div
      className="d-sin-barra @container relative h-full overflow-y-auto bg-white text-neutral-900"
      style={{ '--marca': color } as CSSProperties}
    >
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-200 bg-white px-4 @3xl:px-10">
        <button
          type="button"
          onClick={() => setPantalla({ tipo: 'inicio' })}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-[var(--marca)] text-[0.9375rem] font-bold text-white">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- logo local (blob:) de la persona
              <img src={logo} alt="" className="size-full object-cover" />
            ) : (
              titulo.charAt(0).toUpperCase()
            )}
          </span>
          <span className="truncate text-[0.9375rem] font-semibold">{titulo}</span>
        </button>
        <button
          type="button"
          onClick={() => setPantalla({ tipo: 'carrito' })}
          aria-label={T.carritoAria(cantidad)}
          className="relative grid size-10 place-items-center rounded-full active:opacity-70"
        >
          <Bolsa className="size-6" />
          {cantidad > 0 ? (
            <span className="absolute top-0.5 right-0.5 grid min-w-4 place-items-center rounded-full bg-[var(--marca)] px-1 text-[0.625rem] font-bold text-white tabular-nums">
              {cantidad}
            </span>
          ) : null}
        </button>
      </header>

      {pantalla.tipo === 'inicio' ? (
        <>
          <section className="bg-[var(--marca)] px-4 py-8 text-white @3xl:px-10 @3xl:py-14">
            <p className="text-[0.75rem] font-semibold tracking-wide uppercase opacity-80">
              {rubro.nombre}
            </p>
            <h2 className="mt-2 text-[1.875rem] leading-tight font-bold tracking-tight @3xl:text-[2.75rem]">
              {titulo}
            </h2>
            <p className="mt-1 text-[1rem] opacity-90">{rubro.lema}</p>
          </section>
          <p className="border-b border-neutral-200 px-4 py-2.5 text-[0.75rem] text-neutral-500 @3xl:px-10">
            {T.envios}
          </p>
          <div className="d-sin-barra flex gap-2 overflow-x-auto px-4 pt-4 @3xl:px-10">
            {[T.todos, ...rubro.categorias].map((c, i) => {
              const valor = i === 0 ? null : i - 1;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={categoria === valor}
                  onClick={() => setCategoria(valor)}
                  className="min-h-9 shrink-0 rounded-full border border-neutral-300 px-3.5 text-[0.8125rem] font-medium aria-pressed:border-[var(--marca)] aria-pressed:bg-[var(--marca)] aria-pressed:text-white"
                >
                  {c}
                </button>
              );
            })}
          </div>
          <section className="px-4 pt-4 pb-8 @3xl:px-10">
            <h3 className="text-[0.8125rem] font-semibold tracking-wide text-neutral-500 uppercase">
              {T.destacados}
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-5">
              {visibles.map((p) => (
                <li key={p.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setPantalla({ tipo: 'producto', id: p.id })}
                    aria-label={p.nombre || T.verProducto}
                    className="block aspect-square overflow-hidden rounded-xl border border-neutral-200"
                  >
                    <FotoProducto foto={p.foto} propia={p.propia} />
                  </button>
                  <p className="mt-2 line-clamp-2 text-[0.875rem] leading-snug font-medium">
                    {p.nombre || '—'}
                  </p>
                  <p className="text-[0.9375rem] font-bold tabular-nums">
                    {PESOS.format(p.precio)}
                  </p>
                  <button
                    type="button"
                    onClick={() => agregar(p.id)}
                    className="mt-2 min-h-9 rounded-lg border border-[var(--marca)] text-[0.8125rem] font-semibold text-[var(--marca)] active:opacity-70"
                  >
                    {T.agregar}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}

      {producto ? (
        <section className="px-4 py-4 @3xl:grid @3xl:grid-cols-2 @3xl:gap-10 @3xl:px-10 @3xl:py-10">
          <button
            type="button"
            onClick={() => setPantalla({ tipo: 'inicio' })}
            className="mb-3 text-[0.875rem] font-medium text-neutral-600 @3xl:col-span-2"
          >
            {`← ${T.volver}`}
          </button>
          <div className="aspect-square overflow-hidden rounded-2xl border border-neutral-200">
            <FotoProducto foto={producto.foto} propia={producto.propia} />
          </div>
          <div className="mt-4 @3xl:mt-0">
            <h2 className="text-[1.5rem] leading-tight font-bold tracking-tight">
              {producto.nombre}
            </h2>
            <p className="mt-1 text-[1.375rem] font-bold tabular-nums">
              {PESOS.format(producto.precio)}
            </p>
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  agregar(producto.id);
                  setPantalla({ tipo: 'carrito' });
                }}
                className={botonMarca}
              >
                {T.agregarCarrito}
              </button>
              <button
                type="button"
                onClick={() => setAviso(true)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-neutral-300 text-[0.9375rem] font-semibold active:opacity-70"
              >
                {T.consultar}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {pantalla.tipo === 'carrito' ? (
        <section className="px-4 py-4 @3xl:mx-auto @3xl:max-w-[36rem] @3xl:py-10">
          <button
            type="button"
            onClick={() => setPantalla({ tipo: 'inicio' })}
            className="mb-3 text-[0.875rem] font-medium text-neutral-600"
          >
            {`← ${T.volver}`}
          </button>
          <h2 className="text-[1.5rem] font-bold tracking-tight">{T.carrito}</h2>
          {enCarrito.length === 0 ? (
            <p className="mt-4 text-[0.9375rem] text-neutral-500">{T.vacio}</p>
          ) : (
            <>
              <ul className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
                {enCarrito.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-3">
                    <span className="size-12 shrink-0 overflow-hidden rounded-lg border border-neutral-200">
                      <FotoProducto foto={p.foto} propia={p.propia} />
                    </span>
                    <span className="min-w-0 flex-1 text-[0.875rem]">
                      <span className="block truncate font-medium">{p.nombre}</span>
                      <span className="text-neutral-500 tabular-nums">
                        {`${carrito[p.id]} × ${PESOS.format(p.precio)}`}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex justify-between text-[1.0625rem] font-bold">
                <span>{T.total}</span>
                <span className="tabular-nums">{PESOS.format(total)}</span>
              </p>
              <button type="button" onClick={() => setAviso(true)} className={`${botonMarca} mt-4`}>
                {T.enviar}
              </button>
            </>
          )}
        </section>
      ) : null}

      <footer className="border-t border-neutral-200 px-4 py-6 text-[0.75rem] text-neutral-500 @3xl:px-10">
        {T.pie(titulo)}
      </footer>

      {aviso ? (
        <div
          role="status"
          className="sticky bottom-3 z-20 mx-3 flex items-start gap-3 rounded-2xl bg-neutral-900 p-4 text-[0.875rem] text-white"
        >
          <p className="flex-1">{T.aviso}</p>
          <button
            type="button"
            onClick={() => setAviso(false)}
            className="shrink-0 rounded-full border border-white/30 px-3 py-1 font-semibold"
          >
            {T.cerrarAviso}
          </button>
        </div>
      ) : null}
    </div>
  );
}
