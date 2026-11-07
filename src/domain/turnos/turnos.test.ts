// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  capacidadDeFranja,
  formatearHora,
  horariosLibres,
  reservar,
  type HorarioLocal,
  type Turno,
} from './agenda';
import { CONVERSACION_INICIAL, interpretar, responderBot, type ContextoBot } from './bot';
import {
  clientesPorVolver,
  franjaMasFloja,
  ingresosDeLaSemana,
  ocupacionDeLaSemana,
  ocupacionPorFranja,
  previsionPorDia,
  tasaDeAusencias,
  type Visita,
} from './estadisticas';

const h: HorarioLocal = {
  manana: { desde: 540, hasta: 780 },
  tarde: { desde: 900, hasta: 1200 },
  paso: 30,
};
const turno = (dia: Turno['dia'], inicio: number, minutos = 30): Turno => ({
  id: `${dia}-${inicio}`,
  dia,
  inicio,
  minutos,
  servicioId: 'corte',
  cliente: 'Ana',
});

describe('agenda', () => {
  it('un turno largo no entra si no cabe entero antes del siguiente ni antes del cierre', () => {
    const libres = horariosLibres([turno('mar', 600)], 'mar', 60, h, 'manana');
    expect(libres).toEqual([540, 630, 660, 690, 720]);
    expect(libres).not.toContain(570);
    expect(libres).not.toContain(750);
  });

  it('no deja reservar sobre otro turno, ni fuera de horario, ni en el corte del mediodía', () => {
    const t = [turno('mar', 600)];
    expect(reservar(t, turno('mar', 600), h)).toEqual({ ok: false, motivo: 'ocupado' });
    expect(reservar(t, turno('mar', 570, 60), h)).toEqual({ ok: false, motivo: 'ocupado' });
    expect(reservar(t, turno('mar', 800), h)).toEqual({ ok: false, motivo: 'fuera_de_horario' });
    expect(reservar(t, turno('mar', 750, 60), h)).toEqual({
      ok: false,
      motivo: 'fuera_de_horario',
    });
    expect(reservar(t, turno('mar', 545), h)).toEqual({ ok: false, motivo: 'fuera_de_horario' });
  });

  it('reservar deja la agenda en orden y no toca la original', () => {
    const t = [turno('sab', 600), turno('mar', 700 - 10)];
    const r = reservar(t, turno('mar', 540), h);
    expect(r.ok && r.turnos.map((x) => x.id)).toEqual(['mar-540', 'mar-690', 'sab-600']);
    expect(t).toHaveLength(2);
  });

  it('formatea la hora y cuenta la capacidad', () => {
    expect(formatearHora(570)).toBe('9:30');
    expect(formatearHora(900)).toBe('15:00');
    expect(capacidadDeFranja('manana', h)).toBe(8);
  });
});

const ctx = (turnos: Turno[] = []): ContextoBot => ({
  servicios: [
    { id: 'corte', minutos: 30, precioCentavos: 1000, palabras: ['corte', 'cortarme'] },
    { id: 'combo', minutos: 60, precioCentavos: 2000, palabras: ['corte y barba'] },
    { id: 'barba', minutos: 30, precioCentavos: 500, palabras: ['barba'] },
  ],
  palabrasDia: {
    mar: ['martes'],
    mie: ['miercoles'],
    jue: ['jueves'],
    vie: ['viernes'],
    sab: ['sabado'],
  },
  horario: h,
  turnos,
  nuevoId: () => 'nuevo',
});

