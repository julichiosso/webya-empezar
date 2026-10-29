import type { ModuloId } from '@/config/modulos';
import { Icon } from '../icons/Icon';

interface ModuloOptionProps {
  id: ModuloId;
  nombre: string;
  descripcion: string;
  checked: boolean;
  /** El rubro elegido lo sugiere: se aclara para que se entienda por qué ya viene marcado. */
  sugerido: boolean;
  onToggle: (id: ModuloId) => void;
}

/** Módulo activable. Checkbox nativo: rol, teclado (Espacio) y estado accesible sin ARIA extra. */
export function ModuloOption({
  id,
  nombre,
  descripcion,
  checked,
  sugerido,
  onToggle,
}: ModuloOptionProps) {
  return (
    <label className="group block h-full cursor-pointer">
      <input
        type="checkbox"
        value={id}
        checked={checked}
        onChange={() => onToggle(id)}
        className="peer sr-only"
      />
      <span
        data-on={checked}
        className="pop-on flex h-full items-start gap-4 rounded-card border border-line bg-surface p-4 transition-[transform] duration-100 group-hover:border-line-strong group-active:scale-[0.98] peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      >
        <span className={`mt-0.5 shrink-0 ${checked ? 'text-accent' : 'text-fg'}`}>
          <Icon name={id} size={28} draw active={checked} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{nombre}</span>
          <span className="mt-1 block text-small text-muted">{descripcion}</span>
          {sugerido && (
            <span className="mt-2 block text-small font-medium text-fg">
              Sugerido para tu rubro
            </span>
          )}
        </span>
        {/* El hueco del check está siempre reservado: la fila no cambia de tamaño al elegirse. */}
        <span
          aria-hidden="true"
          className={`flex size-6 shrink-0 items-center justify-center rounded-full transition-[transform,opacity] duration-200 ${checked ? 'scale-100 bg-accent text-accent-fg opacity-100' : 'scale-75 border border-line-strong opacity-70'}`}
        >
          {checked && <Icon name="check" size={16} draw active />}
        </span>
      </span>
    </label>
  );
}
