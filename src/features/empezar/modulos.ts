import { getModulo, MODULO_IDS, type ModuloId } from '@/content/modulos';
import { getNecesidad } from '@/content/necesidades';
import { getRubro } from '@/content/rubros';

/** sessionStorage de las decisiones manuales sobre módulos (compartidas con el hero). */
export const MODULOS_STORAGE_KEY = 'webya:empezar:modulos:v1';

/**
 * Lo que la persona decidió A MANO sobre cada módulo: `true` = lo activó, `false` = lo apagó.
 * Un módulo sin entrada sigue la sugerencia (rubro + necesidades marcadas). Guardar solo las
 * decisiones manuales (y derivar el resto) hace imposible que queden módulos "fantasma" al cambiar
 * de rubro y garantiza que lo elegido a mano nunca se pise.
 */
export type ModulosManual = Partial<Record<ModuloId, boolean>>;

/** Lo que sugieren las necesidades marcadas en el paso 1. */
export function sugeridosPorNecesidad(necesidades: readonly string[]): Set<ModuloId> {
  return new Set(necesidades.flatMap((n) => getNecesidad(n)?.modulosSugeridos ?? []));
}

/**
 * Módulos activos: la decisión manual manda; si no hay, la sugerencia del rubro o de las
 * necesidades. Un módulo `proximamente` nunca queda activo (no se puede pedir como si existiera).
 * Orden del catálogo.
 */
export function modulosSeleccionados(
  rubroId: string | null | undefined,
  manual: ModulosManual,
  necesidades: readonly string[] = [],
): ModuloId[] {
  const sugeridos = new Set<ModuloId>([
    ...(getRubro(rubroId)?.modulosSugeridos ?? []),
    ...sugeridosPorNecesidad(necesidades),
  ]);
  return MODULO_IDS.filter(
    (id) => getModulo(id).estado !== 'proximamente' && (manual[id] ?? sugeridos.has(id)),
  );
}

/** Invierte el estado visible de un módulo y lo registra como decisión manual. */
export function alternarModulo(
  rubroId: string | null | undefined,
  manual: ModulosManual,
  id: ModuloId,
  necesidades: readonly string[] = [],
): ModulosManual {
  const activo = modulosSeleccionados(rubroId, manual, necesidades).includes(id);
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
