import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/components/ui/clases';
import { CTA_FINAL } from '@/content/empezar/cta-final';
import { MENSAJE_WHATSAPP } from '@/content/whatsapp';
import { siteConfig } from '@/lib/site-config';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import estilos from './Cierre.module.css';

/** Id del cierre: la barra fija del celular se oculta mientras se ve (ya hay un CTA a la vista). */
export const ID_CTA_FINAL = 'cta-final';

const C = CLASES_SECCION.brasa;

/**
 * Cierre de /empezar: la única sección en Brasa oscura. Al llegar, el panel crece desde chico hasta
 * ocupar todo el ancho (solo transform) y el titular queda enorme. El CTA baja al wizard; quien prefiera
 * hablar antes tiene el WhatsApp al lado.
 */
export function Cierre() {
  const whatsapp = buildWhatsAppLink(siteConfig.whatsappNumber, MENSAJE_WHATSAPP.contacto);
  return (
    <div className={estilos.marco}>
      <Seccion
        id={ID_CTA_FINAL}
        fondo="brasa"
        aria-labelledby="cta-final-title"
        className={estilos.panel}
        contenidoClassName="py-20 lg:py-32"
      >
        <h2 id="cta-final-title" className={estilos.titulo}>
          {CTA_FINAL.titulo}
        </h2>
        <p className={cn('mt-6 max-w-lg text-lead', C.secundario)}>{CTA_FINAL.bajada}</p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href="#wizard">{CTA_FINAL.cta}</ButtonLink>
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-tap items-center font-semibold underline underline-offset-4"
            >
              {CTA_FINAL.whatsapp}
              <span className="sr-only">{CTA_FINAL.externo}</span>
            </a>
          )}
        </div>
        <p className={cn('mt-4 text-small', C.secundario)}>{CTA_FINAL.apoyo}</p>
      </Seccion>
    </div>
  );
}
