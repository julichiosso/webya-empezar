import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';
import { HERO_CALLE as H, RUTAS } from '@/content/home';
import { Astro } from './Astro';
import { Calle, LocalesCalle } from './Calle';
import { ProgresoCalle } from './ProgresoCalle';

const ID = 'hero';

/** Capturas reales (sitios hechos por Webya) que pasan por la vidriera-pantalla de tu negocio. */
const SITIOS = ['/calle/micios.webp', '/calle/petrucci.webp', '/calle/lorena.webp'] as const;

/**
 * Hero "Abierto siempre". Arriba, el lema (Creá. Digitalizá. Crecé.) y una línea; abajo, una calle de
 * negocios de pueblo dibujada en vector. Al bajar se hace de noche: los vecinos bajan la persiana y el
 * tuyo sigue atendiendo, con tu sitio en la vidriera y el cartel de abierto. Después la calle entera se
 * enciende. Cada momento enciende su palabra del lema y cambia la línea de abajo.
 *
 * Con movimiento, el escenario queda fijo un tramo y el scroll mueve `--p` (ProgresoCalle). Sin
 * movimiento, mide una pantalla y se ve la calle ya de noche, quieta.
 */
export function HeroCalle() {
  return (
    <section id={ID} className="tono-hueso hc" aria-labelledby="titulo-hero">
      <ProgresoCalle id={ID} />
      <div className="hc-escenario">
        <div className="hc-cielo" aria-hidden="true" />
        <Astro idHero={ID} textos={H.astro} />

        <div className="hc-texto">
          <h1 id="titulo-hero" className="hc-lema">
            {H.lema.map((palabra, i) => (
              <Fragment key={palabra}>
                <span className="hc-palabra" data-i={i} style={{ '--i': i } as CSSProperties}>
                  {palabra}
                </span>
                {i < H.lema.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h1>
          <div className="hc-lineas">
            {H.lineas.map((linea, i) => (
              <p key={linea} className="hc-linea" data-i={i}>
                {linea}
              </p>
            ))}
          </div>
          <div className="hc-acciones">
            {/* Sin precarga: el configurador no entra en el JS inicial de la home. */}
            <Link href={RUTAS.armar} prefetch={false} className="hc-boton">
              {H.armar}
            </Link>
            <Link href={RUTAS.demos} prefetch={false} className="hc-boton hc-boton-claro">
              {H.demos}
            </Link>
          </div>
          <p className="hc-pista" aria-hidden="true">
            {H.pista}
          </p>
        </div>

        <figure className="hc-figura" aria-label={H.escena}>
          <Calle sitios={SITIOS} />
          <LocalesCalle />
        </figure>
      </div>
    </section>
  );
}
