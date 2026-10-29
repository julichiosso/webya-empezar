import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { QUE_INCLUYE } from '@/content/empezar/que-incluye';
import { MODULO_IDS, getModulo } from '@/content/modulos';

/**
 * Los módulos que WebYa puede armar, en lenguaje no técnico (sale de config/modulos.ts).
 * Un "tablero de piezas": un solo panel dividido por líneas finas (filas en mobile, 4 columnas en
 * escritorio), cada ícono en su hueco punteado. Con 8 módulos, dos filas de 4 sin huecos.
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
          return (
            <li
              key={id}
              className="flex gap-4 border-t border-line bg-surface p-6 first:border-t-0 lg:flex-col lg:border-t-0 lg:p-8"
            >
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-control border border-dashed border-line-strong text-fg"
              >
                <Icon name={id} size={24} />
              </span>
              <div>
                <h3 className="font-semibold">{mod.nombre}</h3>
                <p className="mt-1 text-small text-muted">{mod.descripcion}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
