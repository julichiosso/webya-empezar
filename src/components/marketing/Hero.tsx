import { BotonExplicativo } from '@/features/explicativo/BotonExplicativo';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { HERO } from '@/content/empezar/hero';
import { HeroMockup } from './HeroMockup';

/**
 * Hero de /empezar: promesa ("Creá"), CTA que baja al wizard y el mockup donde se activan módulos.
 * Desde lg va en 2 columnas (texto a la izquierda, mockup a la derecha); en mobile, una columna.
 */
export function Hero() {
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
          {/* Video explicativo con voz: se descarga recién al tocarlo. */}
          <BotonExplicativo origen="empezar" />
        </div>
        <ul className="mt-10 hidden flex-col gap-4 lg:flex">
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
      </div>
      <HeroMockup />
    </section>
  );
}
