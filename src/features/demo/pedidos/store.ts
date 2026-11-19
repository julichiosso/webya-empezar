import {
  ES_MITAD,
  FRANJAS_PAUSADAS,
  NOCHE_DEMO,
  NOMBRES_EJEMPLO,
  OCUPACION_INICIAL,
  PRODUCTOS,
  TAMANIOS,
  type Producto,
  type SeccionId,
  type Tamanio,
} from '@/content/demos/pedidos/carta';
import { lineaItem } from '@/content/demos/pedidos/ui';
import {
  calcularRetiro,
  elegirFranja,
  franjasElegibles,
  generarRangos,
  hhmmAMin,
  type Franja,
  type Retiro,
} from '@/domain/retiro/franjas';

/**
 * Estado de la demo de pedidos: lo comparten la app del cliente y el panel del dueño, en la misma
 * página. Todo en memoria (se pierde al recargar, y "Reiniciar" vuelve al principio). Funciones puras
 * más un store mínimo para `useSyncExternalStore`.
 */

export interface ItemCarrito {
  clave: string;
  productoId: string;
  tamanio: Tamanio;
  mitadId?: string;
  cantidad: number;
}

export type EstadoPedido = 'pendiente' | 'confirmado';

export interface Pedido {
  id: number;
  /** Inicio de su franja (minutos). */
  franja: number;
  /** Hora estimada de retiro (minutos). */
  retiro: number;
  /** Cuándo entró (minutos). */
  creado: number;
  nombre: string;
  lineas: readonly string[];
  total: number;
  estado: EstadoPedido;
  /** Lo hizo quien prueba la demo. */
  propio: boolean;
}

export interface FranjaConfig {
  inicio: number;
  fin: number;
  capacidad: number;
  bloqueado: boolean;
}

export interface EstadoDemo {
  abierto: boolean;
  franjas: readonly FranjaConfig[];
  pedidos: readonly Pedido[];
  productos: Readonly<Record<string, { activo: boolean; destacado: boolean }>>;
  carrito: readonly ItemCarrito[];
  ultimoPropio: number | null;
  comandaVista: boolean;
  /** Date.now() al empezar: el reloj de la demo corre desde las 20:40 con el tiempo real. */
  inicioReal: number;
}

const PRIMER_ID = 101;

export const getProducto = (id: string): Producto | undefined => PRODUCTOS.find((p) => p.id === id);

export const precioItem = (it: Pick<ItemCarrito, 'productoId' | 'tamanio'>) =>
  getProducto(it.productoId)?.precios[it.tamanio] ?? 0;

export function nombreItem(it: Pick<ItemCarrito, 'productoId' | 'mitadId'>) {
  const p = getProducto(it.productoId)?.nombre ?? '';
  const m = it.mitadId ? getProducto(it.mitadId)?.nombre : undefined;
  return m ? `${p} / ${m}` : p;
}

export const lineaDe = (it: ItemCarrito) =>
  lineaItem(it.cantidad, nombreItem(it), TAMANIOS[it.tamanio]);

export const totalItems = (items: readonly ItemCarrito[]) =>
  items.reduce((s, it) => s + precioItem(it) * it.cantidad, 0);

export const cantidadCarrito = (e: EstadoDemo) => e.carrito.reduce((s, it) => s + it.cantidad, 0);

