import { describe, expect, it } from 'vitest';
import {
  calcularRetiro,
  elegirFranja,
  estadoFranja,
  franjasElegibles,
  generarRangos,
  hhmmAMin,
  minAHhmm,
  type Franja,
} from './franjas';

const f = (inicio: string, pedidos = 0, extra: Partial<Franja> = {}): Franja => ({
  inicio: hhmmAMin(inicio),
  fin: hhmmAMin(inicio) + 15,
  capacidad: 7,
  bloqueado: false,
  pedidos,
  ...extra,
});

describe('franjas de retiro', () => {
  it('convierte horas y vuelve igual, también pasada la medianoche', () => {
    expect(hhmmAMin('20:45')).toBe(1245);
    expect(minAHhmm(1245)).toBe('20:45');
    expect(minAHhmm(1500)).toBe('01:00');
  });

  it('de 20:00 a 23:00 salen 12 franjas; si el cierre es antes, cruza la medianoche', () => {
    const r = generarRangos('20:00', '23:00');
    expect(r).toHaveLength(12);
    expect(r[0]).toEqual({ inicio: 1200, fin: 1215 });
    expect(r.at(-1)).toEqual({ inicio: 1365, fin: 1380 });
    expect(generarRangos('23:00', '01:00')).toHaveLength(8);
  });

  it('estado: pasado, pausado, lleno, casi lleno (80 %) y libre', () => {
    const ahora = hhmmAMin('20:40');
    expect(estadoFranja(f('20:15'), ahora)).toBe('pasado');
    expect(estadoFranja(f('21:00', 0, { bloqueado: true }), ahora)).toBe('pausado');
    expect(estadoFranja(f('21:00', 7), ahora)).toBe('lleno');
    expect(estadoFranja(f('21:00', 6), ahora)).toBe('casi');
    expect(estadoFranja(f('21:00', 3), ahora)).toBe('libre');
  });

  it('lo antes posible salta la franja llena y lo avisa', () => {
    const ahora = hhmmAMin('20:40');
    const franjas = [f('20:30', 2), f('20:45', 7), f('21:00', 6), f('21:15', 1)];
    const r = elegirFranja(franjas, ahora)!;
    expect(minAHhmm(r.franja.inicio)).toBe('21:00');
    expect(r.huboSalto).toBe(true);
  });

  it('una franja pausada no cuenta como salto por lleno', () => {
    const r = elegirFranja([f('21:00', 0, { bloqueado: true }), f('21:15')], hhmmAMin('20:40'))!;
    expect(minAHhmm(r.franja.inicio)).toBe('21:15');
    expect(r.huboSalto).toBe(false);
  });

  it('sin ninguna franja con cupo, no hay retiro', () => {
    expect(elegirFranja([f('21:00', 7), f('21:15', 7)], hhmmAMin('20:40'))).toBeNull();
  });

  it('el retiro suma la cola de la franja sin pasarse de su fin', () => {
    const ahora = hhmmAMin('20:40');
    expect(minAHhmm(calcularRetiro(f('21:00', 2), ahora).hora)).toBe('21:08');
    const llena = calcularRetiro(f('21:00', 6), ahora, true);
    expect(minAHhmm(llena.hora)).toBe('21:15');
    expect(llena.minutosEspera).toBe(35);
    expect(llena.esInmediato).toBe(false);
    expect(calcularRetiro(f('20:45', 0), hhmmAMin('20:30')).esInmediato).toBe(true);
  });

  it('para elegir horario solo quedan las futuras con cupo', () => {
    const ahora = hhmmAMin('20:40');
    const franjas = [f('20:30'), f('20:45', 7), f('21:00'), f('21:15', 0, { bloqueado: true })];
    expect(franjasElegibles(franjas, ahora).map((x) => minAHhmm(x.inicio))).toEqual(['21:00']);
  });
});
