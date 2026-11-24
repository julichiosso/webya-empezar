import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { HERO_CALLE as H, RUTAS, TRABAJOS } from '@/content/home';
import { enlaceContacto } from '../editorial/contacto';
import { Astro } from './Astro';
import { Calle } from './Calle';
import { EscribinosFlotante } from './EscribinosFlotante';
import { ProgresoCalle } from './ProgresoCalle';

const ID = 'hero';

/** Capturas reales (sitios hechos por Webya) que pasan por la vidriera-pantalla de tu negocio. */
const SITIOS = ['/calle/micios.webp', '/calle/petrucci.webp', '/calle/lorena.webp'] as const;

/** Nubes de día (línea, como la calle): posición, escala y cuánto tardan en cruzar. */
const NUBES = [
  { x: '7%', y: '30%', s: 0.9, d: '70s' },
  { x: '44%', y: '0%', s: 0.65, d: '95s' },
  { x: '78%', y: '42%', s: 0.8, d: '80s' },
] as const;

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
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  const externo = contacto.canal === 'whatsapp';
  return (
    <section id={ID} className="tono-hueso hc" aria-labelledby="titulo-hero">
      <ProgresoCalle id={ID} />
      <div className="hc-escenario">
        <div className="hc-cielo" aria-hidden="true" />
        <div className="hc-nubes" aria-hidden="true">
          {NUBES.map((n, i) => (
            <svg
              key={i}
              viewBox="0 0 120 48"
              className="hc-nube"
              style={{ '--x': n.x, '--y': n.y, '--s': n.s, '--d': n.d } as CSSProperties}
              focusable="false"
            >
              <path d="M18 40h84a14 14 0 0 0 0-28 22 22 0 0 0-40-6 18 18 0 0 0-30 12A12 12 0 0 0 18 40Z" />
            </svg>
          ))}
        </div>
        <Astro idHero={ID} textos={H.astro} />

        <div className="hc-texto">
          <h1 id="titulo-hero" className="hc-lema">
            {H.lema.map((palabra, i) => (
              <span
                key={palabra}
                className="hc-palabra"
                data-i={i}
                style={{ '--i': i } as CSSProperties}
              >
                {palabra}
                {i < H.lema.length - 1 ? ' ' : null}
              </span>
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
            <a href={`#${TRABAJOS.id}`} className="hc-link">
              {H.trabajos}
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="m6 3.5 4.5 4.5L6 12.5" />
              </svg>
            </a>
          </div>
        </div>

        <figure className="hc-figura" aria-label={H.escena}>
          <Calle sitios={SITIOS} />
        </figure>
      </div>
      {/* En la compu, el botón para escribirnos queda fijo abajo a la derecha cuando el hero ya pasó. */}
      <EscribinosFlotante href={contacto.href} externo={externo} />
    </section>
  );
}
