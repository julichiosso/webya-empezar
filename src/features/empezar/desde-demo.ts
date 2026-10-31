import { esOrigen } from '@/config/origenes';
import { MODULO_IDS, type ModuloId } from '@/content/modulos';
import { getRubro } from '@/content/rubros';
import { LIMITES_BASE } from '@/domain/leads/limites';
import { tomarTraspasoDemo } from '@/domain/traspaso/demo-wizard';
import type { ModulosManual } from './modulos';
import { DATOS_VACIOS, ESTADO_INICIAL, guardarEstado, sanearDemo } from './state';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/**
 * Si la demo dejó un traspaso (domain/traspaso/demo-wizard), lo toma y deja el flujo listo para
 * seguir desde ahí: pantalla 2 (negocio), con el rubro de la demo, sus módulos y el nombre del
 * local cargado. Todo se sanea contra los catálogos; lo que no valida se descarta y el flujo
 * arranca normal. Pisa un progreso anterior a propósito: la persona tocó "Quiero esto para mi local".
 */
export function aplicarTraspasoDemo(storage: StorageLike): boolean {
  const t = tomarTraspasoDemo(storage);
  if (!t || typeof t !== 'object') return false;
  const d = t as Record<string, unknown>;
  const rubro = typeof d.rubro === 'string' ? getRubro(d.rubro) : undefined;
  if (!rubro || !esOrigen(d.origen)) return false;
  const modulos = Array.isArray(d.modulos)
    ? MODULO_IDS.filter((id) => (d.modulos as unknown[]).includes(id))
    : [];
  // Decisiones a mano: lo de la demo, prendido; lo sugerido por el rubro que no está, apagado.
  const modulosManual: ModulosManual = {};
  for (const id of rubro.modulosSugeridos as readonly ModuloId[]) modulosManual[id] = false;
  for (const id of modulos) modulosManual[id] = true;

  guardarEstado(
    {
      ...ESTADO_INICIAL,
      paso: 'negocio',
      rubro: rubro.id,
      modulosManual,
      datos: {
        ...DATOS_VACIOS,
        nombreNegocio:
          typeof d.nombreNegocio === 'string'
            ? d.nombreNegocio.slice(0, LIMITES_BASE.nombreNegocio)
            : '',
      },
      origen: d.origen,
      demo: sanearDemo(d.demo),
    },
    storage,
  );
  return true;
}
