import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { HERO_CALLE as H, RUTAS, TRABAJOS } from '@/content/home';
import { NOSOTROS } from '@/content/paginas';
import { enlaceContacto } from '../editorial/contacto';
import { Sello } from '../home3d/Sello';
import { Calle } from './Calle';
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
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  const externo = contacto.canal === 'whatsapp';
  return (
    <section id={ID} className="tono-hueso hc" aria-labelledby="titulo-hero">
      <ProgresoCalle id={ID} />
      <div className="hc-escenario">
        <div className="hc-cielo" aria-hidden="true">
          <svg viewBox="0 0 40 40" className="hc-luna" focusable="false">
            <path d="M27 6a16 16 0 1 0 7 22A13 13 0 0 1 27 6Z" />
          </svg>
        </div>

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
      {/* En la compu, el sello para escribirnos queda fijo abajo a la derecha cuando el hero ya pasó. */}
      <Sello
        href={contacto.href}
        externo={externo}
        aria={externo ? H.sello.aria : H.sello.ariaMail}
        giro={H.sello.giro}
        foto={NOSOTROS.foto}
        className="h3d-sello-fijo"
        idArco="h3d-sello-arco-fijo"
      />
    </section>
  );
}
