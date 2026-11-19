import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { BENTO, SECCIONES } from '@/content/home';
import { CabezaSeccion } from './CabezaSeccion';
import { Flecha } from './Iconos';

type CeldaId = keyof typeof BENTO.celdas;

/** Cuadrados redondeados (radio 3) como un solo path: muchos <rect> sueltos sumaban nodos al DOM. */
function grilla(
  filas: number,
  columnas: number,
  x0: number,
  y0: number,
  paso: number,
  lado: number,
  pasoY = paso,
) {
  let d = '';
  for (let f = 0; f < filas; f++)
    for (let c = 0; c < columnas; c++) {
      const x = x0 + c * paso;
      const y = y0 + f * pasoY;
      const l = lado - 6;
      d += `M${x + 3} ${y}h${l}a3 3 0 0 1 3 3v${l}a3 3 0 0 1-3 3h-${l}a3 3 0 0 1-3-3v-${l}a3 3 0 0 1 3-3z`;
    }
  return d;
}

/** Dibujos de línea (pathLength=1: se trazan al entrar en pantalla). Decorativos. */
const DIBUJOS: Record<CeldaId, React.ReactNode> = {
  turnero: (
    <>
      <path className="e-trazo" pathLength={1} d={grilla(4, 7, 4, 8, 22, 16)} />
      <rect
        x={4 + 4 * 22}
        y={8 + 2 * 22}
        width={16}
        height={16}
        rx={3}
        fill="currentColor"
        stroke="none"
      />
      <circle className="e-trazo" pathLength={1} cx={196} cy={50} r={30} />
      <path className="e-trazo" pathLength={1} d="M196 20a30 30 0 0 1 0 60" strokeWidth={6} />
    </>
  ),
  pedidos: (
    <>
      <path
        className="e-trazo"
        pathLength={1}
        d="M20 6h60v84l-7.5-6-7.5 6-7.5-6-7.5 6-7.5-6-7.5 6-7.5-6-7.5 6z"
      />
      <path className="e-trazo" pathLength={1} d="M32 26h36M32 40h36M32 54h20" />
      <path className="e-trazo" pathLength={1} d="M104 48h64M150 32l18 16-18 16" />
    </>
  ),
  tienda: (
    <>
      <path className="e-trazo" pathLength={1} d="M24 34h72l-6 56H30z" />
      <path className="e-trazo" pathLength={1} d="M44 34v-8a16 16 0 0 1 32 0v8" />
    </>
  ),
  catalogo: (
    <>
      <path className="e-trazo" pathLength={1} d={grilla(2, 3, 8, 10, 38, 30, 40)} />
    </>
  ),
  web: (
    <>
      <rect className="e-trazo" pathLength={1} x={6} y={8} width={108} height={78} rx={6} />
      <path className="e-trazo" pathLength={1} d="M6 24h108M20 44h50M20 56h70M20 68h40" />
    </>
  ),
  panel: (
    <>
      <path className="e-trazo" pathLength={1} d="M10 24h100M10 50h100M10 76h100" />
      <circle cx={36} cy={24} r={7} fill="currentColor" />
      <circle cx={80} cy={50} r={7} fill="currentColor" />
      <circle cx={52} cy={76} r={7} fill="currentColor" />
    </>
  ),
  bot: (
    <>
      <path
        className="e-trazo"
        pathLength={1}
        d="M8 12h72a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H30l-14 12V50H8z"
      />
      <path
        className="e-trazo"
        pathLength={1}
        d="M112 44h-40a8 8 0 0 0-8 8v18a8 8 0 0 0 8 8h22l12 10V78h6a8 8 0 0 0 8-8V52a8 8 0 0 0-8-8z"
      />
    </>
  ),
};

interface CeldaDef {
  id: CeldaId;
  /** Tipo del configurador que preselecciona, o módulo que marca. */
  armar?: string;
  modulo?: string;
  clases: string;
  ancho: number;
}

const CELDAS: readonly CeldaDef[] = [
  {
    id: 'turnero',
    armar: 'turnero',
    clases: 'md:col-span-12 lg:col-span-7 lg:row-span-2',
    ancho: 240,
  },
  { id: 'pedidos', armar: 'pedidos', clases: 'md:col-span-6 lg:col-span-5', ancho: 180 },
  { id: 'tienda', armar: 'tienda', clases: 'md:col-span-6 lg:col-span-5', ancho: 120 },
  { id: 'catalogo', armar: 'catalogo', clases: 'md:col-span-6 lg:col-span-3', ancho: 120 },
  { id: 'web', armar: 'web', clases: 'md:col-span-6 lg:col-span-3', ancho: 120 },
  { id: 'panel', modulo: 'panel', clases: 'md:col-span-6 lg:col-span-3', ancho: 120 },
  { id: 'bot', modulo: 'bot', clases: 'md:col-span-6 lg:col-span-3', ancho: 120 },
];

/** Bento "Qué armo": grilla asimétrica, cada celda lleva al configurador con lo suyo ya elegido. */
export function Bento({ numero = 1 }: { numero?: number }) {
  const S = SECCIONES.queArmo;
  return (
    <section id={S.id} className="tono-claro e-seccion" aria-labelledby="titulo-que-armo">
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={S.rotulo}
          titulo={S.titulo}
          bajada={S.bajada}
          idTitulo="titulo-que-armo"
        />
        <ul className="mt-14 grid grid-cols-1 gap-3 md:mt-20 md:grid-cols-12 md:gap-4">
          {CELDAS.map((c, i) => {
            const t = BENTO.celdas[c.id];
            const estrella = c.id === 'turnero';
            return (
              <li
                key={c.id}
                className={c.clases}
                data-reveal=""
                style={{ '--i': i % 4 } as CSSProperties}
              >
                <a
                  href="#armar"
                  data-armar={c.armar ?? ''}
                  data-modulo={c.modulo}
                  className={cn(
                    'e-celda group flex h-full flex-col justify-between gap-10 rounded-2xl border p-6 md:p-8',
                    estrella
                      ? 'tono-oscuro min-h-[22rem] border-ed-line lg:min-h-full'
                      : 'min-h-[15rem] border-ed-line',
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <svg
                      viewBox={`0 0 ${c.ancho} 100`}
                      className={cn('h-20 w-auto md:h-24', estrella && 'md:h-28')}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                      data-draw=""
                    >
                      {DIBUJOS[c.id]}
                    </svg>
                    {'destacado' in t ? (
                      <span className="e-rotulo flex items-center gap-2 rounded-full border border-ed-line px-3 py-2">
                        <span className="e-punto" aria-hidden="true" />
                        {t.destacado}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <h3 className={estrella ? 'e-h2' : 'e-h3'}>{t.titulo}</h3>
                    <p
                      className={cn(
                        'mt-3 max-w-[40ch] text-ed-muted',
                        estrella ? 'e-lead' : 'e-cuerpo',
                      )}
                    >
                      {t.texto}
                    </p>
                    <span className="e-chico mt-6 inline-flex items-center gap-2 font-medium">
                      {BENTO.armar}
                      <Flecha />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
