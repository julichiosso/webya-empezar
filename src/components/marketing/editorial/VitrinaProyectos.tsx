'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import type { ImagenProyecto, MockupId } from '@/content/proyectos';
import { PantallaProyecto } from './Pantallas';

export interface ItemVitrina {
  id: string;
  cliente: string;
  rubro: string;
  sistema: string;
  estado: string;
  ve: string;
  href: string;
  img?: ImagenProyecto;
  mockup: MockupId;
}

const CADA_MS = 6000;
/** Alto útil de la pantalla en anchos: lo que se baja para recorrer la captura entera. */
const PANTALLA = 1.9;

/**
 * Vitrina de proyectos: los nombres a un lado, en grande, y un solo escenario que muestra el activo. La
 * pantalla cambia con un fundido y un leve acercamiento, y la captura se recorre sola. Avanza sola
 * mientras está a la vista (el anillo marca el tiempo); al pasar el mouse o tocar un nombre, se queda en
 * ese. Con movimiento reducido no avanza.
 */
export function VitrinaProyectos({
  items,
  etiqueta,
  verProyecto,
}: {
  items: readonly ItemVitrina[];
  etiqueta: string;
  verProyecto: string;
}) {
  const [activo, setActivo] = useState(0);
  const [tocado, setTocado] = useState(false);
  const [aLaVista, setALaVista] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setALaVista(Boolean(e?.isIntersecting)), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const auto = aLaVista && !tocado;
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setActivo((a) => (a + 1) % items.length), CADA_MS);
    return () => clearInterval(t);
  }, [auto, items.length]);

  const elegir = (i: number) => {
    setActivo(i);
    setTocado(true);
  };
  const actual = items[activo]!;

  return (
    <div ref={caja} className="grid grid-cols-12 gap-y-8 lg:items-center lg:gap-x-10">
      <div className="col-span-12 min-w-0 lg:order-2 lg:col-span-7">
        <div className="e-escenario relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-ed-surface">
          {items.map((p, i) => {
            const bajar = p.img && Math.max(0, 1 - PANTALLA / (p.img.alto / p.img.ancho));
            return (
              <div
                key={p.id}
                data-activo={i === activo || undefined}
                aria-hidden={i !== activo}
                className="e-escena-vitrina absolute inset-0 flex items-end justify-center"
              >
                <div className="e-pantalla-vitrina relative h-[88%] w-[38%] overflow-hidden rounded-t-[1.75rem] bg-white sm:w-[34%]">
                  {p.img ? (
                    <Image
                      src={p.img.src}
                      alt={i === activo ? p.img.alt : ''}
                      width={p.img.ancho}
                      height={p.img.alto}
                      sizes="(min-width: 1024px) 18rem, 40vw"
                      className={
                        bajar
                          ? 'e-vidriera-recorre h-auto w-full'
                          : 'h-full w-full object-cover object-top'
                      }
                      style={
                        bajar ? ({ '--bajar': `${-bajar * 100}%` } as CSSProperties) : undefined
                      }
                    />
                  ) : (
                    <div className="tono-claro absolute inset-0 pt-4">
                      <PantallaProyecto mockup={p.mockup} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="absolute top-5 right-5 left-5 flex items-start justify-between gap-4 md:top-7 md:right-7 md:left-7">
            <p key={actual.id} className="e-aparece-vitrina e-chico max-w-[26ch] text-ed-muted">
              {actual.ve}
            </p>
            <Link href={actual.href} className="e-link e-chico shrink-0 font-medium text-ed-fg">
              {verProyecto}
            </Link>
          </div>
        </div>
      </div>
      <div className="col-span-12 min-w-0 lg:col-span-5">
        <ul aria-label={etiqueta} className="space-y-1 md:space-y-2">
          {items.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={i === activo}
                onClick={() => elegir(i)}
                onMouseEnter={() => elegir(i)}
                onFocus={() => elegir(i)}
                className={cn(
                  'e-nombre-vitrina group flex w-full items-center gap-4 py-2 text-left transition-colors duration-500',
                  i === activo ? 'text-ed-fg' : 'text-ed-muted/60 hover:text-ed-fg',
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.5rem] leading-tight font-semibold tracking-[-0.035em] md:text-[2.25rem]">
                    {p.cliente}
                  </span>
                  <span className="e-chico mt-1 block text-ed-muted">
                    {p.sistema} · {p.estado}
                  </span>
                </span>
                {i === activo && auto ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-6 shrink-0 -rotate-90"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.2"
                      strokeWidth="1.5"
                    />
                    <circle
                      key={activo}
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      pathLength={1}
                      className="e-anillo"
                    />
                  </svg>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
