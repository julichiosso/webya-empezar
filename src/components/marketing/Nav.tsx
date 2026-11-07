import { Logo } from '@/brand/logo/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/components/ui/clases';
import { NAV } from '@/content/empezar/nav';

/** Id del <main> de /empezar: destino del enlace "Saltar al contenido". */
export const ID_CONTENIDO = 'contenido';

const ENLACE =
  'hidden min-h-tap items-center px-2 text-small font-semibold underline-offset-4 hover:underline';

/** En celular solo queda el CTA: las secciones se recorren bajando. */
const ENLACES = [
  { href: '#que-hacemos', texto: NAV.queHacemos, clase: 'lg:inline-flex' },
  { href: '#ya-lo-usan', texto: NAV.ejemplos, clase: 'sm:inline-flex' },
  { href: '#como-trabajamos', texto: NAV.comoTrabajamos, clase: 'lg:inline-flex' },
  { href: '#productos', texto: NAV.demos, clase: 'sm:inline-flex' },
];

/**
 * Barra superior de /empezar: fija arriba, fondo crema con una línea abajo, el logo a la izquierda
 * y a la derecha las secciones de la empresa y el CTA único. Sin interruptores: lo que no ayuda a
 * empezar no está. El primer foco es "Saltar al contenido".
 */
export function Nav() {
  return (
    <header className="superficie-tinta sticky top-0 z-30 border-b border-seccion-tinta-linea bg-seccion-tinta text-seccion-tinta-fg">
      <a
        href={`#${ID_CONTENIDO}`}
        className="sr-only rounded-control bg-surface px-4 text-body text-fg focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:min-h-tap focus:items-center"
      >
        {NAV.saltar}
      </a>
      <nav
        aria-label={NAV.aria}
        className="mx-auto flex h-16 w-full max-w-xl items-center gap-3 px-4 lg:max-w-page lg:px-8"
      >
        <a
          href="/empezar"
          aria-label={NAV.inicio}
          className="-mx-2 mr-auto inline-flex min-h-tap items-center px-2"
        >
          <Logo armar />
        </a>
        {ENLACES.map((e) => (
          <a key={e.href} href={e.href} className={cn(ENLACE, e.clase)}>
            {e.texto}
          </a>
        ))}
        <ButtonLink href="#wizard" tamanio="compacto">
          {NAV.cta}
        </ButtonLink>
      </nav>
    </header>
  );
}
