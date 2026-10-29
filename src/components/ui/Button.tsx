import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../icons/Icon';

type Variant = 'primary' | 'secondary' | 'ghost';
export type ButtonStatus = 'idle' | 'loading' | 'success';

// Sin transiciones de color: solo transform/opacity (presupuesto de animación). El hover cambia al instante.
const base =
  'relative inline-flex min-h-tap select-none items-center justify-center gap-2 rounded-control font-semibold leading-none transition-[transform,opacity] duration-100 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45';

/** `compacto`: texto chico y menos aire a los costados (tarjetas angostas). El alto táctil no cambia. */
type Tamanio = 'normal' | 'compacto';
const tamanios: Record<Tamanio, string> = {
  normal: 'px-6 text-body',
  compacto: 'px-4 text-small',
};

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:opacity-90',
  secondary: 'border border-line-strong bg-surface-2 text-fg hover:border-fg/40',
  ghost: 'px-3 text-muted hover:text-fg',
};

export function buttonClasses(
  variant: Variant = 'primary',
  fullWidth = false,
  tamanio: Tamanio = 'normal',
) {
  return `${base} ${tamanios[tamanio]} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  /** loading: spinner y botón bloqueado; success: check. El ancho no cambia (sin layout shift). */
  status?: ButtonStatus;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  status = 'idle',
  fullWidth,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const busy = status !== 'idle';
  return (
    <button
      type={type}
      disabled={disabled || busy}
      aria-busy={status === 'loading' || undefined}
      className={`${buttonClasses(variant, fullWidth)} ${className ?? ''}`.trim()}
      {...rest}
    >
      <span
        className={`inline-flex items-center gap-2 transition-opacity duration-150 ${busy ? 'opacity-0' : 'opacity-100'}`}
      >
        {children}
      </span>
      <Overlay show={status === 'loading'}>
        <svg viewBox="0 0 24 24" width="22" height="22" className="spin" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".25"
            strokeWidth="2.5"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </Overlay>
      <Overlay show={status === 'success'}>
        <Icon name="check" size={24} draw active={status === 'success'} />
      </Overlay>
    </button>
  );
}

function Overlay({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-[transform,opacity] duration-200 ${show ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
    >
      {children}
    </span>
  );
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

export function ButtonLink({
  variant = 'primary',
  fullWidth,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <a className={`${buttonClasses(variant, fullWidth)} ${className ?? ''}`.trim()} {...rest} />
  );
}
