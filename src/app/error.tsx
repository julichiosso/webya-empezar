'use client';

import { useEffect } from 'react';
import { buttonClasses } from '@/components/ui/boton-clases';
import { ESTADOS_PAGINA } from '@/content/estados-pagina';
import { MENSAJE_WHATSAPP } from '@/content/whatsapp';
import { siteConfig } from '@/lib/site-config';
import { buildWhatsAppLink } from '@/lib/whatsapp';

const { error: TXT } = ESTADOS_PAGINA;

/**
 * Error inesperado en una página (Next 16: el límite recibe `retry`). Sin chistes: qué pasó y cómo
 * seguir, con WhatsApp como salida si reintentar no alcanza. Sin ilustración a propósito: el límite
 * de error raíz viaja en el JS inicial de TODAS las páginas y el dibujo arrastraba todo el set.
 */
export default function ErrorDePagina({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Solo el tipo: el mensaje puede traer datos de la persona.
    console.error('[pagina] error', error instanceof Error ? error.name : typeof error);
  }, [error]);
  const whatsapp = buildWhatsAppLink(siteConfig.whatsappNumber, MENSAJE_WHATSAPP.contacto);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-title font-semibold text-balance">{TXT.titulo}</h1>
      <p className="mt-4 text-lead text-muted">{TXT.texto}</p>
      <div className="mt-8 grid gap-3 sm:flex">
        <button type="button" onClick={retry} className={buttonClasses()}>
          {TXT.reintentar}
        </button>
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('secundario')}
          >
            {TXT.whatsapp}
          </a>
        )}
      </div>
    </main>
  );
}
