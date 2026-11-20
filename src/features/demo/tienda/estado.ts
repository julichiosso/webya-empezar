import {
  COLORES_TIENDA,
  MAX_PRODUCTOS,
  RUBROS_TIENDA,
  type FotoId,
  type RubroTienda,
} from '@/content/demos/tienda/datos';

/** Un producto de la vista previa. `propia`: URL local (blob:) de una foto que subió la persona. */
export interface ProductoTienda {
  id: number;
  nombre: string;
  precio: number;
  foto: FotoId;
  propia?: string;
}

export interface EstadoTienda {
  rubroId: string;
  nombre: string;
  colorId: string;
  logo?: string;
  productos: readonly ProductoTienda[];
  /** Para ids de productos nuevos. */
  siguiente: number;
}

export type AccionTienda =
  | { tipo: 'rubro'; id: string }
  | { tipo: 'nombre'; valor: string }
  | { tipo: 'color'; id: string }
  | { tipo: 'logo'; url?: string }
  | { tipo: 'producto'; id: number; cambios: Partial<Omit<ProductoTienda, 'id'>> }
  | { tipo: 'agregar' }
  | { tipo: 'quitar'; id: number }
  | { tipo: 'reiniciar' };

export const rubroDe = (id: string): RubroTienda =>
  RUBROS_TIENDA.find((r) => r.id === id) ?? RUBROS_TIENDA[0]!;

function productosDe(rubro: RubroTienda): ProductoTienda[] {
  return rubro.productos.map((p, i) => ({ id: i + 1, ...p }));
}

export function estadoInicial(rubroId = RUBROS_TIENDA[0]!.id): EstadoTienda {
  const rubro = rubroDe(rubroId);
  return {
    rubroId: rubro.id,
    nombre: rubro.ejemplo,
    colorId: COLORES_TIENDA[0]!.id,
    productos: productosDe(rubro),
    siguiente: rubro.productos.length + 1,
  };
}

/** Precio escrito por la persona → pesos enteros entre 0 y 99.999.999 (sin puntos ni signos). */
export function leerPrecio(texto: string): number {
  const n = Number(texto.replace(/\D/g, '').slice(0, 8));
  return Number.isFinite(n) ? n : 0;
}

export function reducirTienda(e: EstadoTienda, a: AccionTienda): EstadoTienda {
  switch (a.tipo) {
    case 'rubro': {
      // Cambiar de rubro trae sus productos de ejemplo; el nombre se reemplaza solo si era el de ejemplo.
      const anterior = rubroDe(e.rubroId);
      const nuevo = rubroDe(a.id);
      return {
        ...e,
        rubroId: nuevo.id,
        nombre: e.nombre === anterior.ejemplo ? nuevo.ejemplo : e.nombre,
        productos: productosDe(nuevo),
        siguiente: nuevo.productos.length + 1,
      };
    }
    case 'nombre':
      return { ...e, nombre: a.valor.slice(0, 40) };
    case 'color':
      return COLORES_TIENDA.some((c) => c.id === a.id) ? { ...e, colorId: a.id } : e;
    case 'logo':
      return { ...e, logo: a.url };
    case 'producto':
      return {
        ...e,
        productos: e.productos.map((p) =>
          p.id === a.id
            ? {
                ...p,
                ...a.cambios,
                nombre: (a.cambios.nombre ?? p.nombre).slice(0, 40),
              }
            : p,
        ),
      };
    case 'agregar': {
      if (e.productos.length >= MAX_PRODUCTOS) return e;
      const rubro = rubroDe(e.rubroId);
      const base = rubro.productos[e.productos.length % rubro.productos.length]!;
      return {
        ...e,
        productos: [...e.productos, { id: e.siguiente, ...base }],
        siguiente: e.siguiente + 1,
      };
    }
    case 'quitar':
      return e.productos.length <= 1
        ? e
        : { ...e, productos: e.productos.filter((p) => p.id !== a.id) };
    case 'reiniciar':
      return estadoInicial();
  }
}
