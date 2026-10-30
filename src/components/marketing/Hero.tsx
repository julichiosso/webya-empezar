import type { ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { HERO } from '@/content/empezar/hero';

interface HeroProps {
  /** El mockup interactivo, ya conectado a su estado (lo compone la página). */
  mockup: ReactNode;
  /** Acción secundaria junto al CTA (el video explicativo): la compone la página. */
  accion?: ReactNode;
}

/**
 * Hero de /empezar: promesa con su salvedad, CTA que baja al wizard, el enlace a la demo real y el
 * mockup donde se activan módulos. Desde lg va en 2 columnas (texto a la izquierda, mockup a la
 * derecha); en mobile, una columna. No importa features: lo interactivo entra por props.
 */
export function Hero({ mockup, accion }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid gap-12 pt-10 pb-12 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-24 lg:pb-24"
    >
      <div>
        <h1 id="hero-title" className="text-display font-semibold text-balance lg:text-hero">
          {HERO.titulo}
          <span className="block text-muted lg:mt-3 lg:text-hero-sub lg:font-medium">
            {HERO.subtitulo}
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lead text-muted lg:mt-8">{HERO.bajada}</p>
        <div className="mt-8 flex flex-wrap gap-3 lg:mt-10">
          <ButtonLink href="#wizard">
            {HERO.cta}
            <Icon name="arrowDown" size={20} />
          </ButtonLink>
          {accion}
        </div>
        <a
          href="/demo/gastronomia"
          className="-mx-2 mt-2 inline-flex min-h-tap items-center px-2 text-body text-muted underline underline-offset-4 hover:text-fg"
        >
          {HERO.enlaceDemo}
        </a>
        <ul className="mt-8 hidden flex-col gap-4 lg:flex">
          {/* Señales de confianza: promesas que ya cumplimos (solo escritorio). */}
          {HERO.senales.map((s) => (
            <li key={s} className="flex items-center gap-3 text-body text-muted">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-fg">
                <Icon name="check" size={14} />
              </span>
              {s}
            </li>
          ))}
        </ul>
        {/* Pendiente visible hasta que se confirme el plazo de respuesta (no se promete antes). */}
        <p className="mt-4 hidden text-small text-subtle lg:block">{HERO.todoPlazo}</p>
      </div>
      {mockup}
    </section>
  );
}
