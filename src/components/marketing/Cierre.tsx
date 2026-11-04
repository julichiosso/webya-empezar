import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/components/ui/clases';
import { CTA_FINAL } from '@/content/empezar/cta-final';

/** Id del cierre: la barra fija del celular se oculta mientras se ve (ya hay un CTA a la vista). */
export const ID_CTA_FINAL = 'cta-final';

/**
 * Cierre de /empezar a pantalla completa (fondo imagen): la foto bajo el velo (mientras no hay
 * foto, el plano de la escena `cierre`), el titular grande que encastra una vez al entrar en
 * pantalla y el CTA sólido que baja al wizard. Texto alineado a la izquierda, sobre el velo
 * (AA medido en colores.ts); nada de acento en el texto. Componente de servidor salvo la isla
 * mínima del titular.
 */
export function Cierre() {
  return (
    <Seccion
      id={ID_CTA_FINAL}
      fondo="tinta"
      aria-labelledby="cta-final-title"
      className="diferido"
      contenidoClassName="py-20 lg:py-28"
    >
      <div className="max-w-3xl">
        <h2 id="cta-final-title" className="text-display font-semibold text-balance">
          {CTA_FINAL.titulo}
        </h2>
        <p className={cn('mt-6 max-w-lg text-lead', CLASES_SECCION.tinta.secundario)}>
          {CTA_FINAL.bajada}
        </p>
        <div className="mt-10 grid sm:inline-grid">
          <ButtonLink href="#wizard">{CTA_FINAL.cta}</ButtonLink>
        </div>
        <p className={cn('mt-4 text-small', CLASES_SECCION.tinta.secundario)}>{CTA_FINAL.apoyo}</p>
      </div>
    </Seccion>
  );
}
