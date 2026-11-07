import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { SitioNegocio } from '@/components/patterns/SitioNegocio';
import { Telefono } from '@/components/patterns/Telefono';
import { VITRINA_RUBROS, VITRINA_UI } from '@/content/empezar/vitrina-rubros';
import { ControlVitrina } from './ControlVitrina';
import estilos from './VitrinaRubros.module.css';

/**
 * La primera impresión de /empezar: un celular con el sitio de un negocio de cada rubro y, encima, el
 * ticket de lo que le acaba de entrar (papel crema, como las comandas). Todo se dibuja en el servidor:
 * el cliente solo cambia cuál se ve. Es decorativa: lo que dice ya está en el titular y en las tarjetas.
 */
export function VitrinaRubros() {
  return (
    <ControlVitrina rubros={VITRINA_RUBROS.map((e) => e.rubro)}>
      <div aria-hidden="true" className={estilos.escenario} data-testid="vitrina-rubros">
        <Telefono pantallaClassName="h-[26rem] sm:h-[32rem] lg:bajo:h-[26rem]">
          {VITRINA_RUBROS.map((e, i) => (
            <div
              key={e.rubro}
              data-slide={e.rubro}
              data-activa={i === 0}
              className={estilos.pantalla}
            >
              <SitioNegocio rubro={e.rubro} nombre={e.negocio} secciones={2} />
            </div>
          ))}
        </Telefono>
        {VITRINA_RUBROS.map((e, i) => (
          <div
            key={e.rubro}
            data-slide={e.rubro}
            data-activa={i === 0}
            className={`papel ${estilos.ticket}`}
          >
            <p className="flex items-center gap-2 text-small font-semibold">
              <Icon name="check" size={16} className="rounded-sm bg-accent text-accent-fg" />
              {e.entra.titulo}
            </p>
            <p className="mt-1 text-small text-paper-muted">{e.entra.detalle}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-small text-muted">{VITRINA_UI.leyenda}</p>
    </ControlVitrina>
  );
}
