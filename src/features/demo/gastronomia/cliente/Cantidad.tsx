import { Icon } from '@/components/icons/Icon';

interface CantidadProps {
  valor: number;
  onCambiar: (n: number) => void;
  min?: number;
  max: number;
  /** Para lectores de pantalla: de qué es la cantidad (p. ej. "Muzzarella"). */
  de: string;
}

/** Selector − n +. Botones de 48 px; el número se anuncia al cambiar. */
export function Cantidad({ valor, onCambiar, min = 1, max, de }: CantidadProps) {
  const boton =
    'flex size-12 items-center justify-center rounded-full border border-paper-line text-paper-fg active:scale-[0.96] disabled:opacity-40';
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`Cantidad de ${de}`}>
      <button
        type="button"
        className={boton}
        onClick={() => onCambiar(valor - 1)}
        disabled={valor <= min}
        aria-label={min === 0 && valor === 1 ? `Quitar ${de}` : `Restar uno de ${de}`}
      >
        <Icon name="menos" size={20} />
      </button>
      <output aria-live="polite" className="tabular w-8 text-center text-body font-semibold">
        {valor}
      </output>
      <button
        type="button"
        className={boton}
        onClick={() => onCambiar(valor + 1)}
        disabled={valor >= max}
        aria-label={`Sumar uno de ${de}`}
      >
        <Icon name="mas" size={20} />
      </button>
    </div>
  );
}
