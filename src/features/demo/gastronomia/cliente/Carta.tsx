'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { Ilustracion } from '@/brand/ilustracion/dibujos/Ilustracion';
import type { CocinaDemo } from '@/content/demos/gastronomia';
import { esIlustracion } from '@/brand/ilustracion/dibujos/ids';
import { formatearPesos } from '@/domain/pedidos/dinero';
import type { Producto } from '@/domain/pedidos/types';

interface CartaProps {
  cocina: CocinaDemo;
  nombreLocal: string;
  /** Contenedor que scrollea la carta (el celular en escritorio). En celular es la página. */
  scroller: RefObject<HTMLElement | null>;
  onAbrirPlato: (producto: Producto) => void;
}

const pieza = (i: number) => ({ '--i': i }) as CSSProperties;

/** Para buscar sin importar tildes ni mayúsculas ("fugazzeta" = "Fugazzetá"). */
const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

/**
 * La carta que ve quien escanea el QR. Encabezado que "se arma" una vez (como el hero), buscador,
 * categorías fijas arriba que siguen el scroll, y los platos con su ilustración y precio.
 */
export function Carta({ cocina, nombreLocal, scroller, onAbrirPlato }: CartaProps) {
  const [busqueda, setBusqueda] = useState('');
  const [activa, setActiva] = useState(cocina.menu.categorias[0]?.id ?? '');
  const secciones = useRef<Record<string, HTMLElement | null>>({});

  const visibles = useMemo(() => {
    const q = normalizar(busqueda.trim());
    if (!q) return cocina.menu.productos;
    return cocina.menu.productos.filter((p) =>
      normalizar(`${p.nombre} ${p.descripcion}`).includes(q),
    );
  }, [busqueda, cocina]);

  const categorias = cocina.menu.categorias.filter((c) =>
    visibles.some((p) => p.categoriaId === c.id),
  );

  // La categoría activa sigue al scroll: la última sección que pasó por debajo de la barra.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const raiz = scroller.current;
    const root = raiz && getComputedStyle(raiz).overflowY === 'auto' ? raiz : null;
    const io = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.find((e) => e.isIntersecting);
        if (visible) setActiva(visible.target.id.replace('categoria-', ''));
      },
      { root, rootMargin: '-96px 0px -60% 0px' },
    );
    for (const el of Object.values(secciones.current)) if (el) io.observe(el);
    return () => io.disconnect();
  }, [scroller, categorias.length, cocina.id]);

  const irA = (id: string) => {
    setActiva(id);
    secciones.current[id]?.scrollIntoView({ block: 'start' });
  };

  return (
    <div>
      <header className="px-4 pt-6 pb-4">
        <p
          className="hero-piece flex items-center gap-2 text-small text-paper-muted"
          style={pieza(0)}
        >
          <Icon name="carta_qr" size={18} />
          Escaneaste el QR de la mesa 4
        </p>
        <h2
          key={nombreLocal}
          className="hero-piece mt-2 text-title font-semibold text-balance"
          style={pieza(1)}
        >
          {nombreLocal}
        </h2>
        <label
          className="hero-piece mt-4 flex items-center gap-2 rounded-control border border-paper-line bg-paper-2 px-4"
          style={pieza(2)}
        >
          <Icon name="buscar" size={20} className="shrink-0 text-paper-muted" />
          <span className="sr-only">Buscar en la carta</span>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="¿Qué tenés ganas de comer?"
            className="min-h-tap w-full bg-transparent text-body text-paper-fg outline-none placeholder:text-paper-muted"
          />
        </label>
      </header>

      {categorias.length > 0 && (
        <nav
          aria-label="Categorías de la carta"
          // En celular queda debajo del aviso de demo (h-14); en escritorio, arriba del celular.
          className="sticky top-14 z-10 border-b border-paper-line bg-paper lg:top-0"
        >
          <ul className="flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-2">
            {categorias.map((c) => (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => irA(c.id)}
                  aria-current={activa === c.id ? 'true' : undefined}
                  className="min-h-tap rounded-full px-4 text-small font-semibold text-paper-muted aria-[current=true]:bg-paper-fg aria-[current=true]:text-paper"
                >
                  {c.nombre}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {categorias.length === 0 ? (
        <p role="status" className="px-4 py-12 text-center text-paper-muted">
          No encontramos “{busqueda}”. Probá con otra palabra.
        </p>
      ) : (
        <div className="flex flex-col gap-8 px-4 pt-6 pb-28">
          {categorias.map((c) => (
            <section
              key={c.id}
              id={`categoria-${c.id}`}
              ref={(el) => {
                secciones.current[c.id] = el;
              }}
              aria-labelledby={`titulo-${c.id}`}
              className="scroll-mt-32 lg:scroll-mt-16"
            >
              <h3 id={`titulo-${c.id}`} className="text-heading font-semibold">
                {c.nombre}
              </h3>
              <ul className="mt-2 flex flex-col">
                {visibles
                  .filter((p) => p.categoriaId === c.id)
                  .map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onAbrirPlato(p)}
                        className="flex w-full items-center gap-4 border-b border-paper-line py-4 text-left active:scale-[0.99]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold">{p.nombre}</span>
                          <span className="mt-1 block text-small text-paper-muted">
                            {p.descripcion}
                          </span>
                          <span className="tabular mt-2 block font-semibold text-accent-ink">
                            {formatearPesos(p.precio)}
                          </span>
                        </span>
                        <span className="relative flex size-20 shrink-0 items-center justify-center rounded-card bg-paper-2 text-paper-fg">
                          {esIlustracion(p.ilustracion) && (
                            <Ilustracion id={p.ilustracion} size={64} />
                          )}
                          <span
                            aria-hidden="true"
                            className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-accent text-accent-fg"
                          >
                            <Icon name="mas" size={18} />
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
          <p className="text-center text-small text-paper-muted">Carta y precios de ejemplo.</p>
        </div>
      )}
    </div>
  );
}
