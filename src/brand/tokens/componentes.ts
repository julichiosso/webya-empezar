import type { TokenColor } from './semanticos';

/**
 * Capa 3 de 3: tokens de COMPONENTE. Cada uno apunta a un semántico, así un componente puede cambiar
 * de piel (p. ej. el botón principal) sin tocar el resto. Se exponen como utilidades de Tailwind:
 * `bg-boton-primario-fondo`, `border-control-borde`… Cambian solos con el tema (oscuro, claro, papel).
 */
export const COMPONENTES = {
  'boton-primario-fondo': 'accent',
  'boton-primario-texto': 'accent-fg',
  'boton-secundario-borde': 'line-strong',
  'boton-secundario-texto': 'fg',
  'tarjeta-fondo': 'surface',
  'tarjeta-borde': 'line',
  'panel-fondo': 'surface',
  'panel-borde': 'line',
  'control-fondo': 'surface',
  'control-borde': 'line-strong',
  'control-texto': 'fg',
  'control-ayuda': 'muted',
  'control-error': 'danger',
  'seleccion-fondo': 'accent-soft',
  'seleccion-borde': 'accent',
  foco: 'accent',
  'hueco-borde': 'line-strong',
  'pieza-encajada': 'accent',
  // Dirección Plano. Se resuelven dentro de cada superficie (`.superficie-*`, `.papel`).
  /** La pieza que encaja en las ilustraciones de plano (IlustracionPlano): el guiño Brasa. */
  'plano-pieza': 'accent',
  /** Anotaciones y cotas en texto chico junto al plano. */
  'plano-cota': 'muted',
  /** Hilo de 1 px entre dos secciones a pantalla completa del mismo fondo. */
  'seccion-borde': 'line',
} as const satisfies Record<string, TokenColor>;

export type TokenComponente = keyof typeof COMPONENTES;
