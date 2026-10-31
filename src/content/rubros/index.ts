import { getModulo, type ModuloId } from '@/content/modulos';
import { rubro as comercio } from './comercio';
import { rubro as gastronomia } from './gastronomia';
import { rubro as gimnasioDeportes } from './gimnasio-deportes';
import { rubro as otro } from './otro';
import { rubro as peluqueriaEstetica } from './peluqueria-estetica';
import { rubro as profesionales } from './profesionales';
import { rubro as serviciosTecnicos } from './servicios-tecnicos';
import type { PlantillaRubro, Rubro } from './types';

export type {
  DetalleDeModulo,
  ItemDeEjemplo,
  Objetivo,
  PlantillaRubro,
  PortadaPlantilla,
  Rubro,
  SeccionPlantilla,
  TipoSeccion,
} from './types';

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

/** Sitio de ejemplo del rubro para la vista previa; undefined si no tiene ("otro" o desconocido). */
export function getPlantilla(id: string | null | undefined): PlantillaRubro | undefined {
  return getRubro(id)?.plantilla;
}

/** Rubros que tienen vista previa (todos menos "otro"). */
export const RUBROS_CON_VISTA_PREVIA: readonly Rubro[] = RUBROS.filter((r) => r.plantilla);

/** Módulos que se ven en la plantilla (portada, secciones, botones de ítems y detalles), sin repetir. */
export function modulosDePlantilla(p: PlantillaRubro): ModuloId[] {
  const ids: ModuloId[] = [p.portada.accion.modulo];
  if (p.portada.detalle) ids.push(p.portada.detalle.modulo);
  for (const s of p.secciones) {
    if (s.modulo) ids.push(s.modulo);
    if (s.detalle) ids.push(s.detalle.modulo);
    if (s.tipo === 'lista' && s.moduloItems) ids.push(s.moduloItems);
  }
  return [...new Set(ids)];
}

/** Todos los textos de ejemplo de una plantilla (para validar límites y reglas de copy). */
export function textosDePlantilla(p: PlantillaRubro): string[] {
  const { portada } = p;
  const textos = [portada.tituloDeEjemplo, portada.bajada, portada.accion.texto];
  textos.push(portada.accionSinModulo, ...(portada.detalle ? [portada.detalle.texto] : []));
  for (const s of p.secciones) {
    textos.push(s.titulo, ...(s.detalle ? [s.detalle.texto] : []));
    if (s.tipo === 'lista') for (const i of s.items) textos.push(i.nombre, i.detalle ?? '');
    if (s.tipo === 'agenda') textos.push(...s.dias, ...s.franjas);
    if (s.tipo === 'formulario') textos.push(...s.campos, s.accion);
    if (s.tipo === 'horarios') for (const f of s.filas) textos.push(f.dias, f.horario);
    if (s.tipo === 'contacto') textos.push(s.whatsapp, s.ubicacion);
  }
  return textos.filter((t) => t.length > 0);
}

/** ¿Es este objetivo uno de los que ofrece ese rubro? (se usa en la validación del servidor) */
export function esObjetivoDeRubro(rubroId: string, objetivoId: string): boolean {
  return getRubro(rubroId)?.objetivos.some((o) => o.id === objetivoId) ?? false;
}
