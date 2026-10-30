import { Icon } from '@/brand/ilustracion/iconos/Icon';
import type { IconName } from '@/brand/ilustracion/iconos/paths';
import { Eleccion } from './Eleccion';

interface SelectCardProps {
  /** Radio nativo: aporta rol, grupo, flechas de teclado y estado accesible sin ARIA extra. */
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  label: string;
  icon: IconName;
}

/** Tarjeta de elección única (rubros). Envoltorio de `Eleccion` con la API de siempre. */
export function SelectCard({ name, value, checked, onSelect, label, icon }: SelectCardProps) {
  return (
    <Eleccion
      tipo="unica"
      forma="tarjeta"
      name={name}
      value={value}
      checked={checked}
      onCambio={onSelect}
      etiqueta={label}
      icono={<Icon name={icon} size={32} draw active={checked} />}
    />
  );
}
