import { COCINA_IDS, PALETAS_DEMO, type CocinaId } from '@/config/demos/gastronomia';
import { esCentavos } from '@/domain/pedidos/dinero';
import { ESTADOS_PEDIDO, MEDIOS_PAGO, MODALIDADES, type Pedido } from '@/domain/pedidos/types';
import { claveLinea, type Carrito } from './carrito';
import {
  alCambiarLocalmente,
  aplicarEstadoRemoto,
  ESTADO_INICIAL_DEMO,
  MAXIMO_PEDIDOS,
  type EstadoDemo,
} from './store';

/**
 * Sincronización de la demo entre pestañas (sin backend): el estado se guarda en localStorage y
 * cada cambio local se difunde por BroadcastChannel. Si no hay BroadcastChannel (navegadores
 * viejos o internos), el evento `storage` hace de respaldo. Lo que llega se SANEA: nunca se confía
 * en lo guardado. Es solo para la demo: cada visitante ve sus propios datos de ejemplo.
 */
export const CLAVE_DEMO = 'webya:demo:gastronomia:v1';
const CANAL = 'webya-demo-gastronomia';

const esTexto = (v: unknown, max: number): v is string => typeof v === 'string' && v.length <= max;
const esEnteroPositivo = (v: unknown): v is number =>
  typeof v === 'number' && Number.isSafeInteger(v) && v > 0;
const incluye = <T extends string>(lista: readonly T[], v: unknown): v is T =>
  typeof v === 'string' && (lista as readonly string[]).includes(v);

function esPedido(v: unknown): v is Pedido {
  if (!v || typeof v !== 'object') return false;
  const p = v as Record<string, unknown>;
  const totales = p.totales as Record<string, unknown> | undefined;
  const cliente = p.cliente as Record<string, unknown> | undefined;
  return (
    esTexto(p.id, 64) &&
    esEnteroPositivo(p.numero) &&
    incluye(ESTADOS_PEDIDO, p.estado) &&
    incluye(MODALIDADES, p.modalidad) &&
    incluye(MEDIOS_PAGO, p.medioPago) &&
    esTexto(cliente?.nombre, 60) &&
    (p.mesa === null || esTexto(p.mesa, 10)) &&
    (p.direccion === null || esTexto(p.direccion, 160)) &&
    !!totales &&
    ['subtotal', 'propina', 'envio', 'total'].every((k) => esCentavos(totales[k])) &&
    Array.isArray(p.items) &&
    p.items.length > 0 &&
    p.items.every((i: Record<string, unknown>) => {
      return (
        esTexto(i?.nombre, 120) &&
        esEnteroPositivo(i.cantidad) &&
        esCentavos(i.precioUnitario) &&
        Array.isArray(i.modificadores) &&
        (i.nota === null || esTexto(i.nota, 140))
      );
    }) &&
    Array.isArray(p.eventos) &&
    esTexto(p.creadoEn, 40) &&
    !Number.isNaN(Date.parse(p.creadoEn as string))
  );
}

function sanearCarrito(v: unknown): Carrito {
  if (!Array.isArray(v)) return [];
  return v
    .filter(
      (l): l is Carrito[number] =>
        !!l &&
        esTexto(l.productoId, 60) &&
        esEnteroPositivo(l.cantidad) &&
        l.cantidad <= 20 &&
        Array.isArray(l.modificadores),
    )
    .map((l) => ({ ...l, clave: claveLinea(l) }))
    .slice(0, 30);
}

/** Lee y SANEA un estado guardado o recibido. Lo inválido se descarta (no se rompe la demo). */
export function sanearEstado(raw: unknown): EstadoDemo | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;
  const pedidos = Array.isArray(d.pedidos) ? d.pedidos.filter(esPedido).slice(-MAXIMO_PEDIDOS) : [];
  const seguimientoId =
    typeof d.seguimientoId === 'string' && pedidos.some((p) => p.id === d.seguimientoId)
      ? d.seguimientoId
      : null;
  return {
    cocinaId: incluye(COCINA_IDS, d.cocinaId)
      ? (d.cocinaId as CocinaId)
      : ESTADO_INICIAL_DEMO.cocinaId,
    nombreLocal:
      typeof d.nombreLocal === 'string' && d.nombreLocal.trim().length > 0
        ? d.nombreLocal.slice(0, 40)
        : null,
    paletaId: PALETAS_DEMO.some((p) => p.id === d.paletaId)
      ? (d.paletaId as string)
      : ESTADO_INICIAL_DEMO.paletaId,
    carrito: sanearCarrito(d.carrito),
    pedidos,
    seguimientoId,
  };
}

type Almacen = Pick<Storage, 'getItem' | 'setItem'>;

export function leerGuardado(almacen: Almacen): EstadoDemo | null {
  try {
    const raw = almacen.getItem(CLAVE_DEMO);
    return raw ? sanearEstado(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function guardar(almacen: Almacen, e: EstadoDemo) {
  try {
    almacen.setItem(CLAVE_DEMO, JSON.stringify(e));
  } catch {
    // Cuota llena, modo privado o navegador interno: la demo sigue andando en esta pestaña.
  }
}

/**
 * Arranca la sincronización (una vez, en el cliente). Restaura lo guardado, escucha a las otras
 * pestañas y difunde los cambios locales. Devuelve la función que la apaga.
 */
export function iniciarSincronizacion(
  opciones: { almacen?: Almacen; crearCanal?: (nombre: string) => BroadcastChannel | null } = {},
): () => void {
  const almacen = opciones.almacen ?? safeLocalStorage();
  const crearCanal =
    opciones.crearCanal ??
    ((nombre: string) =>
      typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(nombre));

  if (almacen) {
    const guardado = leerGuardado(almacen);
    if (guardado) aplicarEstadoRemoto(guardado);
  }

  const canal = crearCanal(CANAL);
  const recibir = (datos: unknown) => {
    const e = sanearEstado(datos);
    if (e) aplicarEstadoRemoto(e);
  };
  if (canal) canal.onmessage = (ev: MessageEvent) => recibir(ev.data);

  // Respaldo sin BroadcastChannel: otra pestaña escribió en localStorage.
  const onStorage = (ev: StorageEvent) => {
    if (canal || ev.key !== CLAVE_DEMO || !ev.newValue) return;
    try {
      recibir(JSON.parse(ev.newValue));
    } catch {
      // ignorado: dato corrupto
    }
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);

  const desuscribir = alCambiarLocalmente((e) => {
    if (almacen) guardar(almacen, e);
    try {
      canal?.postMessage(e);
    } catch {
      // un canal cerrado no debe romper la demo
    }
  });

  return () => {
    desuscribir();
    canal?.close();
    if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}

function safeLocalStorage(): Almacen | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}
