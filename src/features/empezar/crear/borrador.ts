import { esPaletaCurada, PALETA_CURADA_POR_DEFECTO, type PaletaCuradaId } from '@/content/paletas';
import { getPlantilla } from '@/content/rubros';
import { parsePhoneAR } from '@/lib/phone';
import { sanitizeLine } from '@/lib/sanitize';

/**
 * El borrador de un sitio. Viaja entero en el hash del link (`/ver#...`): no pasa por el servidor, no
 * queda en ningún log y no hace falta cuenta ni base de datos. Todo lo que llega de un link se sanea
 * acá: es texto de un desconocido.
 */
export interface ItemBorrador {
  nombre: string;
  precio: string;
}

export interface BorradorSitio {
  rubro: string;
  nombre: string;
  bajada: string;
  ciudad: string;
  horario: string;
  /** Tal como lo escribió la persona; para el link se valida con parsePhoneAR. */
  whatsapp: string;
  paleta: PaletaCuradaId;
  items: readonly ItemBorrador[];
}

export const LIMITES_BORRADOR = {
  nombre: 60,
  bajada: 120,
  ciudad: 60,
  horario: 80,
  whatsapp: 24,
  itemNombre: 50,
  itemPrecio: 16,
  items: 8,
  /** Un link más largo que esto no se abre: lo armó otra cosa que el editor. */
  codificado: 4096,
} as const;

const linea = (v: unknown, max: number) =>
  typeof v === 'string' ? sanitizeLine(v).slice(0, max) : '';

export function borradorVacio(rubro: string): BorradorSitio {
  return {
    rubro,
    nombre: '',
    bajada: '',
    ciudad: '',
    horario: '',
    whatsapp: '',
    paleta: PALETA_CURADA_POR_DEFECTO,
    items: [],
  };
}

/** Devuelve un borrador válido o null. Es la única puerta de lo que llega de afuera. */
export function sanearBorrador(crudo: unknown): BorradorSitio | null {
  if (typeof crudo !== 'object' || crudo === null) return null;
  const d = crudo as Record<string, unknown>;
  if (typeof d.rubro !== 'string' || !getPlantilla(d.rubro)) return null;
  const items = Array.isArray(d.items) ? d.items : [];
  return {
    rubro: d.rubro,
    nombre: linea(d.nombre, LIMITES_BORRADOR.nombre),
    bajada: linea(d.bajada, LIMITES_BORRADOR.bajada),
    ciudad: linea(d.ciudad, LIMITES_BORRADOR.ciudad),
    horario: linea(d.horario, LIMITES_BORRADOR.horario),
    whatsapp: linea(d.whatsapp, LIMITES_BORRADOR.whatsapp),
    paleta: esPaletaCurada(d.paleta) ? d.paleta : PALETA_CURADA_POR_DEFECTO,
    items: items
      .slice(0, LIMITES_BORRADOR.items)
      .map((it: unknown) => {
        const i = (typeof it === 'object' && it !== null ? it : {}) as Record<string, unknown>;
        return {
          nombre: linea(i.nombre, LIMITES_BORRADOR.itemNombre),
          precio: linea(i.precio, LIMITES_BORRADOR.itemPrecio),
        };
      })
      .filter((it) => it.nombre.length > 0),
  };
}

const aBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');

const deBase64Url = (texto: string) =>
  Uint8Array.from(atob(texto.replaceAll('-', '+').replaceAll('_', '/')), (c) => c.charCodeAt(0));

/** Solo lo cargado: un link más corto entra mejor en un QR. */
export function codificarBorrador(b: BorradorSitio): string {
  const { items, ...resto } = b;
  const cargado = Object.fromEntries(Object.entries(resto).filter(([, v]) => v !== ''));
  const conItems = items.filter((i) => i.nombre.trim());
  return aBase64Url(
    new TextEncoder().encode(
      JSON.stringify({ ...cargado, ...(conItems.length > 0 ? { items: conItems } : {}) }),
    ),
  );
}

export function decodificarBorrador(codificado: string): BorradorSitio | null {
  if (!codificado || codificado.length > LIMITES_BORRADOR.codificado) return null;
  try {
    return sanearBorrador(JSON.parse(new TextDecoder().decode(deBase64Url(codificado))));
  } catch {
    return null;
  }
}

/** El número en el formato de wa.me, o null si no es un celular argentino válido. */
export function whatsappDeBorrador(b: Pick<BorradorSitio, 'whatsapp'>): string | null {
  const t = parsePhoneAR(b.whatsapp);
  return t.ok ? t.wa : null;
}
