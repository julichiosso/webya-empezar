import { CTA, NOSOTROS_HOME as N, RUTAS } from '@/content/home';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { Boton } from '../editorial/Boton';
import { enlaceContacto } from '../editorial/contacto';
import { WhatsApp } from '../editorial/Iconos';
import { LinkChevron } from '../editorial/LinkChevron';
import { Retrato } from '../editorial/Nosotros';
import { TituloPalabras } from '../editorial/TituloPalabras';

/**
 * Quiénes somos, en una pantalla: la cara de la empresa (la foto cuando llegue; mientras, la marca), quién
 * la fundó y que te atiende quien programa. El detalle vive en /nosotros.
 */
export function NosotrosHome() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <section id={N.id} className="tono-claro a-seccion" aria-labelledby="titulo-quienes">
      <div className="e-wrap grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <Retrato className="mx-auto w-full max-w-sm md:max-w-none" />
        <div>
          <p className="a-ceja text-ed-muted" data-reveal="">
            {N.rotulo}
          </p>
          <TituloPalabras lineas={N.titulo} id="titulo-quienes" className="a-titulo mt-2" />
          <p className="a-sub mt-4 max-w-[34ch] text-ed-muted" data-reveal="">
            {N.texto}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" data-reveal="">
            <Boton
              href={contacto.href}
              variante="secundario"
              externo
              icono={contacto.canal === 'whatsapp' ? <WhatsApp /> : false}
            >
              {CTA.escribinos}
            </Boton>
            <LinkChevron href={RUTAS.nosotros}>{N.ver}</LinkChevron>
          </div>
        </div>
      </div>
    </section>
  );
}
