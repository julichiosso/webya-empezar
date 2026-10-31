interface IlustracionPlanoProps {
  /** Escena del plano que reemplaza a la foto mientras no hay archivo. */
  escena: 'hero' | 'como-funciona' | 'cierre';
  className?: string;
}

/**
 * Ilustración "plano" (blueprint) de una escena: es el fallback de SlotImagen cuando no hay foto,
 * así que tiene que verse terminada. PROVISORIO hasta que marca-sistema la dibuje (etapa a): un
 * rectángulo con cotas. El contrato (props) no cambia.
 */
export function IlustracionPlano({ escena, className }: IlustracionPlanoProps) {
  return (
    <svg
      aria-hidden="true"
      data-escena-plano={escena}
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <rect x="20" y="15" width="120" height="60" rx="4" fill="none" stroke="currentColor" />
      <path d="M20 82H140M20 79V85M140 79V85" fill="none" stroke="currentColor" />
    </svg>
  );
}
