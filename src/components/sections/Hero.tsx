import { Icon } from '../icons/Icon';
import { ButtonLink } from '../ui/Button';

/** Hero de /empezar. La composición vectorial animada se suma en la etapa de secciones. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-10 pb-12 sm:pt-16">
      <h1 id="hero-title" className="text-display font-semibold text-balance">
        Tu negocio, online.
        <span className="block text-muted">Armado para tu rubro.</span>
      </h1>
      <p className="mt-6 max-w-md text-lead text-muted">
        Contanos qué hacés y te armamos lo que necesitás. Sin vueltas.
      </p>
      <ButtonLink href="#wizard" className="mt-8">
        Empezar
        <Icon name="arrowDown" size={20} />
      </ButtonLink>
    </section>
  );
}
