import type { ReactNode } from 'react';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { HERO } from '@/content/empezar/hero';

interface HeroProps {
  /** El flujo (pantalla 1 arriba del pliegue): lo compone la página. */
  children: ReactNode;
}

/**
 * Hero de /empezar (crema, plano): un titular y una línea que dice qué hacer; enseguida el creador.
 * La pantalla 1 entra arriba del pliegue también en un celular chico. `overflow-clip!` evita que la
 * sección sea contenedor de scroll y rompa el `sticky` de la vista previa.
 */
export function Hero({ children }: HeroProps) {
  return (
    <Seccion
      fondo="crema"
      aria-labelledby="hero-title"
      className="overflow-clip!"
      contenidoClassName="max-w-xl pt-6 pb-12 sm:pt-12 lg:max-w-page lg:pt-14 lg:pb-16"
    >
      <h1
        id="hero-title"
        className="max-w-3xl text-display font-semibold text-balance sm:text-hero"
      >
        {HERO.titulo}
      </h1>
      <p className={`mt-3 mb-6 max-w-xl text-lead sm:mb-10 ${CLASES_SECCION.crema.secundario}`}>
        {HERO.subtitulo}
      </p>
      {children}
    </Seccion>
  );
}
