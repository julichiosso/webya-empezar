'use client';

import { useEffect, useState } from 'react';
import { SitioNegocio } from '@/components/patterns/SitioNegocio';
import { ButtonLink } from '@/components/ui/Button';
import { VER } from '@/content/crear';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { decodificarBorrador, whatsappDeBorrador, type BorradorSitio } from './borrador';

/** `undefined` mientras no se leyó el hash; `null` si no trae un borrador válido. */
type Lectura = BorradorSitio | null | undefined;

/**
 * El borrador que se comparte. Es una página pública con texto que escribió cualquiera: lleva siempre
 * el cartel de que no está publicado ni revisado, no se indexa y solo enlaza a wa.me. El contenido
 * viaja en el hash, así que nunca llega al servidor.
 */
export function VerBorrador() {
  const [b, setB] = useState<Lectura>(undefined);

  useEffect(() => {
    const leer = () => setB(decodificarBorrador(window.location.hash.slice(1)));
    const t = setTimeout(leer, 0);
    window.addEventListener('hashchange', leer);
    return () => {
      clearTimeout(t);
      window.removeEventListener('hashchange', leer);
    };
  }, []);

  if (b === undefined) {
    return (
      <p aria-busy="true" className="p-8 text-center text-small text-muted">
        {VER.cargando}
      </p>
    );
  }
  if (b === null) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-title font-semibold text-balance">{VER.vacio.titulo}</h1>
        <p className="mt-4 text-lead text-muted">{VER.vacio.texto}</p>
        <ButtonLink href="/crear" className="mt-8">
          {VER.vacio.cta}
        </ButtonLink>
      </div>
    );
  }

  const numero = whatsappDeBorrador(b);
  return (
    <div>
      <div role="note" className="bg-surface-2 px-4 py-2">
        <div className="mx-auto flex max-w-xl flex-wrap items-center justify-between gap-x-4 gap-y-1 text-small">
          <p>{VER.banner.texto}</p>
          <p className="flex gap-4 font-semibold">
            <a
              href={`/crear${window.location.hash}`}
              className="inline-flex min-h-tap items-center underline underline-offset-4"
            >
              {VER.banner.editar}
            </a>
            <a
              href="/crear"
              className="inline-flex min-h-tap items-center underline underline-offset-4"
            >
              {VER.banner.crear}
            </a>
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-xl">
        <SitioNegocio
          comoPagina
          rubro={b.rubro}
          nombre={b.nombre}
          paleta={b.paleta}
          bajada={b.bajada}
          ciudad={b.ciudad}
          horario={b.horario}
          items={b.items}
          linkContacto={numero ? buildWhatsAppLink(numero, '') : null}
        />
      </div>
    </div>
  );
}
