import { CTA, RUTAS } from '@/content/home';
import { CATALOGO } from '@/content/landings';
import { LinkChevron } from './LinkChevron';

/** /tienda: la opción sin carrito, en una tarjeta centrada (el ancla #catalogo llega desde el menú). */
export function Catalogo() {
  return (
    <section id={CATALOGO.id} className="tono-claro scroll-mt-16" aria-labelledby="titulo-catalogo">
      <div className="e-wrap pt-[clamp(4rem,8vw,8rem)]">
        <div className="a-tile px-6 py-12 md:py-16" data-reveal="">
          <p className="a-ceja text-ed-muted">{CATALOGO.rotulo}</p>
          <h2 id="titulo-catalogo" className="a-tile-titulo mt-2">
            {CATALOGO.titulo}
          </h2>
          <p className="a-sub mt-2 max-w-[30ch] text-ed-muted">{CATALOGO.texto}</p>
          <LinkChevron href={RUTAS.armarTipo('catalogo')} className="mt-3">
            {CTA.armar}
          </LinkChevron>
        </div>
      </div>
    </section>
  );
}
