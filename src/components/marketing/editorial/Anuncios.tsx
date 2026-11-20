'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ANUNCIOS, CTA } from '@/content/home';
import { enlaceContacto } from './contacto';

const CADA_MS = 5500;

/**
 * Barra de anuncios: una novedad por vez, que sube y se va cuando entra la siguiente. Se pausa al pasar
 * el mouse o con el foco adentro; con movimiento reducido queda la primera. Las que no se ven son
 * `inert` (ni el teclado ni los lectores de pantalla las toman).
 */
export function Anuncios() {
  const [activo, setActivo] = useState(0);
  const [pausa, setPausa] = useState(false);
  const total = ANUNCIOS.items.length;

  useEffect(() => {
    if (pausa || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setActivo((a) => (a + 1) % total), CADA_MS);
    return () => clearInterval(t);
  }, [pausa, total]);

  return (
    <div
      role="region"
      aria-label={ANUNCIOS.etiqueta}
      className="tono-oscuro bg-ed-surface"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      <div className="e-wrap relative h-10 overflow-hidden">
        {ANUNCIOS.items.map((a, i) => {
          const estado =
            i === activo ? 'activo' : i === (activo - 1 + total) % total ? 'sale' : 'espera';
          const externo = a.destino === 'whatsapp';
          const href = externo ? enlaceContacto(a.mensaje).href : a.destino;
          return (
            <p
              key={a.texto}
              data-estado={estado}
              inert={estado !== 'activo'}
              className="e-anuncio e-chico absolute inset-0 flex items-center justify-center gap-x-3 px-4 text-center"
            >
              <span className="truncate text-ed-muted">
                <span className="sm:hidden">{a.corto}</span>
                <span className="max-sm:hidden">{a.texto}</span>
              </span>
              {externo ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${a.link}${CTA.pestana}`}
                  className="e-link shrink-0 font-medium text-ed-fg"
                >
                  {a.link}
                </a>
              ) : (
                <Link href={href} className="e-link shrink-0 font-medium text-ed-fg">
                  {a.link}
                </Link>
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}
