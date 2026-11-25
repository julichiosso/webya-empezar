import type { ReactNode } from 'react';
import { GLOBO_PEDIDOS } from '@/content/demos/pedidos/globo';
import { GLOBO_TIENDA } from '@/content/demos/tienda/globo';
import { GLOBO_WEB } from '@/content/demos/web/globo';
import { HERO_MAPA as H } from '@/content/home';
import type { IdNegocio } from './MapaPueblo';
import { TurnoAnimado } from './TurnoAnimado';

/**
 * Las mini demos de las fichas del plano. Se arman en el servidor y viajan ya renderizadas al mapa: así
 * los datos de las demos (carta, catálogo, página) no entran en el JS del navegador.
 */
export function fichasPueblo(): Record<IdNegocio, ReactNode> {
  return {
    peluqueria: <TurnoAnimado />,
    pizzeria: (
      <div className="pb-mini">
        <p className="pb-mini-chico">{GLOBO_PEDIDOS.titulo}</p>
        <p className="pb-mini-fila">
          <span>{GLOBO_PEDIDOS.item}</span>
          <strong>{GLOBO_PEDIDOS.precio}</strong>
        </p>
        <p className="pb-mini-chico">{GLOBO_PEDIDOS.detalle}</p>
        <span className="pb-mini-boton">{GLOBO_PEDIDOS.boton}</span>
      </div>
    ),
    comercio: (
      <div className="pb-mini">
        <p className="pb-mini-chico">{GLOBO_TIENDA.titulo}</p>
        <p className="pb-mini-fila">
          <span>{GLOBO_TIENDA.item}</span>
          <strong>{GLOBO_TIENDA.precio}</strong>
        </p>
        <span className="pb-mini-boton pb-mini-wa">{GLOBO_TIENDA.boton}</span>
      </div>
    ),
    consultorio: (
      <div className="pb-mini">
        <p className="pb-mini-chico">{GLOBO_WEB.encabezado}</p>
        <p className="pb-mini-titulo">{GLOBO_WEB.titulo}</p>
        <span className="pb-mini-boton pb-mini-wa">{GLOBO_WEB.boton}</span>
      </div>
    ),
    tu: (
      <div className="pb-mini">
        <p className="pb-mini-titulo">{H.tuNegocio.titulo}</p>
        <p className="pb-mini-chico">{H.tuNegocio.texto}</p>
      </div>
    ),
  };
}
