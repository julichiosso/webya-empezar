import type { ModuloId } from '@/config/modulos';
import type { Origen } from '@/config/origenes';
import { getRubro } from '@/config/rubros';
import type { ModulosManual } from './modulos';
import { MODULOS_STORAGE_KEY } from './modulos-store';
import { DATOS_VACIOS, ESTADO_INICIAL, guardarEstado, type DesdeDemo } from './state';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface DatosDesdeDemo {
  origen: Origen;
  rubro: string;
  /** Módulos que trae la demo: quedan activados a mano; el resto de los sugeridos, apagados. */
  modulos: readonly ModuloId[];
  nombreNegocio: string;
  demo: DesdeDemo;
}

/** Adónde lleva el CTA de la demo: el wizard, que se descarga solo porque la URL apunta a #wizard. */
export const URL_WIZARD_DESDE_DEMO = '/empezar#wizard';

/**
 * Deja el wizard listo para seguir desde la demo: paso 2 con el rubro elegido, los módulos de la
 * demo activados y el nombre del local cargado. Usa la MISMA persistencia que el wizard
 * (sessionStorage), que al leer vuelve a sanear todo. Pisa un progreso anterior a propósito:
 * la persona tocó "Quiero esto para mi local".
 */
export function prepararWizardDesdeDemo(datos: DatosDesdeDemo, storage: StorageLike): void {
  guardarEstado(
    {
      ...ESTADO_INICIAL,
      paso: 2,
      rubro: datos.rubro,
      datos: { ...DATOS_VACIOS, nombreNegocio: datos.nombreNegocio.slice(0, 100) },
      origen: datos.origen,
      demo: datos.demo,
    },
    storage,
  );
  // Decisiones manuales: lo de la demo, prendido; lo sugerido por el rubro que no está, apagado.
  const manual: ModulosManual = {};
  for (const id of getRubro(datos.rubro)?.modulosSugeridos ?? []) manual[id] = false;
  for (const id of datos.modulos) manual[id] = true;
  try {
    storage.setItem(MODULOS_STORAGE_KEY, JSON.stringify(manual));
  } catch {
    // sin sessionStorage el wizard igual abre, con lo sugerido por el rubro
  }
}
