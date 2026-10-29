import { Icon } from '../icons/Icon';
import { ButtonLink } from '../ui/Button';
import { HeroMockup } from './HeroMockup';

/**
 * Señales de confianza del hero (solo escritorio). Son promesas que ya cumplimos, sin sellos,
 * métricas ni testimonios.
 */
const SENALES = [
  'Sin saber de tecnología',
  'Armado para tu rubro',
  'Te respondemos en menos de 24 hs',
];

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
          Creá tu negocio online.
          <span className="block text-muted lg:mt-3 lg:text-hero-sub lg:font-medium">
            Elegí tu rubro. Activá lo que necesitás.
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lead text-muted lg:mt-8">
          Turnos, tienda, carta, pagos: sumá solo las piezas que tu negocio necesita.
        </p>
        <ButtonLink href="#wizard" className="mt-8 lg:mt-10">
          Empezar a crear
          <Icon name="arrowDown" size={20} />
        </ButtonLink>
        <ul className="mt-10 hidden flex-col gap-4 lg:flex">
          {SENALES.map((s) => (
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
