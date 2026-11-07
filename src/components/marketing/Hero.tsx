import type { ReactNode } from 'react';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { cn } from '@/components/ui/clases';
import { HERO } from '@/content/empezar/hero';
import { CLIENTES } from '@/content/clientes';

const C = CLASES_SECCION.tinta;

interface HeroProps {
  /** El flujo (pantalla 1 arriba del pliegue): lo compone la página. */
  children: ReactNode;
}

/**
 * Hero de /empezar, en tinta a todo el ancho: la promesa, el creador y el celular con el sitio. Debajo,
 * la prueba: negocios reales y las dos demos que se pueden tocar. `overflow-clip!` evita que la sección
 * sea contenedor de scroll y rompa el `sticky` del celular.
 */
export function Hero({ children }: HeroProps) {
  return (
    <Seccion
      fondo="tinta"
      aria-labelledby="hero-title"
      className="overflow-clip!"
      contenidoClassName="pt-6 pb-10 sm:pt-12 lg:px-8 lg:pt-10 lg:pb-14 lg:bajo:pt-6 lg:bajo:pb-8"
    >
      {children}
      <div
        className={cn(
          'mt-10 grid gap-2 border-t pt-2 text-small lg:mt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8 lg:bajo:mt-4',
          C.linea,
        )}
      >
        <p className={cn('flex flex-wrap items-center gap-x-2', C.secundario)}>
          {HERO.prueba.antes}
          <a
            href="#ya-lo-usan"
            className={cn(
              'inline-flex min-h-tap items-center font-medium underline underline-offset-4',
              C.texto,
            )}
          >
            {new Intl.ListFormat('es-AR').format(CLIENTES.map((c) => c.nombre))}
          </a>
        </p>
        <p className={cn('flex flex-wrap items-center gap-x-2 lg:justify-end', C.secundario)}>
          {HERO.demos.antes}
          {HERO.demos.enlaces.map((d, i) => (
            <span key={d.href} className="inline-flex items-center gap-x-2">
              {i > 0 && HERO.demos.separador}
              <a
                href={d.href}
                className={cn(
                  'inline-flex min-h-tap items-center font-medium underline underline-offset-4',
                  C.texto,
                )}
              >
                {d.texto}
              </a>
            </span>
          ))}
        </p>
      </div>
    </Seccion>
  );
}

/** El titular y la bajada: los dibuja el marco del flujo, en la primera pantalla. */
export function TituloHero() {
  return (
    <div className="mb-6 lg:mb-10 lg:bajo:mb-5">
      <h1 id="hero-title" className="text-display font-semibold text-balance">
        {HERO.titulo}
      </h1>
      <p className={cn('mt-4 max-w-xl text-lead', C.secundario)}>{HERO.subtitulo}</p>
    </div>
  );
}
