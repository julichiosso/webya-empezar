// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { dentroDeHorario, DIAS_SEMANA } from '@/domain/turnos/agenda';
import { clientesPorVolver, ocupacionPorFranja } from '@/domain/turnos/estadisticas';
import {
  CLIENTES_DEMO,
  HISTORIAL_DEMO,
  HORARIO_DEMO,
  HOY_DEMO,
  NOMBRE_SERVICIO,
  PALABRAS_DIA,
  SEMANAS_HISTORIAL,
  SERVICIOS_DEMO,
  TURNOS_SEMANA_DEMO,
} from './datos';

describe('datos de ejemplo de la demo de peluquería', () => {
  it('la semana no tiene turnos superpuestos y todos entran en el horario', () => {
    for (const d of DIAS_SEMANA) {
      const delDia = TURNOS_SEMANA_DEMO.filter((t) => t.dia === d);
      delDia.forEach((t, i) => {
        expect(dentroDeHorario(t.inicio, t.minutos, HORARIO_DEMO)).toBe(true);
        const siguiente = delDia[i + 1];
        if (siguiente) expect(siguiente.inicio).toBeGreaterThanOrEqual(t.inicio + t.minutos);
      });
    }
  });

  it('los turnos tienen ids únicos y servicios que existen', () => {
    const ids = TURNOS_SEMANA_DEMO.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SERVICIOS_DEMO) expect(NOMBRE_SERVICIO[s.id]).toBeTruthy();
    for (const d of DIAS_SEMANA) expect(PALABRAS_DIA[d].length).toBeGreaterThan(0);
  });

  it('se parece a una barbería: el sábado a la mañana es lo más lleno, el martes a la tarde lo más flojo', () => {
    const c = ocupacionPorFranja(HISTORIAL_DEMO, HORARIO_DEMO, SEMANAS_HISTORIAL);
    const o = (dia: string, franja: string) =>
      c.find((x) => x.dia === dia && x.franja === franja)!.ocupacion;
    expect(o('sab', 'manana')).toBe(Math.max(...c.map((x) => x.ocupacion)));
    expect(o('mar', 'tarde')).toBe(Math.min(...c.map((x) => x.ocupacion)));
  });

  it('hay clientes para recuperar y cada uno tiene nombre', () => {
    const lista = clientesPorVolver(HISTORIAL_DEMO, HOY_DEMO);
    expect(lista.length).toBeGreaterThan(0);
    for (const v of lista) expect(CLIENTES_DEMO[v.clienteId]).toBeTruthy();
  });
});
