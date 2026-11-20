'use client';

import { useState } from 'react';
import type { Vista } from '@/lib/mapa';
import { cn } from '@/components/ui/clases';
import { CTA } from '@/content/home';
import { ZONA as Z } from '@/content/paginas';
import type { LadoEtiqueta, ZonaId } from '@/content/zona';

export interface PuntoMapa {
  slug: string;
  nombre: string;
  zona: ZonaId;
  principal: boolean;
  etiqueta: LadoEtiqueta;
  x: number;
  y: number;
  /** Link de WhatsApp con la localidad en el mensaje (armado en el servidor). */
  whatsapp: string;
}

export interface GeometriaMapa {
  ancho: number;
  alto: number;
  /** Encuadre justo a las localidades (con lugar para los nombres): el mapa usa todo el ancho. */
  vista: Vista;
  limite: string;
  rutas: readonly { ref: string; d: string; rotulo: readonly [number, number] }[];
  zonas: Record<ZonaId, string>;
  /** Línea entre las dos ciudades principales y su distancia real. */
  union: { d: string; medio: readonly [number, number]; km: number };
  alt: string;
}

const LADO: Record<LadoEtiqueta, { dx: number; dy: number; ancla: 'start' | 'end' | 'middle' }> = {
  derecha: { dx: 9, dy: 4.5, ancla: 'start' },
  izquierda: { dx: -9, dy: 4.5, ancla: 'end' },
  arriba: { dx: 0, dy: -10, ancla: 'middle' },
  abajo: { dx: 0, dy: 19, ancla: 'middle' },
};

/**
 * Mapa de la zona conectado con las listas: pasar el mouse, enfocar o tocar una localidad (en la lista o en
 * el mapa) la marca en los dos lados y muestra cómo contactarnos desde ahí. Toda la información también
 * está como texto en las listas (el SVG es una imagen con su descripción completa). Sin animaciones
 * continuas: la línea entre las dos ciudades se dibuja una vez al entrar en pantalla.
 */
export function MapaZona({
  geo,
  puntos,
  zonas,
}: {
  geo: GeometriaMapa;
  puntos: readonly PuntoMapa[];
  zonas: readonly { id: ZonaId; nombre: string; provincia: string }[];
}) {
  const [sel, setSel] = useState<string | null>(null);
  const elegida = puntos.find((p) => p.slug === sel);

  return (
    <div className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
      <div className="col-span-12 lg:col-span-6">
        <div className="lg:sticky lg:top-24">
          <svg
            viewBox={`${geo.vista.x} ${geo.vista.y} ${geo.vista.w} ${geo.vista.h}`}
            role="img"
            aria-label={geo.alt}
            className="mx-auto block h-auto max-h-[80svh] w-full lg:max-h-[82vh]"
          >
            {/* Las dos zonas: relleno plano en dos tonos, con la forma real de sus localidades. */}
            <path d={geo.zonas['san-francisco']} className="e-mapa-zona-a" />
            <path d={geo.zonas['san-jorge']} className="e-mapa-zona-b" />

            {/* Límite entre provincias y rutas principales. */}
            <path d={geo.limite} className="e-mapa-limite" />
            {geo.rutas.map((r) => (
              <g key={r.ref}>
                <path d={r.d} className="e-mapa-ruta" />
                <text x={r.rotulo[0] + 6} y={r.rotulo[1] - 6} className="e-mapa-ruta-nombre">
                  {r.ref}
                </text>
              </g>
            ))}
            <text
              x={geo.vista.x + 14}
              y={geo.vista.y + geo.vista.h - 16}
              className="e-mapa-provincia"
            >
              {Z.provincias.cordoba}
            </text>
            <text
              x={geo.vista.x + geo.vista.w - 14}
              y={geo.vista.y + 28}
              textAnchor="end"
              className="e-mapa-provincia"
            >
              {Z.provincias.santaFe}
            </text>

            {/* San Francisco – San Jorge: se dibuja al entrar en pantalla. */}
            <g data-draw="">
              <path d={geo.union.d} pathLength={1} className="e-trazo e-mapa-union" />
            </g>
            <text x={geo.union.medio[0] + 10} y={geo.union.medio[1]} className="e-mapa-distancia">
              {Z.distancia(geo.union.km)}
            </text>

            {puntos.map((p) => {
              const l = LADO[p.etiqueta];
              const activo = p.slug === sel;
              return (
                <g
                  key={p.slug}
                  className={cn(
                    'e-mapa-punto',
                    p.principal && 'e-mapa-principal',
                    activo && 'e-mapa-activo',
                  )}
                  onMouseEnter={() => setSel(p.slug)}
                  onClick={() => setSel(p.slug)}
                >
                  {/* Área de toque más grande que el punto. */}
                  <circle cx={p.x} cy={p.y} r={16} className="fill-transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.principal ? 7.5 : 4}
                    className="e-mapa-punto-dot"
                  />
                  <text
                    x={p.x + (p.principal ? l.dx * 1.4 : l.dx)}
                    y={p.y + (p.principal ? l.dy * 1.4 : l.dy)}
                    textAnchor={l.ancla}
                    className="e-mapa-nombre"
                  >
                    {p.nombre}
                  </text>
                </g>
              );
            })}
          </svg>
          <p aria-live="polite" className="e-cuerpo mt-4 min-h-12 text-center">
            {elegida ? (
              <>
                {Z.seleccion.texto(elegida.nombre)}{' '}
                <a
                  href={elegida.whatsapp}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${Z.seleccion.link}${CTA.pestana}`}
                  className="e-link font-medium"
                >
                  {Z.seleccion.link}
                </a>
              </>
            ) : (
              <span className="text-ed-muted">{Z.lista.ayuda}</span>
            )}
          </p>
        </div>
      </div>

      <div className="col-span-12 space-y-12 lg:col-span-6">
        {zonas.map((z) => (
          <div key={z.id}>
            <h2 className="e-h2">{z.nombre}</h2>
            <p className="e-rotulo mt-3 text-ed-muted">{z.provincia}</p>
            <ul aria-label={Z.lista.aria(z.nombre)} className="mt-6 grid grid-cols-2 gap-x-8">
              {puntos
                .filter((p) => p.zona === z.id)
                .map((p) => (
                  <li key={p.slug} className="border-b border-ed-line">
                    <button
                      type="button"
                      aria-pressed={p.slug === sel}
                      onMouseEnter={() => setSel(p.slug)}
                      onFocus={() => setSel(p.slug)}
                      onClick={() => setSel(p.slug)}
                      className={cn(
                        'flex min-h-12 w-full items-center text-left text-[1.0625rem] transition-colors',
                        p.slug === sel
                          ? 'font-semibold text-ed-fg'
                          : 'text-ed-muted hover:text-ed-fg',
                        p.principal && 'font-semibold text-ed-fg',
                      )}
                    >
                      {p.nombre}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
