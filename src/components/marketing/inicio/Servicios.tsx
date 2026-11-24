import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { RUTAS, SERVICIOS_HOME as S } from '@/content/home';
import { TituloPalabras } from '../editorial/TituloPalabras';
import { PilaTarjetas } from './PilaTarjetas';

/**
 * "Qué hacemos": título grande con la acción a la derecha y los cuatro productos en tarjetas oscuras que
 * se apilan al bajar (sticky, sin JS). Cada tarjeta: el nombre, una línea, el
 * link a su página y una foto comercial que se acerca apenas mientras pasa.
 */
export function Servicios() {
  return (
    <section id={S.id} className="tono-hueso sv" aria-labelledby="titulo-servicios">
      <PilaTarjetas id={S.id} />
      <div className="e-wrap">
        <div className="sv-cabeza">
          <div>
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
