import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { NotasPendientes } from '@/components/patterns/NotasPendientes';
import { QUE_INCLUYE } from '@/content/empezar/que-incluye';
import { ESTADO_MODULO_UI, ESTADOS_MODULO_TEXTO } from '@/content/estados-modulo';
import { MODULO_IDS, getModulo, notasPendientes } from '@/content/modulos';

/**
 * Los módulos que WebYa puede armar, en lenguaje no técnico (sale de content/modulos.ts).
 * Un "tablero de piezas": un solo panel dividido por líneas finas. En celular, filas compactas
 * (ícono, nombre con su estado al lado y una frase); en escritorio, 4 columnas. Lo que falta
 * confirmar (TODO) va una sola vez, agrupado, debajo del tablero.
 */
export function QueIncluye() {
  return (
    <section aria-labelledby="incluye-title" className="reveal pt-24 lg:pt-32">
      <h2 id="incluye-title" className="text-title font-semibold text-balance">
        {QUE_INCLUYE.titulo}
      </h2>
      <p className="mt-4 max-w-md text-lead text-muted lg:max-w-none">{QUE_INCLUYE.bajada}</p>
      {/* En escritorio, el gap de 1px deja ver el fondo bg-line: son las divisiones del tablero. */}
      <ul className="mt-8 overflow-hidden rounded-panel border border-line bg-surface shadow-raised lg:mt-12 lg:grid lg:grid-cols-4 lg:gap-px lg:bg-line">
        {MODULO_IDS.map((id) => {
          const mod = getModulo(id);
          const estado = ESTADOS_MODULO_TEXTO[mod.estado].etiqueta;
          return (
            <li
              key={id}
              className="flex gap-4 border-t border-line bg-surface px-4 py-4 first:border-t-0 lg:flex-col lg:border-t-0 lg:p-8"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-control border border-dashed border-line-strong text-fg lg:size-12"
              >
                <Icon name={id} size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 lg:block">
                  <h3 className="font-semibold">
                    {mod.nombre}
                    <span className="sr-only">{ESTADO_MODULO_UI.accesible(estado)}</span>
                  </h3>
                  {/* Estado honesto, tal cual. */}
                  <span
                    aria-hidden="true"
                    className="inline-flex shrink-0 rounded-full border border-line-strong px-2 text-small leading-6 text-fg lg:mt-2"
                  >
                    {estado}
                  </span>
                </div>
                <p className="mt-1 text-small text-muted lg:mt-2">{mod.descripcion}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <NotasPendientes notas={notasPendientes()} className="mt-4" />
    </section>
  );
}
