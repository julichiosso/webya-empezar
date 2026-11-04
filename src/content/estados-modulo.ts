import type { EstadoModulo } from '@/config/modulos';

/** Cómo se dice cada estado de módulo en la UI (catálogo, paso de módulos y vista previa). */
export interface TextoEstado {
  /** Pastilla corta junto al nombre del módulo. */
  etiqueta: string;
  /** Una frase: qué significa para quien elige. Va debajo de la etiqueta o en la leyenda del catálogo. */
  explicacion: string;
}

/**
 * Estados honestos de los módulos (docs/plan-sprint.md §6). Se dicen tal cual: `proximamente` no se
 * puede activar como si existiera y `a_medida` lleva al camino libre ("Otra cosa").
 */
export const ESTADOS_MODULO_TEXTO = {
  disponible: {
    etiqueta: 'Disponible',
    explicacion: 'Lo podés activar ahora.',
  },
  en_demo: {
    etiqueta: 'Con demo',
    explicacion: 'Se puede probar en la demo.',
  },
  proximamente: {
    etiqueta: 'Próximamente',
    explicacion: 'Todavía no se puede activar.',
  },
  a_medida: {
    etiqueta: 'A medida',
    explicacion: 'Nos contás qué necesitás y lo armamos para vos.',
  },
} as const satisfies Record<EstadoModulo, TextoEstado>;

/** Textos alrededor de los estados (accesibles y acciones). */
export const ESTADO_MODULO_UI = {
  /** Para lectores de pantalla, pegado al nombre del módulo: "Pagos online, estado: Disponible". */
  accesible: (etiqueta: string) => `, estado: ${etiqueta}`,
  /** Se anuncia al intentar activar un módulo `proximamente`. */
  noSeActiva: 'Todavía no se puede activar. Si lo necesitás, contanoslo en "Otra cosa".',
  /** Acción de un módulo `a_medida`: lleva al texto libre. */
  irAMedida: 'Contanos qué necesitás',
  /** Enlace junto a un módulo `en_demo`. */
  verDemo: 'Probalo en la demo',
} as const;
