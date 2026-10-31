/**
 * Punto de entrada del sistema de ilustración. Los listados (`ICONOS`, `DIBUJOS`, `ARTES_MODULO`)
 * son para recorrer todo el vocabulario (la vitrina de /sistema); las pantallas importan el
 * componente que usan. Los nombres de grupo son ids, no copy: los títulos viven en `src/content`.
 */
import { ESTADOS, ILUSTRACIONES, type DibujoId } from './dibujos/ids';
import {
  MODULO_ICONS,
  NECESIDAD_ICONS,
  RUBRO_ICONS,
  UI_ICONS,
  type IconName,
} from './iconos/paths';

export * from './grilla';
export { Cargando } from './Cargando';
export { Icon } from './iconos/Icon';
export { ICONO_DE_NECESIDAD, ICONS, isIconName, type IconName } from './iconos/paths';
export { Ilustracion } from './dibujos/Ilustracion';
export {
  DIBUJO_IDS,
  ESTADOS,
  esDibujo,
  esIlustracion,
  ILUSTRACIONES,
  type DibujoId,
  type EstadoId,
  type IlustracionId,
} from './dibujos/ids';
export { ModuloArte } from './modulos/ModuloArte';
export { IlustracionRubro } from './rubros/IlustracionRubro';
export { ESCENAS_RUBRO, esEscenaRubro, type EscenaRubro } from './rubros/ids';
export { ARTES_MODULO, esArteModulo, type ArteModulo } from './modulos/ids';

export type GrupoIcono = 'rubro' | 'modulo' | 'necesidad' | 'interfaz';
export type GrupoDibujo = 'plato' | 'estado';

const nombres = <T extends object>(o: T) => Object.keys(o) as (keyof T & IconName)[];

/** Todos los íconos (grilla 24), con su grupo, en el orden en que conviene mostrarlos. */
export const ICONOS: readonly { nombre: IconName; grupo: GrupoIcono }[] = [
  ...nombres(RUBRO_ICONS).map((nombre) => ({ nombre, grupo: 'rubro' as const })),
  ...nombres(MODULO_ICONS).map((nombre) => ({ nombre, grupo: 'modulo' as const })),
  ...nombres(NECESIDAD_ICONS).map((nombre) => ({ nombre, grupo: 'necesidad' as const })),
  ...nombres(UI_ICONS).map((nombre) => ({ nombre, grupo: 'interfaz' as const })),
];

/** Todos los dibujos (grilla 96), con su grupo. */
export const DIBUJOS: readonly { id: DibujoId; grupo: GrupoDibujo }[] = [
  ...ILUSTRACIONES.map((id) => ({ id, grupo: 'plato' as const })),
  ...ESTADOS.map((id) => ({ id, grupo: 'estado' as const })),
];
