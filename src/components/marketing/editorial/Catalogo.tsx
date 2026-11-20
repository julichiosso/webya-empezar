import { CTA, RUTAS } from '@/content/home';
import { CATALOGO } from '@/content/landings';
import { Boton } from './Boton';

/** /tienda: la opción sin carrito, en una franja (el ancla #catalogo llega desde el bento y el menú). */
export function Catalogo() {
  return (
    <section id={CATALOGO.id} className="tono-claro scroll-mt-16" aria-labelledby="titulo-catalogo">
      <div className="e-wrap grid grid-cols-12 gap-x-6 gap-y-5 py-12 md:py-16">
        <p className="e-rotulo col-span-12 text-ed-muted md:col-span-3">{CATALOGO.rotulo}</p>
        <div className="col-span-12 md:col-span-6">
          <h2 id="titulo-catalogo" className="e-h3">
            {CATALOGO.titulo}
          </h2>
          <p className="e-cuerpo mt-3 max-w-[50ch] text-ed-muted">{CATALOGO.texto}</p>
        </div>
        <div className="col-span-12 md:col-span-3 md:self-end md:justify-self-end">
          <Boton href={RUTAS.armarTipo('catalogo')} variante="secundario">
            {CTA.armar}
          </Boton>
        </div>
      </div>
    </section>
  );
}
