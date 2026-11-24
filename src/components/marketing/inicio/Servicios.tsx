import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { RUTAS, SERVICIOS_HOME as S } from '@/content/home';
import { TituloPalabras } from '../editorial/TituloPalabras';

type Icono = (typeof S.items)[number]['icono'];

/** Íconos de línea de cada producto (24 × 24, trazo de 1,6). */
const TRAZOS: Record<Icono, string> = {
  web: 'M3.5 6.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2zM3.5 9h17M7 6.8h.01M9.5 6.8h.01',
  tienda: 'M5 8h14l-1 11.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5zM9 8V6.5a3 3 0 0 1 6 0V8',
  pedidos:
    'M7 3.5h10a1 1 0 0 1 1 1v16l-2.5-1.5L13 20.5l-2.5-1.5L8 20.5l-2-1.5V4.5a1 1 0 0 1 1-1zM9 8h6M9 11.5h6M9 15h3.5',
  turnos:
    'M4.5 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2zM4.5 9.5h15M8.5 3.5v3M15.5 3.5v3M9.5 14.5l2 2 3.5-4',
};

/**
 * "Qué hacemos": título grande con la acción a la derecha y los cuatro productos en tarjetas oscuras que
 * se apilan al bajar (sticky, sin JS). Cada tarjeta: número y lo que resuelve, el nombre, una línea, el
 * link a su página y una foto comercial que se acerca apenas mientras pasa.
 */
export function Servicios() {
  return (
    <section id={S.id} className="tono-hueso sv" aria-labelledby="titulo-servicios">
      <div className="e-wrap">
        <div className="sv-cabeza">
          <div>
            <p className="sv-ceja">{S.ceja}</p>
            <TituloPalabras lineas={[S.titulo]} id="titulo-servicios" className="sv-titulo" />
          </div>
          <Link href={RUTAS.armar} prefetch={false} className="sv-armar">
            {S.armar}
          </Link>
        </div>
        <ol className="sv-pila">
          {S.items.map((s, i) => (
            <li key={s.id} className="sv-item" style={{ '--i': i } as CSSProperties}>
              <article className="tono-oscuro sv-tarjeta" aria-labelledby={`sv-${s.id}`}>
                <div className="sv-texto">
                  <p className="sv-numero">
                    <span className="sv-icono" aria-hidden="true">
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d={TRAZOS[s.icono]} />
                      </svg>
                    </span>
                    {String(i + 1).padStart(2, '0')} · {s.ceja}
                  </p>
                  <h3 id={`sv-${s.id}`} className="sv-nombre">
                    {s.titulo}
                  </h3>
                  <p className="sv-desc">{s.texto}</p>
                  <Link href={s.href} aria-label={`${S.conoce}: ${s.titulo}`} className="sv-link">
                    <span>{S.conoce}</span>
                  </Link>
                </div>
                <div className="sv-foto">
                  <Image
                    src={s.foto.src}
                    alt={s.foto.alt}
                    fill
                    sizes="(min-width: 1024px) 38rem, 92vw"
                    className="object-cover"
                  />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
