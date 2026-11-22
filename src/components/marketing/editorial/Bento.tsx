import Image from 'next/image';
import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { BENTO, SECCIONES } from '@/content/home';
import { getProyecto } from '@/content/proyectos';
import { LinkChevron } from './LinkChevron';
import { Telefono } from './Pantallas';
import { TituloPalabras } from './TituloPalabras';

type CeldaId = keyof typeof BENTO.celdas;

/** Las cuatro grandes llevan el sitio real de un cliente en el teléfono. */
const GRANDES: readonly { id: CeldaId; proyecto: string; oscura?: boolean }[] = [
  { id: 'turnero', proyecto: 'canina', oscura: true },
  { id: 'pedidos', proyecto: 'micios' },
  { id: 'tienda', proyecto: 'petrucci' },
  { id: 'web', proyecto: 'lorena', oscura: true },
];

/** Dibujos de línea de las tarjetas chicas (se trazan al entrar en pantalla). Decorativos. */
const DIBUJOS: Partial<Record<CeldaId, React.ReactNode>> = {
  campo: (
    <>
      <circle className="e-trazo" pathLength={1} cx={86} cy={26} r={12} />
      <path className="e-trazo" pathLength={1} d="M6 84h108M14 84c10-22 26-34 46-34s36 12 46 34" />
      <path
        className="e-trazo"
        pathLength={1}
        d="M30 84l10-18M50 84l6-22M70 84l-2-22M90 84l-8-18"
      />
    </>
  ),
  entidades: (
    <>
      <path
        className="e-trazo"
        pathLength={1}
        d="M60 86 22 50a20 20 0 0 1 38-24 20 20 0 0 1 38 24z"
      />
    </>
  ),
  medida: (
    <>
      <path className="e-trazo" pathLength={1} d="M14 20h36v36H14zM70 44h36v36H70z" />
      <path className="e-trazo" pathLength={1} d="M50 38h20M32 56v24h38" />
    </>
  ),
};
const CHICAS: readonly CeldaId[] = ['campo', 'entidades', 'medida'];

function Acciones({ id }: { id: CeldaId }) {
  const t = BENTO.celdas[id];
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6">
      {t.demo ? (
        <LinkChevron href={t.demo} externo>
          {BENTO.verDemo}
        </LinkChevron>
      ) : null}
      <LinkChevron href={t.href}>{BENTO.masInfo}</LinkChevron>
    </div>
  );
}

/** Tarjeta grande: nombre, una línea, dos acciones y el teléfono con un sitio real, cortado abajo. */
function Grande({ id, proyecto, oscura, i }: (typeof GRANDES)[number] & { i: number }) {
  const t = BENTO.celdas[id];
  const img = getProyecto(proyecto)?.imagenes.mobile;
  return (
    <li
      className={cn(
        'a-tile min-h-[22rem] px-6 pt-8 md:min-h-[36rem] md:pt-14',
        oscura && 'tono-oscuro',
      )}
      data-reveal=""
      style={{ '--i': i % 2 } as CSSProperties}
    >
      <h3 className="a-tile-titulo">{t.titulo}</h3>
      <p className="a-sub mt-2 text-ed-muted">{t.texto}</p>
      <Acciones id={id} />
      {img ? (
        <div className="a-tile-visual mt-auto w-[62%] max-w-64 translate-y-[38%] pt-10 md:max-w-72">
          <Telefono className="max-w-none" barra={!img.completa} colorBarra={img.barra}>
            <Image
              src={img.src}
              alt=""
              fill
              sizes="(min-width: 768px) 18rem, 60vw"
              className="object-cover object-top"
            />
          </Telefono>
        </div>
      ) : null}
    </li>
  );
}

/** Tarjeta chica: dibujo de línea, nombre, una línea y sus acciones. */
function Chica({ id, i }: { id: CeldaId; i: number }) {
  const t = BENTO.celdas[id];
  return (
    <li
      className="a-tile justify-center px-6 py-7 md:py-12"
      data-reveal=""
      style={{ '--i': i } as CSSProperties}
    >
      <svg
        viewBox="0 0 120 100"
        className="h-16 w-auto md:h-20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        data-draw=""
      >
        {DIBUJOS[id]}
      </svg>
      <h3 className="mt-5 text-[1.5rem] leading-tight font-semibold tracking-[-0.03em] md:text-[1.75rem]">
        {t.titulo}
      </h3>
      <p className="e-cuerpo mt-1 text-ed-muted">{t.texto}</p>
      <Acciones id={id} />
    </li>
  );
}

/**
 * Productos de la home, como la vidriera de una marca de tecnología: cuatro tarjetas grandes con el sitio
 * real de un cliente en el teléfono y tres chicas. Cada una: nombre, una línea, "Ver demo" y "Más info".
 */
export function Bento() {
  const S = SECCIONES.queArmo;
  return (
    <section
      id={S.id}
      className="tono-claro py-[clamp(4rem,8vw,8rem)]"
      aria-labelledby="titulo-que-armamos"
    >
      <div className="e-wrap">
        <TituloPalabras
          lineas={[S.titulo]}
          id="titulo-que-armamos"
          className="a-titulo mx-auto text-center"
        />
        <ul className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-2 md:gap-4">
          {GRANDES.map((g, i) => (
            <Grande key={g.id} {...g} i={i} />
          ))}
        </ul>
        <ul className="mt-3 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-3 md:gap-4">
          {CHICAS.map((id, i) => (
            <Chica key={id} id={id} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
