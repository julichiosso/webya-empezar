import type { CSSProperties } from 'react';
import { MANIFIESTO } from '@/content/home';

/**
 * "Creá. Digitalizá. Crecé.": la frase de Webya como franja de la home. Cada palabra arranca hueca
 * (contorno vectorial) y se llena al entrar en pantalla, una después de otra.
 */
export function Manifiesto() {
  return (
    <section className="tono-claro border-b border-ed-line" aria-label={MANIFIESTO.etiqueta}>
      <ol className="e-wrap grid grid-cols-1 gap-y-6 py-10 md:grid-cols-3 md:gap-x-10 md:py-16">
        {MANIFIESTO.pasos.map((p, i) => (
          <li key={p.palabra} data-reveal="" style={{ '--i': i } as CSSProperties}>
            <p className="e-manifiesto-palabra" style={{ '--i': i } as CSSProperties}>
              {p.palabra}
            </p>
            <p className="e-cuerpo mt-2 max-w-[30ch] text-ed-muted md:mt-3">{p.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
