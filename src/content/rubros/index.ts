import { getModulo, type ModuloId } from '@/content/modulos';
import { rubro as comercio } from './comercio';
import { rubro as gastronomia } from './gastronomia';
import { rubro as gimnasioDeportes } from './gimnasio-deportes';
import { rubro as otro } from './otro';
import { rubro as peluqueriaEstetica } from './peluqueria-estetica';
import { rubro as profesionales } from './profesionales';
import { rubro as serviciosTecnicos } from './servicios-tecnicos';
import type { Rubro } from './types';

export type { Objetivo, Rubro } from './types';

/**
 * Registro de rubros. El orden define la grilla del paso 1; "otro" va siempre último.
 * Para sumar un rubro: crear su archivo y agregar UNA línea de import + UNA entrada acá
 * (ver .claude/skills/webya-add-rubro).
 */
export const RUBROS: readonly Rubro[] = [
  peluqueriaEstetica,
  gastronomia,
  comercio,
  profesionales,
  gimnasioDeportes,
  serviciosTecnicos,
  otro,
];

export const RUBRO_OTRO_ID = otro.id;

export const RUBRO_IDS: readonly string[] = RUBROS.map((r) => r.id);

export function getRubro(id: string | null | undefined): Rubro | undefined {
  return RUBROS.find((r) => r.id === id);
}

/** Módulos sugeridos de un rubro, resueltos con nombre y descripción (para el resumen y la UI). */
export function getModulosDeRubro(id: string | null | undefined) {
  const rubro = getRubro(id);
  return (rubro?.modulosSugeridos ?? []).map((m: ModuloId) => getModulo(m));
}

/** ¿Es este objetivo uno de los que ofrece ese rubro? (se usa en la validación del servidor) */
export function esObjetivoDeRubro(rubroId: string, objetivoId: string): boolean {
  return getRubro(rubroId)?.objetivos.some((o) => o.id === objetivoId) ?? false;
}
