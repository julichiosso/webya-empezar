/**
 * Contratos de las primitivas de UI (Ola 1). Los implementa `ui-componentes` en la Ola 2 y los consume
 * `paginas` en la Ola 3: así las dos olas trabajan en paralelo sin pisarse. Cambiar un contrato = avisar
 * al integrador.
 *
 * Reglas comunes:
 * - Sin texto propio: todo texto visible o accesible llega por props (desde src/content).
 * - Colores solo por tokens semánticos o de componente (src/brand/tokens).
 * - Movimiento solo transform/opacity, con equivalente estático en prefers-reduced-motion.
 * - Objetivo táctil mínimo de 48 px (`min-h-tap`), foco visible siempre.
 */

/** Los 8 estados que toda primitiva interactiva cubre (y testea, uno por uno). */
export const ESTADOS_UI = [
  'default',
  'hover',
  'focus',
  'active',
  'disabled',
  'loading',
  'error',
  'success',
] as const;
export type EstadoUI = (typeof ESTADOS_UI)[number];

export interface ContratoBoton {
  variante: 'primario' | 'secundario' | 'texto' | 'icono' | 'pastilla';
  tamanio?: 'normal' | 'compacto';
  anchoCompleto?: boolean;
  /** Muestra el spinner, bloquea el doble envío y anuncia el estado (aria-busy). */
  cargando?: boolean;
  /** Obligatorio en la variante `icono` (no tiene texto visible). */
  etiquetaAccesible?: string;
}

/** Radio o checkbox con forma de tarjeta, chip o fila; se apoya en el hueco + pieza de `Encaje`. */
export interface ContratoEleccion {
  tipo: 'unica' | 'multiple';
  forma: 'tarjeta' | 'chip' | 'fila';
  etiqueta: string;
  descripcion?: string;
  /** Marca de sugerencia (p. ej. "Sugerido para tu rubro"): el texto viene de content. */
  insignia?: string;
  /** Estado honesto del módulo: `proximamente` deshabilita y lo explica. */
  estadoModulo?: 'disponible' | 'en_demo' | 'proximamente' | 'a_medida';
  deshabilitado?: boolean;
}

/** Botón de dos estados (aria-pressed): vistas de la demo, voz del video, filtros. */
export interface ContratoInterruptor {
  presionado: boolean;
  etiqueta: string;
}

export interface ContratoCampo {
  etiqueta: string;
  ayuda?: string;
  /** Error de validación: se anuncia (aria-describedby + aria-invalid) y nunca es solo color. */
  error?: string;
  valido?: boolean;
  opcional?: boolean;
  /** Contador visible cuando hay límite (p. ej. 500 en "Otra cosa / a medida"). */
  maximo?: number;
}

/** Un solo diálogo para todo: <dialog> nativo. La hoja inferior es una variante de presentación. */
export interface ContratoDialogo {
  titulo: string;
  presentacion: 'centro' | 'hoja';
  etiquetaCerrar: string;
  abierto: boolean;
}

export interface ContratoPestanias {
  etiqueta: string;
  pestanias: { id: string; etiqueta: string }[];
  activa: string;
}

/** Preguntas frecuentes sobre <details>/<summary>: cero JS. */
export interface ContratoAcordeon {
  items: { id: string; pregunta: string; respuesta: string }[];
}

/** Progreso por pasos (wizard, seguimiento del pedido, capítulos del video). */
export interface ContratoPasos {
  pasos: { id: string; etiqueta: string }[];
  actual: number;
  /** "Paso 2 de 4": función de content/microcopy. */
  etiquetaProgreso: (paso: number, total: number) => string;
}

export interface ContratoEstadoVacio {
  ilustracion: string;
  titulo: string;
  texto: string;
  accion?: { etiqueta: string; href?: string };
}
