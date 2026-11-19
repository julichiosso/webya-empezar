import type { CSSProperties } from 'react';
import { CTA, HERO, MARCA } from '@/content/home';
import { Boton } from './Boton';
import { TituloPalabras } from './TituloPalabras';

interface Props {
  rotulo?: string;
  titulo?: readonly string[];
  bajada?: string;
  /** Preselección del configurador desde el CTA principal (landings). */
  armar?: string;
  secundario?: { href: string; texto: string; externo?: boolean };
}

/**
 * Hero editorial: rótulo, titular gigante por palabras (anima al cargar, es el LCP), bajada concreta,
 * dos CTA y la zona de atención con el punto de disponibilidad. Componente de servidor.
 */
export function Hero({
  rotulo = HERO.rotulo,
  titulo = HERO.titulo,
  bajada = HERO.bajada,
  armar,
  secundario = { href: '#proyectos', texto: CTA.proyectos },
}: Props) {
  return (
    <section className="tono-oscuro" aria-labelledby="titulo-hero">
      <div className="e-wrap grid grid-cols-12 gap-x-6 pt-14 pb-16 md:pt-24 md:pb-24 lg:pt-28">
        <p
          className="e-rotulo e-hero-aparece col-span-12 text-ed-muted"
          style={{ '--i': 0 } as CSSProperties}
        >
          {rotulo}
        </p>
        <TituloPalabras
          as="h1"
          id="titulo-hero"
          lineas={titulo}
          alCargar
          className="e-display col-span-12 mt-6 md:mt-8"
        />
        <div className="col-span-12 mt-10 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-14">
          <p
            className="e-lead e-hero-aparece col-span-12 max-w-[46ch] text-ed-muted md:col-span-7 lg:col-span-6"
            style={{ '--i': 1 } as CSSProperties}
          >
            {bajada}
          </p>
          <div
            className="e-hero-aparece col-span-12 flex flex-col gap-3 sm:flex-row md:col-span-5 md:justify-end md:self-end lg:col-span-6"
            style={{ '--i': 2 } as CSSProperties}
          >
            <Boton href="#armar" armar={armar ?? ''} iman>
              {CTA.armar}
            </Boton>
            <Boton
              href={secundario.href}
              variante="secundario"
              icono={false}
              externo={secundario.externo}
            >
              {secundario.texto}
            </Boton>
          </div>
        </div>
        <div
          className="e-hero-aparece col-span-12 mt-14 flex flex-col gap-3 border-t border-ed-line pt-5 sm:flex-row sm:items-center sm:justify-between md:mt-20"
          style={{ '--i': 3 } as CSSProperties}
        >
          <p className="e-chico flex items-center gap-3">
            <span className="e-punto" aria-hidden="true" />
            <span>{MARCA.zona}</span>
          </p>
          <p className="e-chico text-ed-muted">{HERO.disponibilidad}</p>
        </div>
      </div>
    </section>
  );
}
