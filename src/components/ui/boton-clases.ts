import type { ContratoBoton } from './contratos';
import { cn, TOQUE } from './clases';

/*
 * Clases del botón, aparte de Button.tsx (que importa íconos y spinner): así un componente de cliente
 * que solo necesita el aspecto (p. ej. el límite de error raíz) no arrastra esos módulos al JS inicial.
 */

export type Variante = ContratoBoton['variante'];
export type Tamanio = NonNullable<ContratoBoton['tamanio']>;

/** Nombres de la API anterior (siguen funcionando): primary → primario, secondary → secundario, ghost → texto. */
export type VarianteAnterior = 'primary' | 'secondary' | 'ghost';
export type ButtonStatus = 'idle' | 'loading' | 'success';

export const DE_ANTES: Record<VarianteAnterior, Variante> = {
  primary: 'primario',
  secondary: 'secundario',
  ghost: 'texto',
};

export const normalizar = (v: Variante | VarianteAnterior): Variante =>
  v in DE_ANTES ? DE_ANTES[v as VarianteAnterior] : (v as Variante);

/*
 * Sin transiciones de color: solo transform (toque) y opacity (overlays). El hover cambia al instante
 * y solo existe con puntero fino (Tailwind ya lo envuelve en `@media (hover: hover)`).
 * El foco es el global (outline de acento): nada de outline-none.
 */
const BASE = cn(
  'relative inline-flex min-h-tap select-none items-center justify-center gap-2 font-semibold leading-none',
  TOQUE,
  'disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none',
);

/** `compacto`: texto chico y menos aire a los costados (tarjetas angostas). El alto táctil no cambia. */
const TAMANIOS: Record<Tamanio, string> = {
  normal: 'px-6 text-body',
  compacto: 'px-4 text-small',
};

const VARIANTES: Record<Variante, string> = {
  primario: 'rounded-control bg-boton-primario-fondo text-boton-primario-texto hover:opacity-90',
  secundario:
    'rounded-control border border-boton-secundario-borde bg-surface-2 text-boton-secundario-texto hover:border-fg/40',
  texto: 'rounded-control text-muted hover:text-fg',
  // Ícono redondo de 48 px (cerrar, reproducir…): sin texto visible, nombre por etiquetaAccesible.
  icono: 'size-12 shrink-0 rounded-full text-fg hover:bg-surface-2',
  pastilla: 'rounded-full border border-line px-4 text-small hover:border-line-strong',
};

/** Las variantes que traen su propio padding no reciben el del tamaño. */
const CON_PADDING_PROPIO: readonly Variante[] = ['icono', 'pastilla'];

export function buttonClasses(
  variant: Variante | VarianteAnterior = 'primario',
  fullWidth = false,
  tamanio: Tamanio = 'normal',
) {
  const v = normalizar(variant);
  return cn(
    BASE,
    !CON_PADDING_PROPIO.includes(v) && TAMANIOS[tamanio],
    VARIANTES[v],
    fullWidth && 'w-full',
  );
}
