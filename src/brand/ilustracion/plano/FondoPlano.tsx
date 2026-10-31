interface FondoPlanoProps {
  /** `grilla`: cuadrícula fina; `cotas`: grilla + cotas y marcas de registro. */
  variante?: 'grilla' | 'cotas';
  className?: string;
}

/**
 * Fondo "blueprint" de las secciones (dirección Plano). Decorativo, SVG propio, hereda el color
 * del texto con baja opacidad. PROVISORIO: grilla simple hasta que marca-sistema lo termine (etapa a).
 * El contrato (props) no cambia.
 */
export function FondoPlano({ variante = 'grilla', className }: FondoPlanoProps) {
  return (
    <svg
      aria-hidden="true"
      data-plano={variante}
      className={`pointer-events-none absolute inset-0 h-full w-full text-current opacity-[0.07] ${className ?? ''}`.trim()}
    >
      <defs>
        <pattern id="plano-grilla" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#plano-grilla)" />
    </svg>
  );
}
