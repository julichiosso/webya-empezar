/**
 * Ids de las necesidades del paso "¿Qué necesitás?". Son estables: se guardan en la base
 * (`leads.necesidades`). Las etiquetas y la relación con los módulos viven en
 * `src/content/necesidades.ts`.
 */
export const NECESIDAD_IDS = ['vender', 'turnos', 'carta', 'cobrar', 'clientes', 'otra'] as const;
export type NecesidadId = (typeof NECESIDAD_IDS)[number];

/** "Otra cosa": abre el camino del texto libre (a medida). */
export const NECESIDAD_OTRA_ID = 'otra' satisfies NecesidadId;
