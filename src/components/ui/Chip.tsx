import { Encaje } from './Encaje';

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
        {/* El hueco está siempre: el chip no cambia de ancho cuando la pieza encaja. */}
        <Encaje on={checked} size="sm" />
        {label}
      </span>
    </label>
  );
}
