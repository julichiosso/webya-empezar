import type { CSSProperties } from 'react';
import { MAPA_LIMITE, MAPA_PROYECCION as P, MAPA_RUTAS } from '@/config/zona-geo';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { CTA, RUTAS } from '@/content/home';
import { ZONA as Z } from '@/content/paginas';
import {
  LOCALIDADES,
  ORDEN_ZONAS,
  ZONAS,
  datosZona,
  localidadesDe,
  principalDe,
} from '@/content/zona';
import { distanciaKm, encuadre, proyectar, zonaSuave } from '@/lib/mapa';
import { Boton } from './Boton';
import { enlaceContacto } from './contacto';
import { WhatsApp } from './Iconos';
import { MapaZona, type GeometriaMapa, type PuntoMapa } from './MapaZona';
import { TituloPalabras } from './TituloPalabras';

const aparece = (i: number) => ({ '--i': i }) as CSSProperties;

/** Hero de /zona: las dos ciudades, enormes, y los datos reales de la zona. */
export function HeroZona() {
  const d = datosZona();
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <section className="tono-claro" aria-labelledby="titulo-hero">
      <div className="e-wrap flex flex-col items-center pt-10 pb-12 text-center md:pt-16 md:pb-16">
        <TituloPalabras
          as="h1"
          id="titulo-hero"
          lineas={Z.titulo}
          alCargar
          className="a-hero max-w-[14ch]"
        />
        <p
          className="a-sub e-hero-aparece mt-4 max-w-[36ch] text-ed-muted md:mt-5"
          style={aparece(1)}
        >
          {Z.bajada}
        </p>
        <p className="e-hero-aparece e-chico mt-4 text-ed-muted" style={aparece(2)}>
          {Z.datos(d.zonas, d.localidades)}
        </p>
        <div className="e-hero-aparece mt-7 flex flex-wrap justify-center gap-3" style={aparece(3)}>
          <Boton href={RUTAS.armar}>{CTA.armar}</Boton>
          <Boton
            href={contacto.href}
            variante="secundario"
            externo
            icono={contacto.canal === 'whatsapp' ? <WhatsApp /> : false}
          >
            {CTA.escribinos}
          </Boton>
        </div>
      </div>
    </section>
  );
}

/** Todo lo que el mapa necesita, calculado acá (servidor) desde el manifiesto y los trazados generados. */
function geometria(): { geo: GeometriaMapa; puntos: PuntoMapa[] } {
  const punto = (lat: number, lng: number) => proyectar(P, lat, lng);
  const puntos = LOCALIDADES.map((l) => {
    const [x, y] = punto(l.lat, l.lng);
    return {
      slug: l.slug,
      nombre: l.nombre,
      zona: l.zona,
      principal: l.principal,
      etiqueta: l.etiqueta,
      x,
      y,
      whatsapp: enlaceContacto(Z.seleccion.mensaje(l.nombre)).href,
    };
  });
  const zonas = Object.fromEntries(
    ORDEN_ZONAS.map((z) => [
      z,
      zonaSuave(
        localidadesDe(z).map((l) => punto(l.lat, l.lng)),
        26,
      ),
    ]),
  ) as GeometriaMapa['zonas'];
  const sf = principalDe('san-francisco');
  const sj = principalDe('san-jorge');
  const a = punto(sf.lat, sf.lng);
  const b = punto(sj.lat, sj.lng);
  return {
    puntos,
    geo: {
      ancho: P.ancho,
      alto: P.alto,
      vista: encuadre(
        puntos.map((p) => [p.x, p.y] as const),
        { x: 150, y: 70 },
        P,
      ),
      limite: MAPA_LIMITE,
      rutas: MAPA_RUTAS,
      zonas,
      union: {
        d: `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`,
        medio: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
        km: Math.round(distanciaKm(sf, sj)),
      },
      alt: Z.mapaAlt(LOCALIDADES.map((l) => l.nombre).join(', ')),
    },
  };
}

/** El mapa y las listas de localidades, conectados. */
export function SeccionMapaZona() {
  const { geo, puntos } = geometria();
  return (
    <section className="tono-claro e-seccion" aria-label={Z.lista.ayuda}>
      <div className="e-wrap">
        <MapaZona
          geo={geo}
          puntos={puntos}
          zonas={ORDEN_ZONAS.map((id) => ({ id, ...ZONAS[id] }))}
        />
      </div>
    </section>
  );
}