describe('bot', () => {
  it('entiende el pedido entero en una frase, con o sin acentos', () => {
    expect(interpretar('Quiero corte y barba el Sábado a la mañana', ctx())).toEqual({
      servicioId: 'combo',
      dia: 'sab',
      franja: 'manana',
    });
    expect(interpretar('barba el martes a las 15:30', ctx())).toEqual({
      servicioId: 'barba',
      dia: 'mar',
      inicio: 930,
    });
    expect(interpretar('hola, cómo va', ctx())).toEqual({});
  });

  it('pregunta solo lo que falta', () => {
    const r = responderBot(
      CONVERSACION_INICIAL,
      { tipo: 'texto', texto: 'corte el viernes' },
      ctx(),
    );
    expect(r.conversacion).toMatchObject({ paso: 'horario', servicioId: 'corte', dia: 'vie' });
  });

  it('flujo completo: reserva, y el turno queda en la agenda', () => {
    let c = responderBot(
      CONVERSACION_INICIAL,
      { tipo: 'servicio', id: 'corte' },
      ctx(),
    ).conversacion;
    expect(c.paso).toBe('dia');
    c = responderBot(c, { tipo: 'dia', dia: 'jue' }, ctx()).conversacion;
    expect(c.paso).toBe('horario');
    c = responderBot(c, { tipo: 'horario', inicio: 600 }, ctx()).conversacion;
    expect(c.paso).toBe('nombre');
    const r = responderBot(c, { tipo: 'texto', texto: ' Ana ' }, ctx());
    expect(r.conversacion.paso).toBe('listo');
    expect(r.reserva?.turno).toMatchObject({
      cliente: 'Ana',
      dia: 'jue',
      inicio: 600,
      delBot: true,
    });
    expect(r.reserva?.turnos).toHaveLength(1);
  });

  it('si el horario pedido está tomado lo avisa y vuelve a ofrecer', () => {
    const r = responderBot(
      { ...CONVERSACION_INICIAL, servicioId: 'corte', dia: 'mar' },
      { tipo: 'horario', inicio: 600 },
      ctx([turno('mar', 600)]),
    );
    expect(r.conversacion).toMatchObject({ paso: 'horario', inicio: null, aviso: 'ocupado' });
  });

  it('si otra reserva le ganó de mano mientras escribía el nombre, no pisa el turno', () => {
    const r = responderBot(
      { ...CONVERSACION_INICIAL, paso: 'nombre', servicioId: 'corte', dia: 'mar', inicio: 600 },
      { tipo: 'texto', texto: 'Ana' },
      ctx([turno('mar', 600)]),
    );
    expect(r.reserva).toBeUndefined();
    expect(r.conversacion).toMatchObject({ paso: 'horario', aviso: 'ocupado' });
  });

  it('día lleno: lo dice y pide otro día', () => {
    const lleno = [
      ...Array.from({ length: 8 }, (_, i) => turno('mar', 540 + i * 30)),
      ...Array.from({ length: 10 }, (_, i) => turno('mar', 900 + i * 30)),
    ];
    const r = responderBot(
      { ...CONVERSACION_INICIAL, servicioId: 'corte' },
      { tipo: 'dia', dia: 'mar' },
      ctx(lleno),
    );
    expect(r.conversacion).toMatchObject({ paso: 'dia', dia: null, aviso: 'sin_lugar' });
  });

  it('no entiende: lo dice, sin avanzar; nombre vacío: lo pide de nuevo', () => {
    expect(
      responderBot(CONVERSACION_INICIAL, { tipo: 'texto', texto: 'asdf' }, ctx()).conversacion,
    ).toMatchObject({ paso: 'servicio', aviso: 'no_entendi' });
    expect(
      responderBot(
        { ...CONVERSACION_INICIAL, paso: 'nombre', servicioId: 'corte', dia: 'mar', inicio: 600 },
        { tipo: 'texto', texto: ' ' },
        ctx(),
      ).conversacion,
    ).toMatchObject({ paso: 'nombre', aviso: 'nombre_corto' });
  });
});

const visita = (v: Partial<Visita>): Visita => ({
  dia: 0,
  semana: 0,
  diaSemana: 'mar',
  inicio: 540,
  pasos: 1,
  servicioId: 'corte',
  clienteId: 'a',
  vino: true,
  ...v,
});

describe('estadísticas', () => {
  it('ocupación por franja y la franja más floja', () => {
    const v = [visita({ pasos: 4 }), visita({ diaSemana: 'sab', inicio: 900, pasos: 10 })];
    const celdas = ocupacionPorFranja(v, h, 1);
    expect(celdas.find((c) => c.dia === 'mar' && c.franja === 'manana')?.ocupacion).toBe(0.5);
    expect(celdas.find((c) => c.dia === 'sab' && c.franja === 'tarde')?.ocupacion).toBe(1);
    expect(franjaMasFloja(celdas)?.ocupacion).toBe(0);
    expect(franjaMasFloja([])).toBeNull();
  });

  it('la previsión pesa más las semanas recientes', () => {
    // Martes: 0, 0, 0 y 10 turnos en las últimas cuatro semanas.
    const v = Array.from({ length: 10 }, () => visita({ semana: 3 }));
    const [martes, miercoles] = previsionPorDia(v, 3);
    expect(martes).toMatchObject({ dia: 'mar', turnos: 4 });
    expect(martes!.tendencia).toBeGreaterThan(0);
    expect(miercoles).toMatchObject({ dia: 'mie', turnos: 0, tendencia: 0 });
  });

  it('clientes por volver: se pasaron de su ritmo; sin historia suficiente, no se opina', () => {
    const v = [
      // Cada 14 días, hace 40 que no viene.
      ...[0, 14, 28].map((dia) => visita({ clienteId: 'ana', dia })),
      // Cada 14 días, al día.
      ...[28, 42, 56].map((dia) => visita({ clienteId: 'beto', dia })),
      // Solo dos visitas.
      ...[0, 7].map((dia) => visita({ clienteId: 'ceci', dia })),
      // Los que faltaron no cuentan como visita.
      ...[0, 14, 28, 60].map((dia, i) => visita({ clienteId: 'dani', dia, vino: i < 3 })),
    ];
    const lista = clientesPorVolver(v, 68);
    expect(lista.map((c) => c.clienteId)).toEqual(['ana', 'dani']);
    expect(lista[0]).toEqual({ clienteId: 'ana', ritmoDias: 14, sinVenirDias: 40 });
  });

  it('ausencias, ocupación e ingresos de la semana', () => {
    expect(tasaDeAusencias([])).toBe(0);
    expect(tasaDeAusencias([visita({}), visita({ vino: false })])).toBe(0.5);
    const t = [turno('mar', 540), turno('mar', 600, 60)];
    expect(ocupacionDeLaSemana(t, h)).toBeCloseTo(3 / 90);
    expect(ingresosDeLaSemana(t, [{ id: 'corte', minutos: 30, precioCentavos: 1000 }])).toBe(2000);
  });
});
