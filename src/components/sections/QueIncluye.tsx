import { Icon } from '../icons/Icon';
import { MODULO_IDS, getModulo } from '@/config/modulos';

/** Los módulos que WebYa puede armar, en lenguaje no técnico. Sale del catálogo (config/modulos.ts). */
export function QueIncluye() {
  return (
    <section aria-labelledby="incluye-title" className="reveal pt-24">
      <h2 id="incluye-title" className="text-title font-semibold text-balance">
        Qué podés activar
      </h2>
      <p className="mt-4 max-w-md text-lead text-muted">
        No todos los negocios necesitan lo mismo. Activás solo lo que el tuyo usa.
      </p>
      <ul className="mt-8 overflow-hidden rounded-panel border border-line bg-surface shadow-raised">
        {MODULO_IDS.map((id) => {
          const mod = getModulo(id);
          return (
            <li key={id} className="flex gap-4 border-t border-line p-6 first:border-t-0">
              <span className="mt-0.5 shrink-0 text-fg">
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
