import type { CSSProperties } from 'react';
import { TituloPalabras } from './TituloPalabras';

const aparece = (i: number) => ({ '--i': i }) as CSSProperties;

interface HeroPaginaProps {
  rotulo: string;
  titulo: readonly string[];
  bajada?: string;
  /** Botones u otro contenido debajo de la bajada. */
  children?: React.ReactNode;
  /** Abajo, a todo el ancho: la vidriera de trabajos hechos. */
  vidriera?: React.ReactNode;
}

/**
 * Hero de las páginas propias (productos, proyectos, nosotros, zona), como la portada de un producto:
 * nombre, titular grande y centrado, una línea y las acciones. La vidriera va abajo, a todo el ancho.
 */
export function HeroPagina({ rotulo, titulo, bajada, children, vidriera }: HeroPaginaProps) {
  return (
    <section className="tono-claro overflow-hidden" aria-labelledby="titulo-hero">
      <div className="e-wrap flex flex-col items-center pt-10 pb-12 text-center md:pt-16 md:pb-16">
        <p className="a-ceja e-hero-aparece text-ed-muted" style={aparece(0)}>
          {rotulo}
        </p>
        <TituloPalabras
          as="h1"
          id="titulo-hero"
          lineas={titulo}
          alCargar
          className="a-hero mt-2 max-w-[16ch] md:mt-3"
        />
        {bajada ? (
          <p
            className="a-sub e-hero-aparece mt-4 max-w-[36ch] text-ed-muted md:mt-5"
            style={aparece(1)}
          >
            {bajada}
          </p>
        ) : null}
        {children ? (
          <div
            className="e-hero-aparece mt-7 flex flex-wrap justify-center gap-3"
            style={aparece(2)}
          >
            {children}
          </div>
        ) : null}
      </div>
      {vidriera ? (
        <div className="e-hero-aparece e-wrap pb-14 md:pb-20" style={aparece(3)}>
          {vidriera}
        </div>
      ) : null}
    </section>
  );
}
