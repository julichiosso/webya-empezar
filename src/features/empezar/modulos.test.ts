import { describe, expect, it } from 'vitest';
import { getRubro } from '@/content/rubros';
import {
  alternarModulo,
  esSugerido,
  modulosSeleccionados,
  sanearManual,
  type ModulosManual,
} from './modulos';

const PELUQUERIA = 'peluqueria_estetica';
const GASTRONOMIA = 'gastronomia';
const COMERCIO = 'comercio';

describe('modulosSeleccionados', () => {
  it('sin rubro ni decisiones no hay nada activo', () => {
    expect(modulosSeleccionados(null, {})).toEqual([]);
  });

  it('sin decisiones manuales, activa los sugeridos del rubro que hoy se entregan', () => {
    expect(modulosSeleccionados(GASTRONOMIA, {})).toEqual(['carta_qr', 'pedidos']);
  });

  it('un módulo "próximamente" nunca queda activo, ni sugerido ni a mano', () => {
    expect(modulosSeleccionados(PELUQUERIA, {})).toEqual([]);
    expect(modulosSeleccionados(null, { turnos: true, pagos: true })).toEqual([]);
  });

  it('lo activado a mano sin rubro (desde el hero) cuenta', () => {
    expect(modulosSeleccionados(null, { carta_qr: true })).toEqual(['carta_qr']);
  });

  it('un rubro desconocido no sugiere nada', () => {
    expect(modulosSeleccionados('astronauta', {})).toEqual([]);
  });
});

describe('cambiar de rubro: sin módulos fantasma y sin pisar lo elegido a mano', () => {
  it('no quedan módulos del rubro anterior', () => {
    const despues = modulosSeleccionados(GASTRONOMIA, {});
    const sugeridos = getRubro(GASTRONOMIA)?.modulosSugeridos as string[];
    expect(despues.every((m) => sugeridos.includes(m))).toBe(true);
  });

  it('lo activado a mano sobrevive al cambio de rubro', () => {
    const manual: ModulosManual = { carta_qr: true };
    expect(modulosSeleccionados(COMERCIO, manual)).toContain('carta_qr');
    expect(modulosSeleccionados(null, manual)).toEqual(['carta_qr']);
  });

  it('lo apagado a mano sigue apagado en el rubro nuevo, aunque lo sugiera', () => {
    const manual: ModulosManual = { pedidos: false };
    expect(modulosSeleccionados(GASTRONOMIA, manual)).not.toContain('pedidos');
  });
});

describe('alternarModulo', () => {
  it('apaga un módulo sugerido y lo vuelve a prender', () => {
    const apagado = alternarModulo(GASTRONOMIA, {}, 'pedidos');
    expect(modulosSeleccionados(GASTRONOMIA, apagado)).not.toContain('pedidos');
    const prendido = alternarModulo(GASTRONOMIA, apagado, 'pedidos');
    expect(modulosSeleccionados(GASTRONOMIA, prendido)).toContain('pedidos');
  });

  it('activa un módulo no sugerido', () => {
    const manual = alternarModulo(COMERCIO, {}, 'carta_qr');
    expect(modulosSeleccionados(COMERCIO, manual)).toContain('carta_qr');
  });

  it('no muta el objeto original', () => {
    const original: ModulosManual = {};
    alternarModulo(null, original, 'carta_qr');
    expect(original).toEqual({});
  });
});

describe('esSugerido', () => {
  it('distingue lo que sugiere el rubro', () => {
    expect(esSugerido(GASTRONOMIA, 'carta_qr')).toBe(true);
    expect(esSugerido(GASTRONOMIA, 'turnos')).toBe(false);
    expect(esSugerido(null, 'carta_qr')).toBe(false);
  });
});

describe('sanearManual', () => {
  it('descarta ids desconocidos, valores no booleanos y formas inválidas', () => {
    expect(sanearManual({ turnos: true, pagos: false, hackeo: true, catalogo: 'si' })).toEqual({
      turnos: true,
      pagos: false,
    });
    expect(sanearManual(null)).toEqual({});
    expect(sanearManual([true])).toEqual({});
    expect(sanearManual('x')).toEqual({});
  });
});
