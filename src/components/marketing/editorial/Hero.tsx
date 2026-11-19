import type { CSSProperties } from 'react';
import { DEMOS } from '@/content/demos/hub';
import { CTA, HERO, MARCA } from '@/content/home';
import { Boton } from './Boton';
import { Flecha } from './Iconos';
import { TituloPalabras } from './TituloPalabras';

interface Props {
  rotulo?: string;
  titulo?: readonly string[];
  bajada?: string;
  /** Preselección del configurador desde el CTA principal (landings). */
  armar?: string;
  secundario?: { href: string; texto: string; externo?: boolean };
  /**
   * Home: el CTA principal es "Ver demos" (probar antes de pedir) y abajo van las dos demos, directas.
   * En las landings, el principal sigue siendo armar el sistema.
   */
  demos?: boolean;
}

/**
 * Hero editorial: rótulo, titular por palabras (anima al cargar, es el LCP), bajada concreta, dos CTA y
 * la zona de atención. La home usa la versión con las demos; las landings, la de "Armá tu sistema".
 */
export function Hero(props: Props) {
  return props.demos ? <HeroDemos /> : <HeroLanding {...props} />;
}

/**
 * Hero de la home: todo lo que importa entra en la primera pantalla, en celular y en escritorio. A la
 * izquierda el mensaje y los dos CTA ("Ver demos" primero: probar antes de pedir); a la derecha las dos
 * demos, directas. Abajo, la zona de atención con el link al mapa.
 */
function HeroDemos() {
  return (
    <section className="tono-oscuro" aria-labelledby="titulo-hero">
      <div className="e-wrap grid grid-cols-12 gap-x-6 pt-8 pb-8 lg:items-center lg:gap-x-12 lg:pt-14 lg:pb-12">
        <div className="col-span-12 lg:col-span-7 xl:col-span-8">
          <p
            className="e-rotulo e-hero-aparece text-ed-muted"
            style={{ '--i': 0 } as CSSProperties}
          >
            {HERO.rotulo}
          </p>
          <TituloPalabras
            as="h1"
            id="titulo-hero"
            lineas={HERO.titulo}
            alCargar
            className="e-display e-hero-compacto mt-4 lg:mt-6"
          />
          <p
            className="e-lead e-hero-aparece mt-5 max-w-[44ch] text-ed-muted lg:mt-7"
            style={{ '--i': 1 } as CSSProperties}
          >
            <span className="sm:hidden">{HERO.bajadaCorta}</span>
            <span className="max-sm:hidden">{HERO.bajada}</span>
          </p>
          <div
            className="e-hero-aparece mt-6 grid grid-cols-2 gap-3 sm:flex lg:mt-8"
            style={{ '--i': 2 } as CSSProperties}
          >
            <Boton href="/demo" externo>
              {CTA.verDemos}
            </Boton>
            <Boton href="#armar" armar="" variante="secundario" icono={false}>
              {CTA.armar}
            </Boton>
          </div>
        </div>
        <div
          className="e-hero-aparece col-span-12 mt-8 lg:col-span-5 lg:mt-0 xl:col-span-4"
          style={{ '--i': 3 } as CSSProperties}
        >
          <p className="e-rotulo text-ed-muted">{HERO.probar}</p>
          <ul className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-1 lg:gap-3">
            {DEMOS.map((d) => (
              <li key={d.id}>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noopener"
                  className="group flex h-full flex-col items-start gap-2.5 rounded-2xl border border-ed-line p-3 transition-colors hover:border-ed-fg hover:bg-ed-surface sm:flex-row sm:items-center sm:gap-3 lg:items-start lg:gap-4 lg:p-5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ed-fg text-ed-bg lg:size-12">
                    <IconoDemo id={d.id} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.875rem] leading-tight font-semibold md:text-[0.9375rem] lg:text-[1.0625rem]">
                      {d.titulo}
                    </span>
                    <span className="mt-0.5 block text-[0.75rem] leading-snug text-ed-muted lg:hidden">
                      {d.rubro}
                    </span>
                    <span className="mt-1 hidden text-[0.8125rem] leading-snug text-ed-muted lg:block">
                      {d.texto}
                    </span>
                    <span className="mt-3 hidden items-center gap-1.5 text-[0.8125rem] font-medium lg:inline-flex">
                      {HERO.abrirDemo}
                      <Flecha />
                    </span>
                  </span>
                  <span className="sr-only">{HERO.abrir}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="e-wrap">
        <div className="flex flex-col gap-2 border-t border-ed-line py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="e-chico flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="e-punto" aria-hidden="true" />
            <span>{MARCA.zona}</span>
            <a href="#zona" className="e-link e-link-nav text-ed-muted hover:text-ed-fg">
              {HERO.verZona}
            </a>
          </p>
          <p className="e-chico text-ed-muted">{HERO.disponibilidad}</p>
        </div>
      </div>
    </section>
  );
}

/** Hero de las landings: titular grande, bajada, "Armá tu sistema" como principal y la zona. */
function HeroLanding({
  rotulo = HERO.rotulo,
  titulo = HERO.titulo,
  bajada = HERO.bajada,
  armar,
  secundario = { href: '#proyectos', texto: CTA.proyectos },
}: Props) {
  return (
    <section className="tono-oscuro" aria-labelledby="titulo-hero">
      <div className="e-wrap grid grid-cols-12 gap-x-6 pt-8 pb-10 md:pt-24 md:pb-24 lg:pt-28">
        <p
          className="e-rotulo e-hero-aparece col-span-12 text-ed-muted"
          style={{ '--i': 0 } as CSSProperties}
        >
          {rotulo}
        </p>
        <TituloPalabras
          as="h1"
          id="titulo-hero"
          lineas={titulo}
          alCargar
          className="e-display e-hero-titulo col-span-12 mt-4 md:mt-8"
        />
        <div className="col-span-12 mt-6 grid grid-cols-12 gap-x-6 gap-y-6 md:mt-14 md:gap-y-8">
          <p
            className="e-lead e-hero-aparece col-span-12 max-w-[46ch] text-ed-muted md:col-span-7 lg:col-span-6"
            style={{ '--i': 1 } as CSSProperties}
          >
            {bajada}
          </p>
          <div
            className="e-hero-aparece col-span-12 flex flex-col gap-3 sm:flex-row md:col-span-5 md:justify-end md:self-end lg:col-span-6"
            style={{ '--i': 2 } as CSSProperties}
          >
            <Boton href="#armar" armar={armar ?? ''}>
              {CTA.armar}
            </Boton>
            <Boton
              href={secundario.href}
              variante="secundario"
              icono={false}
              externo={secundario.externo}
            >
              {secundario.texto}
            </Boton>
          </div>
        </div>
        <div
          className="e-hero-aparece col-span-12 mt-8 flex flex-col gap-3 border-t border-ed-line pt-5 sm:flex-row sm:items-center sm:justify-between md:mt-20"
          style={{ '--i': 3 } as CSSProperties}
        >
          <p className="e-chico flex items-center gap-3">
            <span className="e-punto" aria-hidden="true" />
            <span>{MARCA.zona}</span>
          </p>
          <p className="e-chico text-ed-muted">{HERO.disponibilidad}</p>
        </div>
      </div>
    </section>
  );
}

/** El ícono de cada demo: la bolsa del pedido o el calendario del turno. */
function IconoDemo({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {id === 'pedidos' ? (
        <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" />
      ) : (
        <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4" />
      )}
    </svg>
  );
}
