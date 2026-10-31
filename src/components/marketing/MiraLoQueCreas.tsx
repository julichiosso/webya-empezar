import { PreviewNegocio } from '@/components/patterns/PreviewNegocio';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { MIRA_LO_QUE_CREAS } from '@/content/empezar/mira-lo-que-creas';
import { getModulo } from '@/content/modulos';
import { RUBROS_CON_VISTA_PREVIA } from '@/content/rubros';
import estilos from './MiraLoQueCreas.module.css';

const T = MIRA_LO_QUE_CREAS;
const C = CLASES_SECCION.crema;
const NOMBRE_GRUPO = 'vitrina-rubro';

/**
 * "Mirá lo que creás" (dirección Plano, fondo crema): la web de ejemplo de cada rubro, de verdad
 * (`PreviewNegocio`, no capturas), intercambiable con CERO JS: radios nativos + `:has()` en CSS
 * (ver MiraLoQueCreas.module.css). Todo se dibuja en el servidor.
 *
 * Composición editorial en escritorio: a la izquierda, el índice de rubros como una lista de texto
 * grande (no tarjetas); a la derecha, el celular con la web y, al costado, la nota de lo que se ve
 * (qué se arma y con qué piezas). En celular: índice en dos columnas, el celular y la nota debajo.
 *
 * Accesible: un `fieldset` con leyenda visible y un radio por rubro (flechas para cambiar, como
 * cualquier grupo de radios). La vista previa es decorativa (`aria-hidden` en PreviewNegocio); lo
 * que muestra lo dice en texto la nota de al lado, que solo existe para el rubro elegido.
 */
export function MiraLoQueCreas() {
  return (
    <Seccion
      fondo="crema"
      id="mira-lo-que-creas"
      aria-labelledby="creas-title"
      className={estilos.vitrina}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 id="creas-title" className="text-title font-semibold text-balance">
            {T.titulo}
          </h2>
          <p className={`mt-4 max-w-md text-lead ${C.secundario}`}>{T.bajada}</p>
          <fieldset className="mt-8 lg:mt-12">
            <legend className={`text-small ${C.secundario}`}>{T.leyenda}</legend>
            <ul className={`mt-2 grid grid-cols-2 gap-x-4 border-t ${C.linea} lg:grid-cols-1`}>
              {RUBROS_CON_VISTA_PREVIA.map((r, i) => (
                <li key={r.id} className={`${estilos.opcion} border-b ${C.linea}`}>
                  <label className="group flex min-h-tap cursor-pointer items-center gap-4 py-2 lg:py-4">
                    <input
                      type="radio"
                      name={NOMBRE_GRUPO}
                      value={r.id}
                      defaultChecked={i === 0}
                      // El radio es el hueco punteado; marcado, la pieza en el acento de papel.
                      className="size-5 shrink-0 cursor-pointer appearance-none rounded-full border border-dashed border-seccion-crema-fg transition-transform duration-100 checked:scale-110 checked:border-solid checked:border-accent-ink checked:bg-accent-ink motion-reduce:transition-none"
                    />
                    <span className="text-small font-semibold sm:hidden">
                      {r.nombreCorto ?? r.nombre}
                    </span>
                    <span className="hidden font-semibold sm:inline lg:text-heading">
                      {r.nombre}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </div>

        <div className="lg:col-span-7">
          {RUBROS_CON_VISTA_PREVIA.map((r) => (
            <figure key={r.id} data-vista={r.id} className={estilos.vista}>
              <div className="grid gap-8 sm:grid-cols-[16rem_minmax(0,1fr)] sm:items-end">
                <PreviewNegocio
                  rubro={r.id}
                  nombre=""
                  dispositivo="celular"
                  modulos={r.modulosSugeridos}
                />
                <figcaption className="sm:pb-8">
                  <p className="text-heading font-semibold text-balance">{r.nombre}</p>
                  <p className={`mt-2 max-w-sm ${C.secundario}`}>{r.ejemploResultado}</p>
                  <p className={`mt-6 text-small ${C.secundario}`}>{T.piezas}</p>
                  <ul className={`mt-2 border-t ${C.linea}`}>
                    {r.modulosSugeridos.map((m) => (
                      <li key={m} className={`border-b ${C.linea} py-2 text-small font-semibold`}>
                        {getModulo(m).nombre}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </Seccion>
  );
}
