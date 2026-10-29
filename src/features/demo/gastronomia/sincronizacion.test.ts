import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CLAVE_DEMO, iniciarSincronizacion, leerGuardado, sanearEstado } from './sincronizacion';
import {
  agregarAlCarrito,
  confirmarPedido,
  ESTADO_INICIAL_DEMO,
  getEstadoDemo,
  reiniciarStoreDemo,
  type EstadoDemo,
} from './store';

/** Almacenamiento en memoria con la misma forma que localStorage. */
function almacenFalso(inicial: Record<string, string> = {}) {
  const datos = new Map(Object.entries(inicial));
  return {
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => void datos.set(k, v),
    leer: (k: string) => datos.get(k),
  };
}

/** Canal "BroadcastChannel" en memoria: lo que postea uno lo reciben los otros del mismo nombre. */
function redDeCanales() {
  const canales: { nombre: string; onmessage: ((e: MessageEvent) => void) | null; c: unknown }[] =
    [];
  const crear = (nombre: string) => {
    const reg = {
      nombre,
      onmessage: null as ((e: MessageEvent) => void) | null,
      c: null as unknown,
    };
    const canal = {
      set onmessage(fn: ((e: MessageEvent) => void) | null) {
        reg.onmessage = fn;
      },
      postMessage(data: unknown) {
        for (const otro of canales) {
          if (otro !== reg && otro.nombre === nombre) {
            otro.onmessage?.({ data: structuredClone(data) } as MessageEvent);
          }
        }
      },
      close() {
        canales.splice(canales.indexOf(reg), 1);
      },
    };
    reg.c = canal;
    canales.push(reg);
    return canal as unknown as BroadcastChannel;
  };
  /** Simula que OTRA pestaña manda un estado. */
  const desdeOtraPestania = (estado: unknown) => {
    for (const r of canales) r.onmessage?.({ data: structuredClone(estado) } as MessageEvent);
  };
  return { crear, desdeOtraPestania };
}

const RETIRO = {
  modalidad: 'retiro' as const,
  cliente: { nombre: 'Ana' },
  medioPago: 'efectivo' as const,
  propinaPorcentaje: 0,
};

function conUnPedido(): EstadoDemo {
  reiniciarStoreDemo();
  agregarAlCarrito({ productoId: 'faina', cantidad: 2, modificadores: [] });
  confirmarPedido(RETIRO, { id: 'p1', ahora: new Date() });
  const e = getEstadoDemo();
  reiniciarStoreDemo();
  return e;
}

describe('sanearEstado', () => {
  it('acepta un estado válido tal cual', () => {
    const e = conUnPedido();
    expect(sanearEstado(JSON.parse(JSON.stringify(e)))).toEqual(e);
  });

  it('descarta pedidos rotos, valores desconocidos y montos con decimales', () => {
    const e = conUnPedido();
    const roto = {
      ...e,
      cocinaId: 'sushi',
      paletaId: 'arcoiris',
      nombreLocal: 'x'.repeat(100),
      seguimientoId: 'no-existe',
      pedidos: [
        e.pedidos[0],
        { ...e.pedidos[0], id: 'p2', estado: 'volando' },
        { ...e.pedidos[0], id: 'p3', totales: { ...e.pedidos[0]!.totales, total: 10.5 } },
        'basura',
      ],
    };
    const s = sanearEstado(roto)!;
    expect(s.pedidos.map((p) => p.id)).toEqual(['p1']);
    expect(s.cocinaId).toBe(ESTADO_INICIAL_DEMO.cocinaId);
    expect(s.paletaId).toBe(ESTADO_INICIAL_DEMO.paletaId);
    expect(s.nombreLocal).toHaveLength(40);
    expect(s.seguimientoId).toBeNull();
  });

  it('rechaza lo que no es un objeto y JSON corrupto en el almacenamiento', () => {
    expect(sanearEstado('hola')).toBeNull();
    expect(leerGuardado(almacenFalso({ [CLAVE_DEMO]: '{no es json' }))).toBeNull();
  });
});

describe('sincronización entre pestañas', () => {
  let apagar: (() => void) | undefined;
  beforeEach(() => reiniciarStoreDemo());
  afterEach(() => apagar?.());

  it('restaura lo guardado al arrancar', () => {
    const e = conUnPedido();
    apagar = iniciarSincronizacion({
      almacen: almacenFalso({ [CLAVE_DEMO]: JSON.stringify(e) }),
      crearCanal: () => null,
    });
    expect(getEstadoDemo().pedidos.map((p) => p.id)).toEqual(['p1']);
  });

  it('guarda y difunde cada cambio local; lo que llega de otra pestaña se aplica sin rebotar', () => {
    // El estado "de la otra pestaña" se arma ANTES de sincronizar (armarlo usa el store).
    const remoto = conUnPedido();
    const almacen = almacenFalso();
    const red = redDeCanales();
    const enviados: unknown[] = [];
    // Una "segunda pestaña" que escucha el canal.
    const otra = red.crear('webya-demo-gastronomia');
    otra.onmessage = (ev) => enviados.push(ev.data);
    apagar = iniciarSincronizacion({ almacen, crearCanal: red.crear });

    agregarAlCarrito({ productoId: 'faina', cantidad: 1, modificadores: [] });
    expect(enviados).toHaveLength(1);
    expect(JSON.parse(almacen.leer(CLAVE_DEMO)!).carrito).toHaveLength(1);

    // Llega un estado de otra pestaña (con un pedido): se aplica y NO se vuelve a difundir.
    otra.postMessage(remoto);
    expect(getEstadoDemo().pedidos.map((p) => p.id)).toEqual(['p1']);
    expect(enviados).toHaveLength(1);
  });

  it('sin BroadcastChannel, el evento storage hace de respaldo', () => {
    const remoto = conUnPedido();
    apagar = iniciarSincronizacion({ almacen: almacenFalso(), crearCanal: () => null });
    window.dispatchEvent(
      new StorageEvent('storage', { key: CLAVE_DEMO, newValue: JSON.stringify(remoto) }),
    );
    expect(getEstadoDemo().pedidos.map((p) => p.id)).toEqual(['p1']);
  });
});
