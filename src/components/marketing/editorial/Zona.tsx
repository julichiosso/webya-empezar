import { CTA, RUTAS } from '@/content/home';
import { ZONA as ZONA_UI } from '@/content/paginas';
import { Boton } from './Boton';

/**
 * Proyección del mapa: coordenadas reales (grados) a la grilla del SVG, a 4 px por km con la escala de
 * esta latitud (1° de longitud ≈ 94,6 km, 1° de latitud ≈ 111 km). Origen arriba a la izquierda.
 */
const x = (lon: number) => (lon + 62.45) * 94.6 * 4;
const y = (lat: number) => (-31.2 - lat) * 111 * 4;
const KM = 4;

const SAN_JORGE = { x: x(-61.86), y: y(-31.896) };
const SAN_FRANCISCO = { x: x(-62.083), y: y(-31.428) };

/** Pueblos de referencia (solo ubicación, para orientarse). */
const PUEBLOS: readonly { id: keyof typeof ZONA_UI.pueblos; lat: number; lon: number }[] = [
  { id: 'sastre', lat: -31.767, lon: -61.829 },
  { id: 'mariaJuana', lat: -31.675, lon: -61.755 },
  { id: 'pellegrini', lat: -32.049, lon: -61.792 },
  { id: 'piamonte', lat: -32.145, lon: -61.98 },
  { id: 'trebol', lat: -32.2, lon: -61.701 },
];

function Mapa() {
  return (
    <svg
      viewBox="0 40 400 440"
      role="img"
      aria-label={ZONA_UI.mapaAlt}
      className="h-auto w-full"
      data-reveal=""
    >
      <defs>
        <pattern id="zona-puntos" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.14" />
        </pattern>
      </defs>
      <rect y="40" width="400" height="440" fill="url(#zona-puntos)" />

      {/* Límite entre Córdoba y Santa Fe (aproximado). */}
      <path
        d={`M${x(-62.07)} 40 L${x(-62.055)} 200 L${x(-62.04)} 480`}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeDasharray="2 6"
        strokeWidth="1.5"
      />
      <text
        x="18"
        y="458"
        className="fill-current text-[11px] tracking-[0.2em] uppercase"
        opacity="0.5"
      >
        {ZONA_UI.provincias.cordoba}
      </text>
      <text
        x="382"
        y="66"
        textAnchor="end"
        className="fill-current text-[11px] tracking-[0.2em] uppercase"
        opacity="0.5"
      >
        {ZONA_UI.provincias.santaFe}
      </text>

      {/* Lo que cubre cada zona. */}
      <circle cx={SAN_JORGE.x} cy={SAN_JORGE.y} r={30 * KM} className="e-zona-area" />
      <circle cx={SAN_FRANCISCO.x} cy={SAN_FRANCISCO.y} r={20 * KM} className="e-zona-area" />

      {PUEBLOS.map((p) => (
        <g key={p.id} opacity="0.75">
          <circle cx={x(p.lon)} cy={y(p.lat)} r="2.5" fill="currentColor" />
          <text x={x(p.lon) + 7} y={y(p.lat) + 4} className="fill-current text-[11px]">
            {ZONA_UI.pueblos[p.id]}
          </text>
        </g>
      ))}

      {[
        { ...SAN_JORGE, nombre: ZONA_UI.ciudades.sanJorge, dx: 12 },
        { ...SAN_FRANCISCO, nombre: ZONA_UI.ciudades.sanFrancisco, dx: 12 },
      ].map((c) => (
        <g key={c.nombre}>
          <circle cx={c.x} cy={c.y} r="6" className="fill-current" />
          <circle cx={c.x} cy={c.y} r="6" fill="none" stroke="var(--e-bg)" strokeWidth="2" />
          <text x={c.x + c.dx} y={c.y - 10} className="fill-current text-[15px] font-semibold">
            {c.nombre}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** /zona: el mapa (SVG propio, sin mapas de terceros) y las localidades de cada área. */
export function ZonaMapa() {
  return (
    <section className="tono-claro e-seccion" aria-label={ZONA_UI.rotulo}>
      <div className="e-wrap grid grid-cols-12 gap-x-6 gap-y-10 lg:items-start">
        <div className="col-span-12 lg:order-2 lg:col-span-6 lg:col-start-7">
          <div className="mx-auto max-w-[30rem] rounded-3xl border border-ed-line p-3 text-ed-fg sm:p-4 lg:max-w-none">
            <Mapa />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          {ZONA_UI.areas.map((a) => (
            <div key={a.nombre} className="border-t border-ed-line pt-5 pb-8">
              <h2 className="e-h3">{a.nombre}</h2>
              <p className="e-rotulo mt-2 text-ed-muted">{a.provincia}</p>
              <ul className="e-cuerpo mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-ed-muted">
                {a.localidades.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="e-cuerpo border-t border-ed-line pt-5">{ZONA_UI.lejos}</p>
          <div className="mt-6">
            <Boton href={RUTAS.armar}>{CTA.armar}</Boton>
          </div>
        </div>
      </div>
    </section>
  );
}
