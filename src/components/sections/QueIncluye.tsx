import { Icon } from '../icons/Icon';
import { MODULO_IDS, getModulo } from '@/config/modulos';

/**
 * Los módulos que WebYa puede armar, en lenguaje no técnico (sale de config/modulos.ts).
 * Mobile: un panel con filas. Escritorio: grilla de 3 columnas; con 7 módulos, el último ocupa
 * el ancho completo para no dejar un hueco.
 */
export function QueIncluye() {
  return (
    <section aria-labelledby="incluye-title" className="reveal pt-24 lg:pt-32">
      <h2 id="incluye-title" className="text-title font-semibold text-balance">
        Qué podés activar
      </h2>
      <p className="mt-4 max-w-md text-lead text-muted lg:max-w-none">
        Activás solo lo que tu negocio usa.
      </p>
      <ul className="mt-8 overflow-hidden rounded-panel border border-line bg-surface shadow-raised lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none">
        {MODULO_IDS.map((id) => {
          const mod = getModulo(id);
          return (
            <li
              key={id}
              className="flex gap-4 border-t border-line p-6 first:border-t-0 lg:flex-col lg:rounded-card lg:border lg:bg-surface lg:shadow-raised lg:first:border-t lg:last:col-span-3 lg:last:flex-row lg:last:items-center"
            >
              <span className="mt-0.5 shrink-0 text-fg lg:mt-0">
                <Icon name={id} size={28} />
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
