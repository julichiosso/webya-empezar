import type { CSSProperties } from 'react';
import { HERO, RUBROS_HOME, SECCIONES } from '@/content/home';
import { Buscador } from './Buscador';
import { TituloPalabras } from './TituloPalabras';

/**
 * "¿Cuál es tu rubro?": encontrar lo suyo en un toque. El buscador (escribe con sus palabras) y, abajo,
 * cada rubro como un chip que abre su demo en otra pestaña.
 */
export function Rubros() {
  const S = SECCIONES.rubros;
  return (
    <section id={S.id} className="tono-gris a-seccion" aria-labelledby="titulo-rubros">
      <div className="e-wrap flex flex-col items-center text-center">
        <TituloPalabras lineas={[S.titulo]} id="titulo-rubros" className="a-titulo" />
        <p className="a-sub mt-3 text-ed-muted" data-reveal="">
          {S.bajada}
        </p>
        <div className="relative z-20 mt-8 w-full max-w-xl text-left" data-reveal="">
          <Buscador compacto />
        </div>
        <ul className="mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {RUBROS_HOME.map((r, i) => (
            <li key={r.id} data-reveal="" style={{ '--i': i % 4 } as CSSProperties}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener"
                aria-label={HERO.rubroAria(r.nombre, r.sistema)}
                className="a-chip"
              >
                {r.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
