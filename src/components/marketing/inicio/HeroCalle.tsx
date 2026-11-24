import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';
import { HERO_CALLE as H, RUTAS } from '@/content/home';
import { Astro } from './Astro';
import { Calle, LocalesCalle } from './Calle';
import { ProgresoCalle } from './ProgresoCalle';
import { VidrieraTurno } from './VidrieraTurno';

const ID = 'hero';

/** Nube rellena, sin contorno: una sola forma irregular (con su sombra corrida 4 px abajo). */
const NUBE =
  'M16 54c-9 0-14-6-12-13 2-7 10-10 16-7 1-11 11-18 22-15 5-12 20-17 31-10 8-9 23-9 31 1 10-4 22 2 23 12 9 0 16 6 15 14-1 6-6 10-12 10H16Z';

/**
 * Una bici de reparto (con la caja lima de la marca) que cruza la calle cada tanto. Va aparte del dibujo:
 * se mueve con transform, sin repintar la calle. Sin movimiento, no aparece.
 */
function Repartidor() {
  return (
    <div className="hc-pasa" aria-hidden="true">
      <div className="hc-pasa-tira">
        <svg viewBox="0 0 120 80" className="hc-repartidor" focusable="false">
          <rect x="6" y="27" width="32" height="25" rx="3" className="hc-rep-caja" />
          <circle cx="26" cy="64" r="13" className="hc-rep-linea" />
          <circle cx="94" cy="64" r="13" className="hc-rep-linea" />
          <path
            d="M26 64 52 64 44 44M52 64 84 44H44M84 44 94 64M80 34l4 10M76 34h10M38 44h14"
            className="hc-rep-linea"
          />
          <path d="M48 42 60 22M60 22 82 34M50 42 56 64" className="hc-rep-linea" />
          <circle cx="62" cy="13" r="7" className="hc-rep-cabeza" />
          <circle cx="104" cy="44" r="2.5" className="hc-rep-farol" />
        </svg>
      </div>
    </div>
  );
}

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
        <div className="hc-nubes" aria-hidden="true">
          {[0, 1].map((i) => (
            <svg key={i} viewBox="0 0 160 64" className="hc-nube" data-i={i} focusable="false">
              <path className="hc-nube-sombra" d={NUBE} transform="translate(0 4)" />
              <path className="hc-nube-cuerpo" d={NUBE} />
            </svg>
          ))}
        </div>
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
          <p className="hc-confianza">{H.confianza}</p>
        </div>

        <figure className="hc-figura" aria-label={H.escena}>
          <Calle sitios={SITIOS} />
          <VidrieraTurno />
          <Repartidor />
          <LocalesCalle />
        </figure>
      </div>
    </section>
  );
}
