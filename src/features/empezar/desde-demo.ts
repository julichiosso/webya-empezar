import { esOrigen } from '@/config/origenes';
import { MODULO_IDS, type ModuloId } from '@/content/modulos';
import { getRubro } from '@/content/rubros';
import { LIMITES_BASE } from '@/domain/leads/limites';
import { tomarTraspasoDemo } from '@/domain/traspaso/demo-wizard';
import { MODULOS_STORAGE_KEY, type ModulosManual } from './modulos';
import { DATOS_VACIOS, ESTADO_INICIAL, guardarEstado, sanearDemo } from './state';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/**
 * Si la demo dejó un traspaso (domain/traspaso/demo-wizard), lo toma y deja el wizard listo para
 * seguir desde ahí: paso 3 (módulos), con el rubro de la demo, sus módulos activados y el nombre
 * del local cargado. Todo se sanea contra los catálogos; lo que no valida se descarta y el wizard
 * arranca normal. Pisa un progreso anterior a propósito: la persona tocó "Quiero esto para mi local".
 * Lo llaman el store de módulos y el wizard al arrancar (el que llegue primero; después no hay nada).
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

  guardarEstado(
    {
      ...ESTADO_INICIAL,
      paso: 3,
      rubro: rubro.id,
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
  // Decisiones manuales: lo de la demo, prendido; lo sugerido por el rubro que no está, apagado.
  const manual: ModulosManual = {};
  for (const id of rubro.modulosSugeridos as readonly ModuloId[]) manual[id] = false;
  for (const id of modulos) manual[id] = true;
  try {
    storage.setItem(MODULOS_STORAGE_KEY, JSON.stringify(manual));
  } catch {
    // sin sessionStorage el wizard igual abre, con lo sugerido por el rubro
  }
  return true;
}
