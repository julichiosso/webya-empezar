import Image from 'next/image';
import type { CSSProperties } from 'react';
import { VIDRIERA } from '@/content/landings';
import { ESTADO_PROYECTO, getProyecto, type ImagenProyecto } from '@/content/proyectos';
import { PantallaProyecto, Telefono } from './Pantallas';

type Producto = keyof typeof VIDRIERA.orden;

interface Pieza {
  id: string;
  cliente: string;
  sistema: string;
  estado: string;
  img?: ImagenProyecto;
  /** La captura es de pantalla completa (trae su barra de estado). */
  completa?: boolean;
  mockup?: 'pedidos' | 'tienda' | 'web' | 'turnero';
}

/** Alto útil de la pantalla del teléfono en anchos (sin la barra de estado), para saber cuánto bajar. */
const PANTALLA = 2;

function piezas(producto: Producto): Pieza[] {
  return VIDRIERA.orden[producto].flatMap((id): Pieza[] => {
    const p = getProyecto(id);
    if (!p || p.estado === 'construccion') return [];
    return [
      {
        id,
        cliente: p.cliente,
        sistema: p.sistema,
        estado: ESTADO_PROYECTO[p.estado],
        img: p.imagenes.mobile,
        completa: p.imagenes.mobile?.completa,
        mockup: p.mockup,
      },
    ];
  });
}

function Celular({ p, copia }: { p: Pieza; copia: boolean }) {
  const img = p.img;
  // Cuánto se desplaza la captura para recorrerla entera (0 si entra en la pantalla).
  const bajar = img && !p.completa ? Math.max(0, 1 - PANTALLA / (img.alto / img.ancho)) : 0;
  return (
    <figure className="w-35 shrink-0 sm:w-40 lg:w-45">
      <Telefono
        className="max-w-none"
        decorativo={!img || copia}
        barra={!p.completa}
        colorBarra={img?.barra}
      >
        {img ? (
          <div className="relative h-full overflow-hidden">
            <Image
              src={img.src}
              alt={copia ? '' : img.alt}
              width={img.ancho}
              height={img.alto}
              sizes="(min-width: 1024px) 11rem, 9rem"
              className={
                bajar
                  ? 'e-vidriera-recorre e-bucle h-auto w-full'
                  : 'h-full w-full object-cover object-top'
              }
              style={bajar ? ({ '--bajar': `${-bajar * 100}%` } as CSSProperties) : undefined}
            />
          </div>
        ) : p.mockup ? (
          <PantallaProyecto mockup={p.mockup} />
        ) : null}
      </Telefono>
      <figcaption className="mt-3">
        <span className="block truncate text-[0.8125rem] font-medium">{p.cliente}</span>
        <span className="block truncate text-[0.75rem] text-ed-muted">{p.sistema}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Vidriera del hero de cada producto: los trabajos hechos, en teléfonos que desfilan despacio (se frena
 * al pasar el mouse) y cuyas capturas se recorren solas de arriba a abajo. Solo transform; se pausa fuera
 * de pantalla y con movimiento reducido queda quieta. La segunda vuelta es copia (oculta a lectores).
 */
export function Vidriera({ producto }: { producto: Producto }) {
  const lista = piezas(producto);
  return (
    <div
      className="e-vidriera relative -mx-[clamp(1rem,4vw,3rem)] overflow-hidden pl-[clamp(1rem,4vw,3rem)] lg:mx-0 lg:pl-10"
      role="region"
      aria-label={VIDRIERA.etiqueta}
      // Con movimiento reducido se desliza a mano: tiene que poder recorrerse con el teclado.
      tabIndex={0}
      data-loop=""
    >
      {/* Dos mitades iguales (con su espacio al final): correr la pista −50 % da una vuelta exacta. */}
      <div className="e-vidriera-pista e-bucle flex w-max">
        <div className="flex gap-4 pr-4 sm:gap-6 sm:pr-6">
          {lista.map((p) => (
            <Celular key={p.id} p={p} copia={false} />
          ))}
        </div>
        <div aria-hidden="true" className="flex gap-4 pr-4 sm:gap-6 sm:pr-6">
          {lista.map((p) => (
            <Celular key={`copia-${p.id}`} p={p} copia />
          ))}
        </div>
      </div>
    </div>
  );
}
