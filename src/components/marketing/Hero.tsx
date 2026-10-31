import type { ReactNode } from 'react';
import { HERO } from '@/content/empezar/hero';

interface HeroProps {
  /** El flujo (pantalla 1 arriba del pliegue): lo compone la página. */
  children: ReactNode;
}

/**
 * Hero de /empezar: el titular y, enseguida, el flujo. La pantalla 1 ("¿Qué negocio tenés?")
 * tiene que entrar arriba del pliegue también en un iPhone SE, así que el titular es corto y en
 * celular va un escalón más chico. No importa features: el flujo entra por `children`.
 */
export function Hero({ children }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="pt-3 pb-12 sm:pt-10 lg:pt-8 lg:pb-24 lg:bajo:pt-2">
      {/* En celular el titular va chico: la pantalla 1 (la pregunta y los rubros) manda arriba del pliegue. */}
      <h1
        id="hero-title"
        className="mb-3 text-body font-semibold text-balance sm:mb-8 sm:text-display lg:mb-6 lg:text-hero lg:bajo:mb-4"
      >
        {HERO.titulo}
        <span className="block text-muted sm:text-title lg:mt-1 lg:text-hero-sub">
          {HERO.subtitulo}
        </span>
      </h1>
      {children}
    </section>
  );
}
