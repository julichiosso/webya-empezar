import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/paths';
import { Encaje } from './Encaje';

interface SelectCardProps {
  /** Radio nativo: aporta rol, grupo, flechas de teclado y estado accesible sin ARIA extra. */
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  label: string;
  icon: IconName;
}

export function SelectCard({ name, value, checked, onSelect, label, icon }: SelectCardProps) {
  return (
    <label className="group relative block h-full cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="peer sr-only"
      />
      {/* Al elegir, "clic" (clase pop-on, solo transform) y la pieza encaja en el hueco. */}
      <span
        data-on={checked}
        className="pop-on flex h-full min-h-32 flex-col justify-between gap-4 rounded-card border border-line bg-surface p-4 shadow-raised transition-[transform] duration-100 group-hover:border-line-strong group-active:scale-[0.98] peer-checked:border-accent peer-checked:bg-accent-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
      >
        <span className={`flex ${checked ? 'text-accent' : 'text-fg'}`}>
          <Icon name={icon} size={32} draw active={checked} />
        </span>
        <span className="text-body leading-tight font-semibold text-balance">{label}</span>
      </span>
      <Encaje on={checked} className="absolute top-3 right-3" />
    </label>
  );
}
