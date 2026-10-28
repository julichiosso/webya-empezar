import type { ModuloId } from '../modulos';

/** Un objetivo que el negocio puede querer lograr (chip del paso 2). */
export interface Objetivo {
  /** snake_case ASCII, estable: se guarda en la base. */
  id: string;
  /** Voseo rioplatense, empieza con verbo cuando se puede. */
  etiqueta: string;
}

/**
 * Definición de un rubro. Agregar un rubro = un archivo en `src/config/rubros/` + su línea
 * en `index.ts`. Ningún componente depende de un rubro concreto.
 */
export interface Rubro {
  /** snake_case ASCII minúsculas, estable: se guarda en la base. */
  id: string;
  nombre: string;
  /** Clave del ícono en `src/components/icons/rubros` (se valida en los tests de la etapa de UI). */
  icono: string;
  descripcionCorta: string;
  objetivos: readonly Objetivo[];
  modulosSugeridos: readonly ModuloId[];
  /** Qué se arma para este rubro, breve y sin prometer precios ni plazos. */
  ejemploResultado: string;
}

/** Límites de contenido (los valida `rubros.test.ts`). */
export const LIMITES_RUBRO = {
  nombre: 40,
  descripcionCorta: 80,
  ejemploResultado: 160,
  etiquetaObjetivo: 48,
  minObjetivos: 2,
  maxObjetivos: 8,
} as const;
