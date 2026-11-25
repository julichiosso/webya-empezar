import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';
import { HERO_MAPA as H, RUTAS } from '@/content/home';
import { fichasPueblo } from './FichasPueblo';
import { MapaPueblo } from './MapaPueblo';

/** El nombre de cada ficha, para el lector de pantalla ("Peluquería: Turnos con seña"). */
const ETIQUETAS = Object.fromEntries(
  H.negocios.map((n) => [n.id, H.globo(n.rubro, n.sistema)]),
) as Record<(typeof H.negocios)[number]['id'], string>;

/**
 * Hero "El pueblo": arriba el lema (cada palabra entra en secuencia), qué hacemos y para quién, las dos
 * acciones y de dónde somos; abajo, el plano del pueblo con los negocios que se tocan. Una sola pantalla,
 * sin tramo fijo ni scroll atado: liviano y quieto salvo tres detalles (pueblo.css).
 */
export function HeroPueblo() {
  return (
    <section id="hero" className="tono-hueso pb" aria-labelledby="titulo-hero">
      <div className="pb-texto">
        <h1 id="titulo-hero" className="pb-lema">
          {H.lema.map((palabra, i) => (
            <Fragment key={palabra}>
              <span className="pb-palabra" style={{ '--i': i } as CSSProperties}>
                {palabra}
              </span>
              {i < H.lema.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </h1>
        <p className="pb-bajada">{H.bajada}</p>
        <div className="pb-acciones">
          {/* Sin precarga: el configurador no entra en el JS inicial de la home. */}
          <Link href={RUTAS.armar} prefetch={false} className="pb-boton">
            {H.armar}
          </Link>
          <Link href={RUTAS.demos} prefetch={false} className="pb-boton pb-boton-claro">
            {H.demos}
          </Link>
        </div>
        <p className="pb-confianza">{H.confianza}</p>
      </div>
      <MapaPueblo
        negocios={H.negocios}
        fichas={fichasPueblo()}
        textos={{ plano: H.plano, plaza: H.plaza, pista: H.pista, etiquetas: ETIQUETAS }}
      />
    </section>
  );
}
