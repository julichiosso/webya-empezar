import Link from 'next/link';
import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { BENTO, SECCIONES } from '@/content/home';
import { CabezaSeccion } from './CabezaSeccion';
import { FondoMarca } from './FondoMarca';

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
  medida: (
    <>
      <path className="e-trazo" pathLength={1} d="M10 20h40v40H10zM70 40h40v40H70z" />
      <path className="e-trazo" pathLength={1} d="M50 40h20M30 60v20h40" />
    </>
  ),
};

interface CeldaDef {
  id: CeldaId;
  clases: string;
  ancho: number;
}

/** Escritorio: el turnero ocupa dos filas; abajo, tres iguales. Celular: el turnero arriba y el resto de a dos. */
const CELDAS: readonly CeldaDef[] = [
  { id: 'turnero', clases: 'col-span-2 md:col-span-12 lg:col-span-7 lg:row-span-2', ancho: 240 },
  { id: 'pedidos', clases: 'md:col-span-6 lg:col-span-5', ancho: 180 },
  { id: 'tienda', clases: 'md:col-span-6 lg:col-span-5', ancho: 120 },
  { id: 'catalogo', clases: 'md:col-span-4', ancho: 120 },
  { id: 'web', clases: 'md:col-span-4', ancho: 120 },
  { id: 'medida', clases: 'col-span-2 md:col-span-4', ancho: 120 },
];

/** Bento "Qué armamos": grilla asimétrica, cada tarjeta lleva a la página de su producto. */
export function Bento() {
  const S = SECCIONES.queArmo;
  return (
    <section
      id={S.id}
      className="tono-claro e-seccion e-con-fondo"
      aria-labelledby="titulo-que-armamos"
    >
      <FondoMarca variante="logo" />
      <div className="e-wrap">
        <CabezaSeccion rotulo={S.rotulo} titulo={S.titulo} idTitulo="titulo-que-armamos" />
        <ul className="mt-8 grid grid-cols-2 gap-2.5 md:mt-12 md:grid-cols-12 md:gap-4">
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
                <Link
                  href={t.href}
                  className={cn(
                    'e-celda group flex h-full flex-col justify-between rounded-2xl border border-ed-line bg-ed-bg active:opacity-70',
                    estrella
                      ? 'tono-oscuro min-h-[15rem] gap-8 p-5 md:min-h-[20rem] md:p-8 lg:min-h-full'
                      : 'min-h-[9.5rem] gap-4 p-4 md:min-h-[13rem] md:gap-8 md:p-7',
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <svg
                      viewBox={`0 0 ${c.ancho} 100`}
                      className={cn('h-14 w-auto md:h-20', estrella ? 'md:h-28' : 'max-md:hidden')}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                      data-draw=""
                    >
                      {DIBUJOS[c.id]}
                    </svg>
                  </div>
                  <div>
                    <h3
                      className={
                        estrella
                          ? 'e-h2'
                          : 'text-[1.0625rem] leading-tight font-semibold tracking-[-0.02em] md:text-[1.375rem]'
                      }
                    >
                      {t.titulo}
                    </h3>
                    <p
                      className={cn(
                        'mt-2 max-w-[40ch] text-ed-muted',
                        estrella ? 'e-lead' : 'text-[0.8125rem] leading-snug md:text-[0.9375rem]',
                      )}
                    >
                      {t.texto}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
