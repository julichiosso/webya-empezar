'use client';

import { useEffect, useState } from 'react';
import { MENSAJE_RUBRO_UI, MENSAJES_RUBRO } from '@/content/rubros/mensajes';
import { EVENTO_RUBRO } from '@/lib/eventos';

/**
 * Mensaje de venta del rubro elegido en el wizard (titular, descripción y 3 beneficios). Sin rubro,
 * no ocupa lugar. Escucha el evento que emite el wizard.
 */
export function MensajeRubro() {
  const [rubro, setRubro] = useState<string | null>(null);
  useEffect(() => {
    const alElegir = (e: Event) => setRubro((e as CustomEvent<string | null>).detail ?? null);
    window.addEventListener(EVENTO_RUBRO, alElegir);
    return () => window.removeEventListener(EVENTO_RUBRO, alElegir);
  }, []);
  const m = rubro ? MENSAJES_RUBRO[rubro] : undefined;
  if (!m) return null;
  return (
    <section
      aria-label={MENSAJE_RUBRO_UI.aria}
      className="mx-auto w-full max-w-xl px-4 py-8 lg:max-w-page lg:px-8"
    >
      <p className="text-small font-semibold text-accent-ink">
        {m.listo ? MENSAJE_RUBRO_UI.listo : MENSAJE_RUBRO_UI.loArmamos}
      </p>
      <h2 className="mt-2 text-title font-semibold text-balance">{m.titulo}</h2>
      <p className="mt-3 max-w-prose text-lead">{m.descripcion}</p>
      <ul className="mt-4 flex max-w-prose list-disc flex-col gap-1 pl-5">
        {m.beneficios.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}
