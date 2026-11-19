import Link from 'next/link';
import { LogoCorchetes } from '@/brand/logo/LogoCorchetes';
import { CTA, HEADER, MARCA } from '@/content/home';
import { Boton } from './Boton';

export const ID_PRINCIPAL = 'contenido';

/**
 * Header fijo: logo `<webya>`, índice (desde tablet horizontal) y el acceso compacto al configurador.
 * Fondo negro plano con una línea fina abajo: sin blur ni sombra.
 */
export function Encabezado({ cta = '#armar' }: { cta?: string }) {
  return (
    <header className="tono-oscuro sticky top-0 z-40 border-b border-ed-line">
      <a
        href={`#${ID_PRINCIPAL}`}
        className="e-btn e-btn-primario e-btn-chico absolute top-2 left-4 z-50 -translate-y-24 focus:translate-y-0"
      >
        {HEADER.saltar}
      </a>
      <div className="e-wrap flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={MARCA.inicio}
          className="-m-2 inline-flex min-h-11 items-center p-2"
        >
          <LogoCorchetes decorativo className="h-[1.375rem] w-auto" />
        </Link>
        <nav aria-label={HEADER.navegacion} className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {HEADER.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="e-link e-link-nav e-chico text-ed-muted hover:text-ed-fg"
                >
                  {l.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Boton href={cta} chico armar="">
          {CTA.armarCorto}
        </Boton>
      </div>
    </header>
  );
}
