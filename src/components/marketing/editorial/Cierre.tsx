import { MENSAJE_CONTACTO } from '@/content/configurador';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { CIERRE, CTA, MARCA } from '@/content/home';
import { Boton } from './Boton';
import { WhatsApp } from './Iconos';
import { TituloPalabras } from './TituloPalabras';

/** Cierre de página: titular enorme y los dos caminos (configurador o hablar directo). */
export function Cierre() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <section className="tono-oscuro border-t border-ed-line" aria-labelledby="titulo-cierre">
      <div className="e-wrap py-[clamp(6rem,12vw,12rem)]">
        <TituloPalabras
          lineas={[CIERRE.titulo]}
          id="titulo-cierre"
          className="e-display max-w-[14ch]"
        />
        <div className="mt-12 grid grid-cols-12 gap-6 md:mt-16">
          <p className="e-lead col-span-12 max-w-[40ch] text-ed-muted md:col-span-6" data-reveal="">
            {CIERRE.bajada}
          </p>
          <div
            className="col-span-12 flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end md:self-end"
            data-reveal=""
          >
            <Boton href="#armar" armar="" iman>
              {CTA.armar}
            </Boton>
            <Boton
              href={contacto.href}
              variante="secundario"
              externo
              icono={contacto.canal === 'whatsapp' ? <WhatsApp /> : false}
            >
              {CTA.hablar}
            </Boton>
          </div>
        </div>
        <p className="e-chico mt-16 flex items-center gap-3 border-t border-ed-line pt-6">
          <span className="e-punto" aria-hidden="true" />
          {MARCA.zona}
        </p>
      </div>
    </section>
  );
}
