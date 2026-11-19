import { describe, expect, it } from 'vitest';
import {
  agruparPorMomento,
  calcularSaldo,
  calcularSena,
  calcularSlots,
  huecosLibres,
  momentoDe,
  sePisan,
} from './disponibilidad';

const h = (hhmm: string) => {
  const [a, b] = hhmm.split(':').map(Number);
  return a! * 60 + b!;
};
const tarde = { inicioMin: h('16:00'), finMin: h('20:00') };

describe('reservas: horarios libres', () => {
  it('un servicio de 90 min en 16 a 20 ofrece de 16:00 a 18:30, de a 30', () => {
    const s = calcularSlots({ franjas: [tarde], duracionMin: 90, intervaloMin: 30, ocupados: [], bloqueos: [] });
    expect(s[0]).toBe(h('16:00'));
    expect(s.at(-1)).toBe(h('18:30'));
    expect(s).toHaveLength(6);
  });

  it('no pisa turnos ni bloqueos; 16:00–16:30 y 16:30–17:00 no se pisan', () => {
    expect(sePisan({ inicioMin: h('16:00'), finMin: h('16:30') }, { inicioMin: h('16:30'), finMin: h('17:00') })).toBe(false);
    const s = calcularSlots({
      franjas: [tarde],
      duracionMin: 30,
      intervaloMin: 30,
      ocupados: [{ inicioMin: h('16:30'), finMin: h('17:00') }],
      bloqueos: [{ inicioMin: h('18:00'), finMin: h('19:00') }],
    });
    expect(s).not.toContain(h('16:30'));
    expect(s).not.toContain(h('18:00'));
    expect(s).not.toContain(h('18:30'));
    expect(s).toContain(h('17:00'));
  });

  it('día bloqueado entero o anticipación de hoy', () => {
    expect(calcularSlots({ franjas: [tarde], duracionMin: 30, intervaloMin: 30, ocupados: [], bloqueos: [{ inicioMin: null, finMin: null }] })).toEqual([]);
    const s = calcularSlots({ franjas: [tarde], duracionMin: 30, intervaloMin: 30, ocupados: [], bloqueos: [], minimoMin: h('17:10') });
    expect(s[0]).toBe(h('17:30'));
  });

  it('seña al 50 % redondeada al peso y saldo', () => {
    expect(calcularSena(18000, 50)).toBe(9000);
    expect(calcularSena(24500, 50)).toBe(12250);
    expect(calcularSaldo(18000, 9000, true)).toBe(9000);
    expect(calcularSaldo(18000, 9000, false)).toBe(18000);
  });

  it('agrupa en mañana, tarde y noche', () => {
    expect(momentoDe(h('11:30'))).toBe('manana');
    expect(momentoDe(h('12:00'))).toBe('tarde');
    expect(momentoDe(h('19:00'))).toBe('noche');
    expect(agruparPorMomento([h('10:00'), h('16:00'), h('19:30')]).noche).toEqual([h('19:30')]);
  });

  it('huecos libres entre turnos', () => {
    const huecos = huecosLibres([tarde], [{ inicioMin: h('16:30'), finMin: h('17:30') }]);
    expect(huecos).toEqual([
      { inicioMin: h('16:00'), finMin: h('16:30') },
      { inicioMin: h('17:30'), finMin: h('20:00') },
    ]);
  });
});
