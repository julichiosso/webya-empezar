import type { Origen } from '@/config/origenes';

/**
 * Traspaso de una demo al wizard de /empezar. Es el contrato común entre las dos features (que no
 * se importan entre sí): la demo lo DEJA en sessionStorage antes de navegar y el wizard lo TOMA (lo
 * lee, lo borra y lo sanea contra sus catálogos) al arrancar. Acá no se valida nada contra el
 * catálogo: eso es del wizard, que nunca confía en lo que hay en storage.
 */
export interface TraspasoDemo {
  origen: Origen;
  rubro: string;
  /** Módulos que trae la demo: en el wizard quedan activados y el resto de lo sugerido, apagado. */
  modulos: readonly string[];
  nombreNegocio: string;
  /** Lo que armó en la demo (paleta y tipo de cocina). */
  demo: { paleta: string; cocina: string };
}

/** Adónde lleva el CTA de la demo: el wizard, que se descarga solo porque la URL apunta a #wizard. */
export const URL_WIZARD_DESDE_DEMO = '/empezar#wizard';

export const CLAVE_TRASPASO_DEMO = 'webya:traspaso-demo:v1';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** La demo deja el traspaso. Pisa uno anterior: la persona tocó "Quiero esto para mi local". */
export function dejarTraspasoDemo(datos: TraspasoDemo, storage: StorageLike): void {
  try {
    storage.setItem(CLAVE_TRASPASO_DEMO, JSON.stringify(datos));
  } catch {
    // Sin sessionStorage el wizard igual abre, desde el principio.
  }
}

/** El wizard lo toma UNA vez: lo devuelve sin sanear (desconocido) y lo borra. */
export function tomarTraspasoDemo(storage: StorageLike): unknown {
  try {
    const raw = storage.getItem(CLAVE_TRASPASO_DEMO);
    if (raw === null) return null;
    storage.removeItem(CLAVE_TRASPASO_DEMO);
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}
