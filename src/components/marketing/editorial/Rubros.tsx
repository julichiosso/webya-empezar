import type { CSSProperties } from 'react';
import { HERO, NECESITA, RUBROS_HOME, RUTAS } from '@/content/home';
import { Buscador } from './Buscador';
import { Chevron } from './Iconos';
import { TituloPalabras } from './TituloPalabras';

/** Las demos se abren con el asistente ("?guia=1"): la persona pone su nombre enseguida. */
const destino = (href: string) => (href.startsWith(RUTAS.demos + '/') ? RUTAS.conGuia(href) : href);

/**
 * "¿Qué necesita tu negocio?": una sola idea por pantalla. El buscador grande (la persona cuenta su
 * problema con sus palabras) y, abajo, los rubros en filas grandes que abren la demo lista para
 * personalizar (en otra pestaña). Es a donde lleva la píldora del hero.
 */
export function Rubros() {
  const S = NECESITA;
  return (
    <section id={S.id} className="tono-gris a-seccion scroll-mt-14" aria-labelledby="titulo-rubros">
      <div className="e-wrap">
        <div className="text-center">
          <TituloPalabras lineas={[S.titulo]} id="titulo-rubros" className="a-titulo" />
          <p className="a-sub mt-3 text-ed-muted" data-reveal="">
            {S.bajada}
          </p>
        </div>
        <div className="relative z-20 mx-auto mt-8 max-w-2xl md:mt-10" data-reveal="">
          <Buscador />
        </div>
        <ul className="mx-auto mt-10 max-w-4xl border-t border-ed-line md:mt-12">
          {RUBROS_HOME.map((r, i) => (
            <li
              key={r.id}
              className="border-b border-ed-line"
              data-reveal=""
              style={{ '--i': i % 4 } as CSSProperties}
            >
              <a
                href={destino(r.href)}
                target="_blank"
                rel="noopener"
                aria-label={HERO.rubroAria(r.nombre, r.sistema)}
                className="group flex min-h-16 items-center gap-4 py-3 active:opacity-60 sm:min-h-20 sm:py-4"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.25rem] leading-tight font-semibold tracking-[-0.02em] md:text-[1.5rem]">
                    {r.nombre}
                  </span>
                  <span className="mt-1 block text-[1rem] text-ed-muted max-sm:hidden">
                    {r.ejemplo}
                  </span>
                </span>
                <span className="hidden shrink-0 text-[1rem] text-ed-muted sm:block">
                  {r.sistema}
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ed-surface transition-colors group-hover:bg-ed-fg group-hover:text-ed-bg">
                  <Chevron />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
