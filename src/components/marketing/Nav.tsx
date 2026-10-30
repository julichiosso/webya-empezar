import { Logo } from '@/brand/logo/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { NAV } from '@/content/empezar/nav';

/** Id del <main> de /empezar: destino del enlace "Saltar al contenido". */
export const ID_CONTENIDO = 'contenido';

/**
 * Nav mínima de /empezar: el logo (que se arma una vez) y UN solo CTA, el mismo del hero. Sin menú:
 * cada enlace más es una decisión más antes del wizard. El primer foco es "Saltar al contenido".
 */
export function Nav() {
  return (
    <header className="mx-auto w-full max-w-xl px-4 pt-6 lg:max-w-page lg:px-8 lg:pt-8">
      <a
        href={`#${ID_CONTENIDO}`}
        className="sr-only rounded-control bg-surface px-4 text-body text-fg focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:min-h-tap focus:items-center"
      >
        {NAV.saltar}
      </a>
      <nav aria-label={NAV.aria} className="flex items-center justify-between gap-4">
        <a
          href="/empezar"
          aria-label={NAV.inicio}
          className="-mx-2 inline-flex min-h-tap items-center px-2"
        >
          <Logo armar />
        </a>
        <ButtonLink href="#wizard" variante="secundario" tamanio="compacto">
          {NAV.cta}
        </ButtonLink>
      </nav>
    </header>
  );
}
