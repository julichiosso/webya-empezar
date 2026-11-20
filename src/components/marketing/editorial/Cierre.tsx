import { MENSAJE_CONTACTO } from '@/content/configurador';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { CIERRE, CTA, RUTAS } from '@/content/home';
import { Boton } from './Boton';
import { WhatsApp } from './Iconos';
import { TituloPalabras } from './TituloPalabras';

/** Cierre de página: el titular y los dos caminos (armar el sistema o escribirnos). */
export function Cierre({ armar = RUTAS.armar }: { armar?: string }) {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <section className="tono-oscuro border-t border-ed-line" aria-labelledby="titulo-cierre">
      <div className="e-wrap grid grid-cols-12 gap-x-6 gap-y-8 py-[clamp(4rem,9vw,9rem)]">
        <div className="col-span-12 lg:col-span-7">
          <TituloPalabras
            lineas={[CIERRE.titulo]}
            id="titulo-cierre"
            className="e-display e-hero-compacto"
          />
          <p className="e-lead mt-5 max-w-[44ch] text-ed-muted" data-reveal="">
            {CIERRE.bajada}
          </p>
        </div>
        <div
          className="col-span-12 grid grid-cols-1 gap-3 sm:flex lg:col-span-5 lg:justify-end lg:self-end"
          data-reveal=""
        >
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
    </section>
  );
}
