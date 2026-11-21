import Link from 'next/link';
import type { CSSProperties } from 'react';
import { MAPA_LIMITE, MAPA_PROYECCION as P } from '@/config/zona-geo';
import { HERO, RUTAS } from '@/content/home';
import { LOCALIDADES, ORDEN_ZONAS, localidadesDe } from '@/content/zona';
import { encuadre, proyectar, zonaSuave } from '@/lib/mapa';
import { keyframesRodillo } from '@/lib/rodillo';

/** Cuánto queda cada localidad a la vista en el rodillo (segundos). */
const PASO = 1.8;
/**
 * Dónde atendemos, en el hero: un rodillo que va pasando cada localidad ("Atendemos en Sastre…") y, al lado,
 * el mapa real de las dos zonas con el punto de esa localidad encendido. Todo es un link a /zona.
 * Servidor y CSS: 0 JavaScript. Con movimiento reducido queda quieto (el nombre accesible del link dice
 * todo).
 */
export function MiniMapaZona() {
  const Z = HERO.zona;
  // Primero las dos ciudades, después los alrededores en el orden del manifiesto.
  const orden = [...LOCALIDADES].sort((a, b) => Number(b.principal) - Number(a.principal));
  const n = orden.length;
  const ciclo = n * PASO;
  const punto = (lat: number, lng: number) => proyectar(P, lat, lng);
  const puntos = orden.map((l) => ({ l, xy: punto(l.lat, l.lng) }));
  const v = encuadre(
    puntos.map((p) => p.xy),
    { x: 50, y: 50 },
    P,
  );
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
      aria-label={Z.aria(n)}
      className="e-zona-vivo group relative flex items-center gap-5 py-2"
      style={{ '--ciclo': `${ciclo}s` } as CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframesRodillo(n) }} />
      <svg
        viewBox={`${v.x} ${v.y} ${v.w} ${v.h}`}
        aria-hidden="true"
        className="h-28 w-auto shrink-0 lg:h-32"
      >
        <path d={a} className="e-mini-zona-a" />
        <path d={b} className="e-mini-zona-b" />
        <path d={MAPA_LIMITE} className="e-mini-zona-limite" />
        {puntos.map(({ l, xy }, i) => (
          <circle
            key={l.slug}
            cx={xy[0]}
            cy={xy[1]}
            r={l.principal ? 12 : 7}
            className="e-zona-punto"
            // Retraso negativo: al cargar, la primera ya está encendida y el resto espera su turno.
            style={{ animationDelay: `${-(ciclo - i * PASO)}s` }}
          />
        ))}
      </svg>
      <span className="min-w-0">
        <span className="e-rotulo block text-ed-muted">{Z.rotulo}</span>
        <span
          aria-hidden="true"
          className="mt-2 block text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.02em] lg:text-[1.625rem]"
        >
          {Z.atendemos}
          <span className="e-rodillo block">
            <span className="e-rodillo-lista">
              {[...orden, orden[0]!].map((l, i) => (
                <span key={`${l.slug}-${i}`}>{l.nombre}</span>
              ))}
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="e-chico mt-2 block text-ed-muted">
          {Z.detalle} <span className="e-zona-ver text-ed-fg">{Z.ver}</span>
        </span>
      </span>
    </Link>
  );
}
