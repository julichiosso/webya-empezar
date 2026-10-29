import { Icon } from '../icons/Icon';
import { ButtonLink } from '../ui/Button';
import { HeroMockup } from './HeroMockup';

/** Hero de /empezar: promesa ("Creá"), CTA que baja al wizard y el mockup donde se activan módulos. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-10 pb-12 sm:pt-16">
      <h1 id="hero-title" className="text-display font-semibold text-balance">
        Creá tu negocio online.
        <span className="block text-muted">Elegí tu rubro y armalo ahora.</span>
      </h1>
      <p className="mt-6 max-w-md text-lead text-muted">
        Turnos, tienda, carta, pagos. Activá solo lo que tu negocio necesita.
      </p>
      <ButtonLink href="#wizard" className="mt-8">
        Empezar a crear
        <Icon name="arrowDown" size={20} />
      </ButtonLink>
      <div className="mt-12">
        <HeroMockup />
      </div>
    </section>
  );
}
