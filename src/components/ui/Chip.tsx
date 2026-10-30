import { Eleccion } from './Eleccion';

interface ChipProps {
  value: string;
  checked: boolean;
  onToggle: (value: string) => void;
  label: string;
}

/** Chip multi-selección (checkbox nativo). Envoltorio de `Eleccion` con la API de siempre. */
export function Chip({ value, checked, onToggle, label }: ChipProps) {
  return (
    <Eleccion
      tipo="multiple"
      forma="chip"
      value={value}
      checked={checked}
      onCambio={() => onToggle(value)}
      etiqueta={label}
    />
  );
}