/** Pedidos de la noche de ejemplo: llenan las primeras franjas para que se vea el salto. */
function pedidosIniciales(): Pedido[] {
  const pedidos: Pedido[] = [];
  const pizzas = PRODUCTOS.filter((p) => p.seccion === 'pizzas');
  let n = 0;
  for (const { franja, cantidad } of OCUPACION_INICIAL) {
    for (let i = 0; i < cantidad; i++, n++) {
      const pizza = pizzas[n % pizzas.length]!;
      const items: ItemCarrito[] = [
        { clave: '', productoId: pizza.id, tamanio: n % 3 === 0 ? 'clasica' : 'xl', cantidad: 1 },
      ];
      if (n % 2 === 0)
        items.push({ clave: '', productoId: 'gaseosa', tamanio: 'unico', cantidad: 1 });
      pedidos.push({
        id: PRIMER_ID + n,
        franja: hhmmAMin(franja),
        retiro: hhmmAMin(franja) + 10,
        creado: hhmmAMin(franja) - 30 + i,
        nombre: NOMBRES_EJEMPLO[n % NOMBRES_EJEMPLO.length]!,
        lineas: items.map(lineaDe),
        total: totalItems(items),
        // Uno de la franja que viene todavía no mandó el WhatsApp: el dueño lo puede confirmar.
        estado: franja === '21:00' && i === 0 ? 'pendiente' : 'confirmado',
        propio: false,
      });
    }
  }
  return pedidos;
}

export function crearEstado(ahoraReal: number): EstadoDemo {
  const pausadas = new Set(FRANJAS_PAUSADAS.map(hhmmAMin));
  return {
    abierto: true,
    franjas: generarRangos(NOCHE_DEMO.apertura, NOCHE_DEMO.cierre).map((r) => ({
      ...r,
      capacidad: NOCHE_DEMO.capacidad,
      bloqueado: pausadas.has(r.inicio),
    })),
    pedidos: pedidosIniciales(),
    productos: Object.fromEntries(
      PRODUCTOS.map((p) => [p.id, { activo: true, destacado: Boolean(p.destacado) }]),
    ),
    carrito: [],
    ultimoPropio: null,
    comandaVista: false,
    inicioReal: ahoraReal,
  };
}

/** Minuto del día en la demo: arranca a las 20:40 y avanza con el reloj real. */
export const ahoraDemo = (e: EstadoDemo, ahoraReal: number) =>
  hhmmAMin(NOCHE_DEMO.hora) + Math.max(0, Math.floor((ahoraReal - e.inicioReal) / 60000));

/** Las franjas con sus pedidos contados (en la demo no hay pendientes vencidos: todos ocupan cupo). */
export const franjasConConteo = (e: EstadoDemo): Franja[] =>
  e.franjas.map((f) => ({ ...f, pedidos: e.pedidos.filter((p) => p.franja === f.inicio).length }));

export const productosVisibles = (e: EstadoDemo, seccion?: SeccionId) =>
  PRODUCTOS.filter((p) => e.productos[p.id]?.activo && (!seccion || p.seccion === seccion));

export const destacados = (e: EstadoDemo) =>
  PRODUCTOS.filter((p) => e.productos[p.id]?.activo && e.productos[p.id]?.destacado);

export type ModoRetiro = { modo: 'asap' } | { modo: 'franja'; inicio: number };

export interface Cotizacion {
  franja: Franja;
  retiro: Retiro;
  huboSalto: boolean;
}

/** Franja y hora de retiro para el modo elegido, o null si no hay cupo (o el local está cerrado). */
export function cotizar(e: EstadoDemo, ahora: number, modo: ModoRetiro): Cotizacion | null {
  if (!e.abierto) return null;
  const franjas = franjasConConteo(e);
  if (modo.modo === 'franja') {
    const f = franjasElegibles(franjas, ahora).find((x) => x.inicio === modo.inicio);
    return f ? { franja: f, retiro: calcularRetiro(f, ahora), huboSalto: false } : null;
  }
  const r = elegirFranja(franjas, ahora);
  return r
    ? {
        franja: r.franja,
        retiro: calcularRetiro(r.franja, ahora, r.huboSalto),
        huboSalto: r.huboSalto,
      }
    : null;
}

const claveDe = (productoId: string, tamanio: Tamanio, mitadId?: string) =>
  [productoId, tamanio, mitadId ?? ''].join('|');

/* ---------------- Acciones (puras) ---------------- */

