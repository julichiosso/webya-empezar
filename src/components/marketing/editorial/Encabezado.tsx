import Link from 'next/link';
import { LogoWebya } from '@/brand/logo/LogoWebya';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { CTA, HEADER, MARCA, RUTAS } from '@/content/home';
import { Boton } from './Boton';
import { enlaceContacto } from './contacto';
import { MenuMovil } from './MenuMovil';

export const ID_PRINCIPAL = 'contenido';

/**
 * Header fijo: logo `<webya>`, los productos y proyectos (escritorio), Demos y "Armá tu sistema". En el
 * celular, el logo y el menú a un toque (los atajos de acción viven en la barra de abajo).
 * Fondo negro plano con una línea fina abajo: sin blur ni sombra.
 */
export function Encabezado() {
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
          <LogoWebya decorativo className="h-6 w-auto" />
        </Link>
        <nav aria-label={HEADER.navegacion} className="hidden lg:block">
          <ul className="flex items-center gap-7">
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
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={RUTAS.demos}
            target="_blank"
            rel="noopener"
            aria-label={`${HEADER.demos}${CTA.pestana}`}
            className="e-link e-link-nav e-chico flex min-h-11 items-center px-2 text-ed-muted hover:text-ed-fg"
          >
            {HEADER.demos}
          </a>
          <Boton href={RUTAS.armar} chico>
            {CTA.armar}
          </Boton>
        </div>
        <MenuMovil contacto={enlaceContacto(MENSAJE_CONTACTO).href} />
      </div>
    </header>
  );
}
