import type { ReactNode } from 'react';
import { Seccion } from '@/components/patterns/Seccion';
import { TituloEncastre } from '@/components/ui/TituloEncastre';
import { HERO } from '@/content/empezar/hero';

interface HeroProps {
  /** El flujo (pantalla 1 arriba del pliegue): lo compone la página. */
  children: ReactNode;
}

/**
 * Hero de /empezar (dirección Plano, fondo tinta con el plano acotado): el titular que encastra y,
 * enseguida, el creador. La pantalla 1 ("¿Qué negocio tenés?") tiene que entrar arriba del pliegue
 * también en un iPhone SE (320 × 568), así que en celular el titular va chico y pegado al flujo.
 *
 * Composición asimétrica en escritorio: el titular pesa a la izquierda y la salvedad queda liviana
 * a la derecha, apoyada en la misma línea de base; abajo, el creador (pantalla ancha + vista previa
 * angosta). Sin JS: TituloEncastre en modo `carga` es CSS puro y el titular se lee desde el primer
 * cuadro (LCP). No importa features: el flujo entra por `children`.
 *
 * `overflow-clip!`: la sección por defecto recorta con `overflow: hidden`, que la volvería
 * contenedor de scroll y rompería la vista previa `sticky` del creador; `clip` recorta igual sin eso.
 */
export function Hero({ children }: HeroProps) {
  return (
    <Seccion
      fondo="tinta"
      plano="cotas"
      aria-labelledby="hero-title"
      className="overflow-clip!"
      contenidoClassName="max-w-xl pt-3 pb-12 sm:pt-10 lg:max-w-page lg:pt-10 lg:pb-16 lg:bajo:pt-6 lg:bajo:pb-12"
    >
      <div className="mb-3 sm:mb-8 lg:mb-8 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:bajo:mb-4">
        <TituloEncastre
          nivel={1}
          id="hero-title"
          entrada="carga"
          texto={HERO.titulo}
          className="text-body font-semibold sm:text-display lg:text-hero"
        />
        <p
          id="hero-salvedad"
          className="text-body font-semibold text-seccion-tinta-muted sm:mt-2 sm:text-title lg:mt-0 lg:shrink-0 lg:pb-1 lg:text-lead lg:font-normal"
        >
          {HERO.subtitulo}
        </p>
      </div>
      {children}
    </Seccion>
  );
}