export function agregar(
  e: EstadoDemo,
  productoId: string,
  tamanio: Tamanio,
  mitadId?: string,
): EstadoDemo {
  const mitad = ES_MITAD[tamanio] ? mitadId : undefined;
  const clave = claveDe(productoId, tamanio, mitad);
  const existe = e.carrito.find((it) => it.clave === clave);
  const carrito = existe
    ? e.carrito.map((it) => (it.clave === clave ? { ...it, cantidad: it.cantidad + 1 } : it))
    : [...e.carrito, { clave, productoId, tamanio, mitadId: mitad, cantidad: 1 }];
  return { ...e, carrito };
}

export function cambiarCantidad(e: EstadoDemo, clave: string, delta: number): EstadoDemo {
  const carrito = e.carrito
    .map((it) => (it.clave === clave ? { ...it, cantidad: it.cantidad + delta } : it))
    .filter((it) => it.cantidad > 0);
  return { ...e, carrito };
}

/** Confirma el carrito: el pedido queda "pendiente" en su franja hasta que sale el WhatsApp. */
export function crearPedido(
  e: EstadoDemo,
  ahora: number,
  datos: { nombre: string; modo: ModoRetiro },
): { estado: EstadoDemo; pedido: Pedido } | null {
  const nombre = datos.nombre.trim().slice(0, 81);
  if (!nombre || e.carrito.length === 0) return null;
  const c = cotizar(e, ahora, datos.modo);
  if (!c) return null;
  const id = Math.max(PRIMER_ID - 1, ...e.pedidos.map((p) => p.id)) + 1;
  const pedido: Pedido = {
    id,
    franja: c.franja.inicio,
    retiro: c.retiro.hora,
    creado: ahora,
    nombre,
    lineas: e.carrito.map(lineaDe),
    total: totalItems(e.carrito),
    estado: 'pendiente',
    propio: true,
  };
  return {
    estado: { ...e, pedidos: [...e.pedidos, pedido], carrito: [], ultimoPropio: id },
    pedido,
  };
}

export const confirmarPedido = (e: EstadoDemo, id: number): EstadoDemo => ({
  ...e,
  pedidos: e.pedidos.map((p) => (p.id === id ? { ...p, estado: 'confirmado' } : p)),
});

export const alternarAbierto = (e: EstadoDemo): EstadoDemo => ({ ...e, abierto: !e.abierto });

export const alternarBloqueo = (e: EstadoDemo, inicio: number): EstadoDemo => ({
  ...e,
  franjas: e.franjas.map((f) => (f.inicio === inicio ? { ...f, bloqueado: !f.bloqueado } : f)),
});

export const cambiarCapacidad = (e: EstadoDemo, inicio: number, delta: number): EstadoDemo => ({
  ...e,
  franjas: e.franjas.map((f) =>
    f.inicio === inicio ? { ...f, capacidad: Math.min(20, Math.max(0, f.capacidad + delta)) } : f,
  ),
});

export function alternarProducto(
  e: EstadoDemo,
  id: string,
  campo: 'activo' | 'destacado',
): EstadoDemo {
  const actual = e.productos[id];
  if (!actual) return e;
  return { ...e, productos: { ...e.productos, [id]: { ...actual, [campo]: !actual[campo] } } };
}

export const marcarComandaVista = (e: EstadoDemo): EstadoDemo =>
  e.comandaVista ? e : { ...e, comandaVista: true };

/* ---------------- Store ---------------- */

export interface StoreDemo {
  get: () => EstadoDemo;
  set: (f: (e: EstadoDemo) => EstadoDemo) => void;
  subscribe: (escuchar: () => void) => () => void;
}

export function crearStore(ahoraReal: number): StoreDemo {
  let estado = crearEstado(ahoraReal);
  const escuchas = new Set<() => void>();
  return {
    get: () => estado,
    set: (f) => {
      const nuevo = f(estado);
      if (nuevo === estado) return;
      estado = nuevo;
      escuchas.forEach((l) => l());
    },
    subscribe: (l) => {
      escuchas.add(l);
      return () => escuchas.delete(l);
    },
  };
}
