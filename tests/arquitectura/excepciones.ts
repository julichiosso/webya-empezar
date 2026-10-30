/**
 * Deuda registrada. Esta lista SOLO puede achicarse: el test falla si una entrada ya no hace falta.
 * Cada entrada dice quién la saca y en qué ola (docs/plan-sprint.md).
 */

/** "origen -> destino" (rutas dentro de src/, sin extensión) → motivo y dueño. */
export const EXCEPCIONES_CAPAS: Record<string, string> = {};

/** Archivo (ruta dentro de src/) → motivo y dueño. */
export const EXCEPCIONES_COPY: Record<string, string> = {};
