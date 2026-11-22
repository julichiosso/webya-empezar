import { MENSAJE_CONTACTO } from '@/content/configurador';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { CIERRE, CTA, RUTAS } from '@/content/home';
import { Boton } from './Boton';
import { ContactoRapido } from './ContactoRapido';
import { WhatsApp } from './Iconos';
import { TituloPalabras } from './TituloPalabras';

/**
 * Cierre de página, centrado y corto: una pregunta, una línea y las acciones (armar el sistema o
 * escribirnos). Abajo, dejar el número para que te escribamos nosotros (queda en el sistema de leads).
 */
export function Cierre({ armar = RUTAS.armar }: { armar?: string }) {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <section className="tono-oscuro" aria-labelledby="titulo-cierre">
      <div className="e-wrap flex flex-col items-center py-[clamp(4.5rem,9vw,9rem)] text-center">
        <TituloPalabras lineas={[CIERRE.titulo]} id="titulo-cierre" className="a-hero" />
        <p className="a-sub mt-4 text-ed-muted" data-reveal="">
          {CIERRE.bajada}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3" data-reveal="">
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
        <div className="mt-14 w-full max-w-xl text-left md:mt-16" data-reveal="">
          <ContactoRapido />
        </div>
      </div>
    </section>
  );
}
