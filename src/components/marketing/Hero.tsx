import type { ReactNode } from 'react';
import { Seccion } from '@/components/patterns/Seccion';
import { HERO } from '@/content/empezar/hero';

interface HeroProps {
  /** El flujo (pantalla 1 arriba del pliegue): lo compone la página. */
  children: ReactNode;
}

/**
 * Hero de /empezar (fondo crema, plano): la pregunta y, enseguida, el creador. La pantalla 1 tiene
 * que entrar arriba del pliegue también en un celular chico, así que el título es corto y va pegado
 * al flujo. `overflow-clip!` evita que la sección sea contenedor de scroll y rompa el `sticky` de la
 * vista previa.
 */
export function Hero({ children }: HeroProps) {
  return (
    <Seccion
      fondo="crema"
      aria-labelledby="hero-title"
      className="overflow-clip!"
      contenidoClassName="max-w-xl pt-3 pb-12 sm:pt-10 lg:max-w-page lg:pt-10 lg:pb-16 lg:bajo:pt-6 lg:bajo:pb-12"
    >
      <h1
        id="hero-title"
        className="mb-3 text-title font-semibold text-balance sm:mb-8 sm:text-display lg:text-hero"
      >
        {HERO.titulo}
      </h1>
      {children}
    </Seccion>
  );
}
