import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CTA, HERO, MARCA, RUBROS_HOME, RUTAS } from '@/content/home';
import { Boton } from './Boton';
import { PROYECTOS } from '@/content/proyectos';
import { TituloPalabras } from './TituloPalabras';

const aparece = (i: number) => ({ '--i': i }) as CSSProperties;

/** Prueba al toque: los negocios que ya trabajan con su sistema. */
const EN_PRODUCCION = PROYECTOS.filter((p) => p.estado === 'produccion');

/**
 * Hero de la home: una idea, dos CTA y, al lado (abajo en el celular), "Elegí tu rubro": cada rubro
 * abre su demo. Todo entra en la primera pantalla. Debajo, una sola franja con la zona de atención.
 */
export function HeroInicio() {
  return (
    <section className="tono-oscuro" aria-labelledby="titulo-hero">
      <div className="e-wrap grid grid-cols-12 gap-x-6 pt-7 pb-7 lg:items-center lg:gap-x-12 lg:pt-16 lg:pb-14">
        <div className="col-span-12 lg:col-span-7">
          <TituloPalabras
            as="h1"
            id="titulo-hero"
            lineas={HERO.titulo}
            alCargar
            className="e-display e-hero-compacto max-w-[17ch]"
          />
          <p
            // Sin animación de entrada: es el LCP de la home y se pinta en el primer cuadro.
            className="e-lead mt-4 max-w-[40ch] text-ed-muted lg:mt-6"
          >
            {HERO.bajada}
          </p>
          <div
            className="e-hero-aparece mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3 lg:mt-8"
            style={aparece(2)}
          >
            <Boton href={RUTAS.armar}>{CTA.armar}</Boton>
            <Boton href={RUTAS.demos} variante="secundario" externo icono={false}>
              {CTA.verDemo}
            </Boton>
          </div>
        </div>
        <div className="e-hero-aparece col-span-12 mt-7 lg:col-span-5 lg:mt-0" style={aparece(3)}>
          <p className="e-rotulo text-ed-muted">{HERO.rubros}</p>
          <ul className="mt-2">
            {RUBROS_HOME.map((r) => (
              <li key={r.id} className="">
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={HERO.rubroAria(r.nombre, r.sistema)}
                  className="e-fila group relative flex min-h-12 items-center gap-4 rounded-xl py-2 active:opacity-60 lg:min-h-16"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] leading-tight font-medium lg:text-[1.0625rem]">
                      {r.nombre}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.75rem] text-ed-muted lg:text-[0.8125rem]">
                      {r.ejemplo}
                    </span>
                  </span>
                  <span className="e-fila-rol e-chico hidden shrink-0 text-ed-muted sm:inline-grid">
                    <span>{r.sistema}</span>
                    <span aria-hidden="true" className="font-medium text-ed-fg">
                      {HERO.probar}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="e-wrap">
        <div className="e-chico flex flex-col gap-2 py-4 text-ed-muted lg:flex-row lg:items-center lg:justify-between">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{MARCA.zona}</span>
            <Link href={RUTAS.zona} className="e-link text-ed-fg">
              {HERO.verZona}
            </Link>
          </p>
          <p>
            {HERO.confianza}{' '}
            {EN_PRODUCCION.map((p, i) => (
              <span key={p.id}>
                {i > 0 ? ' · ' : null}
                <Link
                  href={`${RUTAS.proyectos}#proyecto-${p.id}`}
                  className="e-link e-link-nav text-ed-fg"
                >
                  {p.cliente}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

interface HeroPaginaProps {
  rotulo: string;
  titulo: readonly string[];
  bajada?: string;
  /** Botones u otro contenido debajo de la bajada. */
  children?: React.ReactNode;
  /** A la derecha (abajo en el celular): la vidriera de trabajos hechos. */
  vidriera?: React.ReactNode;
}

/** Hero de las páginas propias (productos, proyectos, nosotros, zona): rótulo, titular, bajada y CTA. */
export function HeroPagina({ rotulo, titulo, bajada, children, vidriera }: HeroPaginaProps) {
  return (
    <section className="tono-oscuro overflow-hidden" aria-labelledby="titulo-hero">
      <div
        className={
          vidriera
            ? 'e-wrap grid grid-cols-12 gap-y-10 pt-8 pb-10 md:pt-14 md:pb-14 lg:items-center lg:gap-x-10 lg:pt-16'
            : 'e-wrap pt-8 pb-10 md:pt-16 md:pb-16 lg:pt-20'
        }
      >
        <div className={vidriera ? 'col-span-12 min-w-0 lg:col-span-6' : undefined}>
          <p className="e-rotulo e-hero-aparece text-ed-muted" style={aparece(0)}>
            {rotulo}
          </p>
          <TituloPalabras
            as="h1"
            id="titulo-hero"
            lineas={titulo}
            alCargar
            className="e-display e-hero-compacto mt-4 max-w-[18ch] md:mt-6"
          />
          {bajada ? (
            <p
              className="e-lead e-hero-aparece mt-5 max-w-[46ch] text-ed-muted md:mt-7"
              style={aparece(1)}
            >
              {bajada}
            </p>
          ) : null}
          {children ? (
            <div
              className="e-hero-aparece mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3 md:mt-8"
              style={aparece(2)}
            >
              {children}
            </div>
          ) : null}
        </div>
        {vidriera ? (
          <div className="e-hero-aparece col-span-12 min-w-0 lg:col-span-6" style={aparece(3)}>
            {vidriera}
          </div>
        ) : null}
      </div>
    </section>
  );
}
