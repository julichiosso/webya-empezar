import { MODULO_IDS, type ModuloId } from '@/content/modulos';
import { getRubro } from '@/content/rubros';

/**
 * Lo que la persona decidió A MANO sobre cada módulo: `true` = lo activó, `false` = lo apagó.
 * Un módulo sin entrada sigue la sugerencia del rubro. Guardar solo las decisiones manuales
 * (y derivar el resto) hace imposible que queden módulos "fantasma" al cambiar de rubro y
 * garantiza que lo elegido a mano nunca se pise.
 */
export type ModulosManual = Partial<Record<ModuloId, boolean>>;

/** Módulos activos: la decisión manual manda; si no hay, la sugerencia del rubro. Orden del catálogo. */
export function modulosSeleccionados(
  rubroId: string | null | undefined,
  manual: ModulosManual,
): ModuloId[] {
  const sugeridos = new Set<ModuloId>(getRubro(rubroId)?.modulosSugeridos ?? []);
  return MODULO_IDS.filter((id) => manual[id] ?? sugeridos.has(id));
}

/** Invierte el estado visible de un módulo y lo registra como decisión manual. */
export function alternarModulo(
  rubroId: string | null | undefined,
  manual: ModulosManual,
  id: ModuloId,
): ModulosManual {
  const activo = modulosSeleccionados(rubroId, manual).includes(id);
  return { ...manual, [id]: !activo };
}

/** ¿Lo sugiere el rubro elegido? (para mostrar "Sugerido para tu rubro"). */
export function esSugerido(rubroId: string | null | undefined, id: ModuloId): boolean {
  return getRubro(rubroId)?.modulosSugeridos.includes(id) ?? false;
}

/** Sanea lo leído de sessionStorage: solo ids del catálogo con valor booleano. */
export function sanearManual(raw: unknown): ModulosManual {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  const origen = raw as Record<string, unknown>;
  const out: ModulosManual = {};
  for (const id of MODULO_IDS) {
    if (typeof origen[id] === 'boolean') out[id] = origen[id];
  }
  return out;
}
