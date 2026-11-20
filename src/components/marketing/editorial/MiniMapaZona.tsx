import Link from 'next/link';
import { MAPA_LIMITE, MAPA_PROYECCION as P } from '@/config/zona-geo';
import { HERO, RUTAS } from '@/content/home';
import { LOCALIDADES, ORDEN_ZONAS, localidadesDe } from '@/content/zona';
import { encuadre, proyectar, zonaSuave } from '@/lib/mapa';

/**
 * Dónde atendemos, en el hero: un mapa chico real (las dos zonas, el límite entre provincias y cada
 * localidad) y la pregunta que engancha a quien es de acá. Todo es un solo link a /zona. Servidor: 0 JS.
 */
export function MiniMapaZona() {
  const punto = (lat: number, lng: number) => proyectar(P, lat, lng);
  const puntos = LOCALIDADES.map((l) => ({ l, xy: punto(l.lat, l.lng) }));
  const v = encuadre(
    puntos.map((p) => p.xy),
    { x: 60, y: 60 },
    P,
  );
  // A la derecha, lugar para los nombres de las dos ciudades (más allá del borde del mapa base).
  const vista = { ...v, w: v.w + 360 };
  const [a, b] = ORDEN_ZONAS.map((z) =>
    zonaSuave(
      localidadesDe(z).map((l) => punto(l.lat, l.lng)),
      26,
    ),
  );
  return (
    <Link
      href={RUTAS.zona}
      // Sin precarga: es un link secundario de la primera pantalla y no suma al JS de la carga.
      prefetch={false}
      className="e-fila e-mini-zona group flex items-center gap-4 rounded-2xl py-2 pr-3 active:opacity-60"
    >
      <svg
        viewBox={`${vista.x} ${vista.y} ${vista.w} ${vista.h}`}
        role="img"
        aria-label={HERO.zona.alt}
        className="h-32 w-auto shrink-0 lg:h-36"
      >
        <path d={a} className="e-mini-zona-a" />
        <path d={b} className="e-mini-zona-b" />
        <path d={MAPA_LIMITE} className="e-mini-zona-limite" />
        {puntos.map(({ l, xy }) => (
          <circle
            key={l.slug}
            cx={xy[0]}
            cy={xy[1]}
            r={l.principal ? 14 : 8}
            className="e-mini-zona-punto"
          />
        ))}
        {puntos
          .filter((p) => p.l.principal)
          .map(({ l, xy }) => (
            <text key={l.slug} x={xy[0] + 26} y={xy[1] + 20} className="e-mini-zona-nombre">
              {l.nombre}
            </text>
          ))}
      </svg>
      <span className="min-w-0">
        <span className="block text-[0.9375rem] leading-snug font-semibold lg:text-base">
          {HERO.zona.titulo}
        </span>
        <span className="e-chico mt-1 block text-ed-muted">
          <span className="e-link-texto">{HERO.zona.texto(LOCALIDADES.length)}</span>
        </span>
      </span>
    </Link>
  );
}
