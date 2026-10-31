import type { ReactNode } from 'react';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { ASI_SE_ARMA } from '@/content/empezar/asi-se-arma';

const C = CLASES_SECCION.imagen;

interface AsiSeArmaProps {
  /** Acción secundaria (el video "Mirá cómo funciona"): la pone la página, que puede importar features. */
  accion?: ReactNode;
}

/**
 * "Así se arma" (dirección Plano, imagen a pantalla completa con velo): el hero secundario. Mientras
 * no hay foto (`fuente: null`) se ve el plano de la escena `hero` terminado, con la pieza que
 * encastra. El texto va abajo (a la derecha en escritorio), sobre el velo (AA medido contra una foto blanca), sin
 * texto de acento. Dice quién hace qué: beneficio primero, después cómo.
 *
 * Acá vive el video explicativo: explica justamente cómo se arma, y lejos del hero no le compite al
 * creador (el CTA de la página es elegir un rubro).
 */
export function AsiSeArma({ accion }: AsiSeArmaProps) {
  return (
    <Seccion
      fondo="imagen"
      aria-labelledby="asi-se-arma-title"
      pantallaCompleta
      imagen={{ fuente: null, alt: ASI_SE_ARMA.alt, escena: 'hero' }}
      className="content-end!"
      contenidoClassName="pb-16 pt-48 lg:pb-24"
    >
      {/* En escritorio el texto va abajo a la derecha: deja a la vista el plano (o la foto) a la izquierda. */}
      <div className="max-w-xl lg:ml-auto lg:max-w-lg">
        <h2 id="asi-se-arma-title" className="text-display font-semibold text-balance">
          {ASI_SE_ARMA.titulo}
        </h2>
        <p className={`mt-6 max-w-md text-lead ${C.secundario}`}>{ASI_SE_ARMA.bajada}</p>
        {accion && <div className="mt-8">{accion}</div>}
      </div>
    </Seccion>
  );
}
