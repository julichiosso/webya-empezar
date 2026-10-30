import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { CTA_FINAL } from '@/content/empezar/cta-final';

/** Id del cierre: la barra fija del celular se oculta mientras se ve (ya hay un CTA a la vista). */
export const ID_CTA_FINAL = 'cta-final';

/** Cierre de /empezar, antes del pie: recapitula y repite el CTA principal. */
export function CtaFinal() {
  return (
    <section
      id={ID_CTA_FINAL}
      aria-labelledby="cta-final-title"
      className="reveal mt-24 rounded-panel border border-line bg-surface p-6 text-center shadow-raised sm:p-10 lg:mt-32 lg:p-16"
    >
      <h2 id="cta-final-title" className="text-title font-semibold text-balance">
        {CTA_FINAL.titulo}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-lead text-muted">{CTA_FINAL.bajada}</p>
      <div className="mt-8 grid sm:inline-grid">
        <ButtonLink href="#wizard">
          {CTA_FINAL.cta}
          <Icon name="arrowRight" size={20} />
        </ButtonLink>
      </div>
      <p className="mt-4 text-small text-subtle">{CTA_FINAL.apoyo}</p>
    </section>
  );
}
