/**
 * Íconos de línea de un único set (24×24, trazo 1.5, currentColor). Siempre decorativos: el texto
 * del botón o del enlace dice lo que hacen.
 */
interface IconoProps {
  className?: string;
}

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'square' as const,
  'aria-hidden': true,
  focusable: false,
};

export const Flecha = ({ className }: IconoProps) => (
  <svg {...base} width={18} height={18} className={`e-flecha ${className ?? ''}`}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const FlechaDiagonal = ({ className }: IconoProps) => (
  <svg {...base} width={16} height={16} className={`e-flecha ${className ?? ''}`}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const Mas = ({ className }: IconoProps) => (
  <svg {...base} width={20} height={20} className={className}>
    <path d="M12 4v16M4 12h16" />
  </svg>
);

export const Tilde = ({ className }: IconoProps) => (
  <svg {...base} width={16} height={16} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const WhatsApp = ({ className }: IconoProps) => (
  <svg {...base} width={18} height={18} className={className}>
    <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
    <path
      d="M9.2 9.2c.3 2.4 2.2 4.4 4.6 4.8l1-1.2 2 .9-.4 1.6c-3.8.4-7.6-3.3-7.3-7.2l1.6-.4.9 2Z"
      strokeWidth={1.2}
    />
  </svg>
);

export const Mail = ({ className }: IconoProps) => (
  <svg {...base} width={18} height={18} className={className}>
    <path d="M3.5 6.5h17v11h-17z" />
    <path d="m3.5 7 8.5 6.5L20.5 7" />
  </svg>
);

export const Menu = ({ className }: IconoProps) => (
  <svg {...base} width={20} height={20} className={className}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const Cerrar = ({ className }: IconoProps) => (
  <svg {...base} width={20} height={20} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Chevron = ({ className }: IconoProps) => (
  <svg
    {...base}
    width={14}
    height={14}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`a-chevron ${className ?? ''}`}
  >
    <path d="m9 5 7 7-7 7" />
  </svg>
);
