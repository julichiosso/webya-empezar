import { Icon } from '../icons/Icon';

interface ChipProps {
  value: string;
  checked: boolean;
  onToggle: (value: string) => void;
  label: string;
}

/** Chip multi-selección. Checkbox nativo: rol y teclado (Espacio) gratis; estado visual con CSS (peer). */
export function Chip({ value, checked, onToggle, label }: ChipProps) {
  return (
    <label className="group block cursor-pointer">
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={() => onToggle(value)}
        className="peer sr-only"
      />
      <span className="inline-flex min-h-tap items-center gap-2 rounded-full border border-line bg-surface py-2 pr-5 pl-4 text-body font-medium transition-[transform] duration-100 group-hover:border-line-strong group-active:scale-[0.97] peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {/* El hueco del check está siempre reservado: el chip no cambia de ancho al elegirse. */}
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-full transition-[transform,opacity] duration-200 ${checked ? 'scale-100 bg-accent text-accent-fg opacity-100' : 'scale-75 border border-line-strong opacity-70'}`}
        >
          {checked && <Icon name="check" size={14} draw active />}
        </span>
        {label}
      </span>
    </label>
  );
}
