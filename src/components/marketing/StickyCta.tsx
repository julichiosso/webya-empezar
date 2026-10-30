import { ButtonLink } from '@/components/ui/Button';
import { STICKY_CTA } from '@/content/empezar/cta-final';
import { BarraFija } from './BarraFija';
import { ID_CTA_FINAL } from './CtaFinal';

/** Donde ya hay un CTA a la vista (o el wizard mismo): ahí la barra se esconde. */
const ZONAS = ['section[aria-labelledby="hero-title"]', '#wizard', `#${ID_CTA_FINAL}`, 'footer'];

/**
 * CTA persistente en celular: aparece cuando el CTA del hero ya no se ve y todavía no se llegó al
 * wizard. El botón se arma en el servidor; en el cliente solo viaja el control de visibilidad.
 */
export function StickyCta() {
  return (
    <BarraFija etiqueta={STICKY_CTA.aria} zonas={ZONAS}>
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <p className="text-small text-muted max-[22rem]:hidden">{STICKY_CTA.texto}</p>
        <ButtonLink href="#wizard" tamanio="compacto" className="max-[22rem]:w-full">
          {STICKY_CTA.cta}
        </ButtonLink>
      </div>
    </BarraFija>
  );
}
