import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { DEMOS } from '@/content/demos/hub';
import { CTA, HERO, MARCA } from '@/content/home';
import { Boton } from './Boton';
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
 * Hero editorial: rótulo, titular gigante por palabras (anima al cargar, es el LCP), bajada concreta,
 * dos CTA y la zona de atención con el punto de disponibilidad. Componente de servidor.
 */
export function Hero({
  rotulo = HERO.rotulo,
  titulo = HERO.titulo,
  bajada = HERO.bajada,
  armar,
  secundario = { href: '#proyectos', texto: CTA.proyectos },
  demos = false,
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
            {demos ? (
              <>
                <span className="sm:hidden">{HERO.bajadaCorta}</span>
                <span className="max-sm:hidden">{bajada}</span>
              </>
            ) : (
              bajada
            )}
          </p>
          <div
            className={cn(
              'e-hero-aparece col-span-12 gap-3 sm:flex sm:flex-row md:col-span-5 md:justify-end md:self-end lg:col-span-6',
              demos ? 'grid grid-cols-2' : 'flex flex-col',
            )}
            style={{ '--i': 2 } as CSSProperties}
          >
            {demos ? (
              <>
                <Boton href="/demo" externo iman>
                  {CTA.verDemos}
                </Boton>
                <Boton href="#armar" armar="" variante="secundario" icono={false}>
                  {CTA.armar}
                </Boton>
              </>
            ) : (
              <>
                <Boton href="#armar" armar={armar ?? ''} iman>
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
              </>
            )}
          </div>
        </div>
        {demos ? (
          <div
            className="e-hero-aparece col-span-12 mt-8 md:mt-14"
            style={{ '--i': 3 } as CSSProperties}
          >
            <p className="e-rotulo text-ed-muted">{HERO.probar}</p>
            <ul className="mt-3 grid grid-cols-2 gap-2.5 md:max-w-[40rem] md:gap-3">
              {DEMOS.map((d) => (
                <li key={d.id}>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener"
                    className="group flex h-full flex-col items-start gap-2.5 rounded-2xl border border-ed-line p-3 transition-colors hover:border-ed-fg sm:flex-row sm:items-center sm:gap-3 md:p-4"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ed-fg text-ed-bg">
                      <IconoDemo id={d.id} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.875rem] leading-tight font-semibold md:text-[0.9375rem]">
                        {d.titulo}
                      </span>
                      <span className="mt-0.5 block text-[0.75rem] leading-snug text-ed-muted">
                        {d.rubro}
                      </span>
                    </span>
                    <span className="sr-only">{HERO.abrir}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
