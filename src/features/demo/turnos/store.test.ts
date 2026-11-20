import { describe, expect, it } from 'vitest';
import {
  aHhmm,
  ahoraDemo,
  aResolver,
  completar,
  crearEstado,
  devolverSena,
  diasConLugar,
  faltasPrevias,
  hhmm,
  pagar,
  primerLibre,
  reservar,
  slots,
  soltar,
  vistaTurno,
} from './store';

const T0 = 1_000_000;
const ahora = hhmm('16:40');
const datos = (inicio: string, dia = 0) => ({
  servicioId: 'corte',
  profesionalId: null,
  dia,
  inicio: hhmm(inicio),
  nombre: 'Ana Pérez',
  telefono: '11 2345 6789',
  correo: 'ana@gmail.com',
});
const de = (cliente: string, dia?: number) =>
  crearEstado(T0).turnos.find((t) => t.cliente === cliente && (dia == null || t.dia === dia))!;

describe('demo de turnos', () => {
  it('arranca el miércoles a las 16:40 y hoy solo ofrece desde la anticipación (60 min)', () => {
    const e = crearEstado(T0);
    expect(aHhmm(ahoraDemo(e, T0))).toBe('16:40');
    expect(slots(e, 'corte', null, 0, ahora, T0).every((s) => s >= hhmm('17:40'))).toBe(true);
  });

  it('"Cualquiera" junta los horarios y no ofrece los ocupados', () => {
    const e = crearEstado(T0);
    const lucia = slots(e, 'corte', 'lucia', 0, ahora, T0);
    expect(lucia).not.toContain(hhmm('18:00'));
    expect(slots(e, 'corte', null, 0, ahora, T0).length).toBeGreaterThanOrEqual(lucia.length);
  });

  it('domingo, lunes y el feriado están cerrados', () => {
    const dias = diasConLugar(crearEstado(T0), 'corte', null, ahora, T0).map((d) => d.dia);
    expect(dias).not.toContain(4);
    expect(dias).not.toContain(5);
    expect(dias).not.toContain(8);
  });

  it('reservar aparta 10 minutos; pagar confirma y avisa al dueño', () => {
    const p = primerLibre(crearEstado(T0), 'corte', null, ahora, T0)!;
    const r = reservar(crearEstado(T0), { ...datos(aHhmm(p.inicio)), dia: p.dia }, ahora, T0);
    if (r === 'ocupado') throw new Error('ocupado');
    expect(r.turno.estado).toBe('pendiente_pago');
    expect(slots(r.estado, 'corte', r.turno.profesionalId, p.dia, ahora, T0)).not.toContain(
      p.inicio,
    );
    const e = pagar(r.estado, r.turno.id, T0 + 60_000);
    const t = e.turnos.find((x) => x.id === r.turno.id)!;
    expect(t).toMatchObject({ estado: 'confirmado', senaEstado: 'pagada', nueva: true });
    expect(e.ultimoPropio).toBe(t.id);
    expect(e.recordado?.nombre).toBe('Ana Pérez');
  });

  it('un horario ocupado no se puede reservar', () => {
    expect(
      reservar(crearEstado(T0), { ...datos('17:30'), profesionalId: 'lucia' }, ahora, T0),
    ).toBe('ocupado');
  });

  it('si no paga en 10 minutos vence y se libera; soltar lo cancela', () => {
    const r = reservar(crearEstado(T0), datos('19:30'), ahora, T0);
    if (r === 'ocupado') throw new Error('ocupado');
    expect(vistaTurno(r.turno, ahora, T0 + 11 * 60_000).estado).toBe('expirado');
    expect(soltar(r.estado, r.turno.id).turnos.at(-1)!.estado).toBe('cancelado');
  });

  it('el que espera la seña desde antes vence a los 7 minutos', () => {
    const mateo = de('Mateo Giménez');
    expect(vistaTurno(mateo, ahora, T0 + 6 * 60_000).estado).toBe('pendiente_pago');
    expect(vistaTurno(mateo, ahora, T0 + 8 * 60_000).estado).toBe('expirado');
  });

  it('cierre automático: el turno que ya terminó se ve atendido y cobrado', () => {
    expect(vistaTurno(de('Camila Herrera'), ahora, T0)).toMatchObject({
      estado: 'completado',
      cobrado: 19000,
      cierreAuto: true,
    });
  });

  it('a resolver: pagó sin horario y la seña de un turno cancelado; y las faltas previas', () => {
    const e = crearEstado(T0);
    expect(
      e.turnos
        .filter(aResolver)
        .map((t) => t.cliente)
        .sort(),
    ).toEqual(['Sofía Ramírez', 'Tiziano Correa']);
    expect(faltasPrevias(e, de('Joaquín Medina', 2))).toHaveLength(1);
  });

  it('el dueño cobra al terminar y devuelve la seña de un pago sin horario', () => {
    let e = crearEstado(T0);
    const bruno = de('Bruno Acosta');
    e = completar(e, bruno.id, { monto: 12000, medio: 'transferencia' });
    expect(e.turnos.find((t) => t.id === bruno.id)).toMatchObject({
      estado: 'completado',
      cobrado: 12000,
    });
    const tiziano = e.turnos.find((t) => t.estado === 'conflicto_pago')!;
    e = devolverSena(e, tiziano.id);
    expect(e.turnos.find((t) => t.id === tiziano.id)).toMatchObject({
      estado: 'cancelado',
      senaEstado: 'devuelta',
    });
  });
});
