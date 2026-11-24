import { PRODUCTO_VISTA as P } from '@/content/home';
import { Escaparate } from '../editorial/Escaparate';
import { TituloPalabras } from '../editorial/TituloPalabras';

/**
 * El producto a la vista: sobre negro, los celulares con trabajos reales suben desde abajo al entrar en
 * pantalla y cada sitio se recorre solo; en el del medio entra el aviso de un pedido nuevo.
 */
export function ProductoVista() {
  return (
    <section
      id={P.id}
      className="tono-oscuro h3d-vista overflow-hidden"
      aria-labelledby="titulo-vista"
    >
      <div className="e-wrap pt-[clamp(4.5rem,9vw,9rem)] text-center">
        <p className="a-ceja text-ed-muted" data-reveal="">
          {P.rotulo}
        </p>
        <TituloPalabras lineas={P.titulo} id="titulo-vista" className="a-titulo mt-2" />
        <p className="a-sub mt-4 text-ed-muted" data-reveal="">
          {P.bajada}
        </p>
      </div>
      <Escaparate className="e-wrap mt-12 max-w-5xl pb-[12%] md:mt-16 md:pb-20" />
    </section>
  );
}
