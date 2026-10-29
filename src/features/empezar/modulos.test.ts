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

  it('sin decisiones manuales, activa los módulos sugeridos del rubro (en orden del catálogo)', () => {
    expect(modulosSeleccionados(PELUQUERIA, {})).toEqual([
      'turnos',
      'catalogo',
      'pagos',
      'clientes',
      'notificaciones',
    ]);
  });

  it('lo activado a mano sin rubro (desde el hero) cuenta', () => {
    expect(modulosSeleccionados(null, { turnos: true, pagos: true })).toEqual(['turnos', 'pagos']);
  });

  it('un rubro desconocido no sugiere nada', () => {
    expect(modulosSeleccionados('astronauta', {})).toEqual([]);
  });
});

describe('cambiar de rubro: sin módulos fantasma y sin pisar lo elegido a mano', () => {
  it('no quedan módulos del rubro anterior', () => {
    const antes = modulosSeleccionados(PELUQUERIA, {});
    const despues = modulosSeleccionados(GASTRONOMIA, {});
    expect(antes).toContain('catalogo');
    // Gastronomía no sugiere catálogo ni clientes: no se arrastran de peluquería.
    expect(despues).not.toContain('catalogo');
    expect(despues).not.toContain('clientes');
    expect(despues).toEqual(
      expect.arrayContaining(getRubro(GASTRONOMIA)?.modulosSugeridos as string[]),
    );
    expect(despues).toHaveLength(getRubro(GASTRONOMIA)?.modulosSugeridos.length ?? -1);
  });

  it('lo activado a mano sobrevive al cambio de rubro, aunque el rubro nuevo no lo sugiera', () => {
    const manual: ModulosManual = { catalogo: true };
    expect(modulosSeleccionados(GASTRONOMIA, manual)).toContain('catalogo');
    expect(modulosSeleccionados(COMERCIO, manual)).toContain('catalogo');
    expect(modulosSeleccionados(null, manual)).toEqual(['catalogo']);
  });

  it('lo apagado a mano sigue apagado en el rubro nuevo, aunque lo sugiera', () => {
    const manual: ModulosManual = { turnos: false };
    expect(modulosSeleccionados(PELUQUERIA, manual)).not.toContain('turnos');
    expect(modulosSeleccionados(GASTRONOMIA, manual)).not.toContain('turnos');
  });

  it('una secuencia completa: hero → rubro → ajuste manual → otro rubro', () => {
    let manual: ModulosManual = {};
    // 1. En el hero activa Carta con QR (todavía sin rubro).
    manual = alternarModulo(null, manual, 'carta_qr');
    expect(modulosSeleccionados(null, manual)).toEqual(['carta_qr']);
    // 2. Elige peluquería: se suman sus sugeridos y se conserva la carta.
    expect(modulosSeleccionados(PELUQUERIA, manual)).toEqual([
      'turnos',
      'catalogo',
      'carta_qr',
      'pagos',
      'clientes',
      'notificaciones',
    ]);
    // 3. Apaga Pagos (sugerido) a mano.
    manual = alternarModulo(PELUQUERIA, manual, 'pagos');
    // 4. Cambia a comercio: no quedan los de peluquería (turnos), sí lo manual (carta) y
    //    sigue apagado Pagos.
    const enComercio = modulosSeleccionados(COMERCIO, manual);
    expect(enComercio).toContain('carta_qr');
    expect(enComercio).not.toContain('pagos');
    expect(enComercio).not.toContain('turnos');
    expect(enComercio).toEqual(expect.arrayContaining(['catalogo', 'clientes', 'notificaciones']));
  });
});

describe('alternarModulo', () => {
  it('apaga un módulo sugerido y lo vuelve a prender', () => {
    const apagado = alternarModulo(PELUQUERIA, {}, 'turnos');
    expect(modulosSeleccionados(PELUQUERIA, apagado)).not.toContain('turnos');
    const prendido = alternarModulo(PELUQUERIA, apagado, 'turnos');
    expect(modulosSeleccionados(PELUQUERIA, prendido)).toContain('turnos');
  });

  it('activa un módulo no sugerido', () => {
    const manual = alternarModulo(PELUQUERIA, {}, 'carta_qr');
    expect(modulosSeleccionados(PELUQUERIA, manual)).toContain('carta_qr');
  });

  it('no muta el objeto original', () => {
    const original: ModulosManual = {};
    alternarModulo(null, original, 'turnos');
    expect(original).toEqual({});
  });
});

describe('esSugerido', () => {
  it('distingue lo que sugiere el rubro', () => {
    expect(esSugerido(PELUQUERIA, 'turnos')).toBe(true);
    expect(esSugerido(PELUQUERIA, 'carta_qr')).toBe(false);
    expect(esSugerido(null, 'turnos')).toBe(false);
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
