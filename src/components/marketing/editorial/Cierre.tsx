import { MENSAJE_CONTACTO } from '@/content/configurador';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { CIERRE, CTA, RUTAS } from '@/content/home';
import { Boton } from './Boton';
import { ContactoRapido } from './ContactoRapido';
import { WhatsApp } from './Iconos';
import { TituloPalabras } from './TituloPalabras';

/**
 * Cierre de página: los tres caminos para contactarnos, al toque. Armar el sistema, escribirnos por
 * WhatsApp o dejar el número para que te escribamos nosotros (queda guardado en el sistema de leads).
 */
export function Cierre({ armar = RUTAS.armar }: { armar?: string }) {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <section className="tono-oscuro border-t border-ed-line" aria-labelledby="titulo-cierre">
      <div className="e-wrap grid grid-cols-12 gap-y-10 py-[clamp(4rem,8vw,8rem)] lg:gap-x-12">
        <div className="col-span-12 min-w-0 lg:col-span-5">
          <TituloPalabras
            lineas={[CIERRE.titulo]}
            id="titulo-cierre"
            className="e-display e-hero-compacto"
          />
          <p className="e-lead mt-5 max-w-[40ch] text-ed-muted" data-reveal="">
            {CIERRE.bajada}
          </p>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:flex" data-reveal="">
            <Boton href={armar}>{CTA.armar}</Boton>
            <Boton
              href={contacto.href}
              variante="secundario"
              externo
              icono={contacto.canal === 'whatsapp' ? <WhatsApp /> : false}
            >
              {CTA.escribinos}
            </Boton>
          </div>
        </div>
        <div className="col-span-12 min-w-0 lg:col-span-7" data-reveal="">
          <ContactoRapido />
        </div>
      </div>
    </section>
  );
}
