import {
  capacidadDeFranja,
  DIAS_SEMANA,
  type DiaSemana,
  type HorarioLocal,
  type Turno,
} from '@/domain/turnos/agenda';
import type { ContextoBot } from '@/domain/turnos/bot';
import type { Visita } from '@/domain/turnos/estadisticas';

/**
 * Datos de ejemplo de la demo de peluquería: nada de esto es de un negocio real. El historial se
 * genera con una semilla fija, así todos ven los mismos números y los tests no dependen del azar. Las
 * cuentas sobre estos datos sí son de verdad (domain/turnos/estadisticas.ts).
 */
export const NOMBRE_POR_DEFECTO = 'Barbería Norte';

export const HORARIO_DEMO: HorarioLocal = {
  manana: { desde: 9 * 60, hasta: 13 * 60 },
  tarde: { desde: 15 * 60, hasta: 20 * 60 },
  paso: 30,
};

export const SERVICIOS_DEMO: ContextoBot['servicios'] = [
  { id: 'corte', minutos: 30, precioCentavos: 1_200_000, palabras: ['corte', 'cortarme', 'pelo'] },
  { id: 'barba', minutos: 30, precioCentavos: 700_000, palabras: ['barba', 'afeitada'] },
  {
    id: 'corte_barba',
    minutos: 60,
    precioCentavos: 1_600_000,
    palabras: ['corte y barba', 'corte con barba', 'combo'],
  },
  { id: 'color', minutos: 90, precioCentavos: 3_500_000, palabras: ['color', 'tintura', 'mechas'] },
];

export const NOMBRE_SERVICIO: Readonly<Record<string, string>> = {
  corte: 'Corte',
  barba: 'Barba',
  corte_barba: 'Corte y barba',
  color: 'Color',
};

export const PALABRAS_DIA: Readonly<Record<DiaSemana, readonly string[]>> = {
  mar: ['martes', 'mar'],
  mie: ['miercoles', 'mie'],
  jue: ['jueves', 'jue'],
  vie: ['viernes', 'vie'],
  sab: ['sabado', 'sab'],
};

const NOMBRES = [
  'Ana',
  'Beto',
  'Caro',
  'Dani',
  'Ema',
  'Fede',
  'Gabi',
  'Hugo',
  'Iara',
  'Juan',
  'Lu',
  'Maxi',
  'Nati',
  'Oscar',
  'Pau',
  'Rama',
  'Sol',
  'Tomi',
  'Vale',
  'Zoe',
];
const INICIALES = ['A', 'B', 'C', 'D', 'F', 'G', 'L', 'M', 'P', 'R', 'S', 'V'];

/** Generador con semilla (LCG): siempre la misma secuencia. */
function azarConSemilla(semilla: number) {
  let s = semilla;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Cuánto se llena cada día y franja: sábado a la mañana a tope, martes a la tarde flojo. */
const PREFERENCIA: Readonly<Record<DiaSemana, readonly [number, number]>> = {
  mar: [0.5, 0.25],
  mie: [0.6, 0.45],
  jue: [0.6, 0.65],
  vie: [0.7, 0.9],
  sab: [1, 0.75],
};

const elegirPonderado = <T>(items: readonly T[], peso: (x: T) => number, azar: () => number): T => {
  const total = items.reduce((s, x) => s + peso(x), 0);
  let r = azar() * total;
  for (const x of items) {
    r -= peso(x);
    if (r <= 0) return x;
  }
  return items[items.length - 1]!;
};

/** Elegida para que el ejemplo se parezca a una barbería: viernes y sábado llenos, martes flojo. */
const SEMILLA_HISTORIAL = 3915;

export const SEMANAS_HISTORIAL = 12;
/** Día corrido de "hoy": el martes de la semana siguiente al historial. */
export const HOY_DEMO = SEMANAS_HISTORIAL * 7;

export function generarHistorial(semilla: number): {
  visitas: Visita[];
  clientes: Record<string, string>;
} {
  const azar = azarConSemilla(semilla);
  const clientes: Record<string, string> = {};
  const visitas: Visita[] = [];
  const opciones = DIAS_SEMANA.flatMap((diaSemana, d) =>
    ([0, 1] as const).map((f) => ({ diaSemana, d, f, peso: PREFERENCIA[diaSemana][f] })),
  );
  for (let i = 0; i < 110; i++) {
    const id = `c${i}`;
    clientes[id] =
      `${NOMBRES[i % NOMBRES.length]!} ${INICIALES[Math.floor(azar() * INICIALES.length)]!}.`;
    const ritmoSemanas = 2 + Math.floor(azar() * 4);
    const preferida = elegirPonderado(opciones, (o) => o.peso, azar);
    // Algunos dejan de venir antes del final del historial: son los que hay que recuperar.
    const hasta = azar() < 0.2 ? SEMANAS_HISTORIAL - ritmoSemanas * 2 : SEMANAS_HISTORIAL;
    for (let semana = Math.floor(azar() * ritmoSemanas); semana < hasta; semana += ritmoSemanas) {
      const servicio = elegirPonderado(
        SERVICIOS_DEMO,
        (s) => ({ corte: 6, barba: 2, corte_barba: 3, color: 1 })[s.id] ?? 1,
        azar,
      );
      const franja = preferida.f === 0 ? HORARIO_DEMO.manana : HORARIO_DEMO.tarde;
      const lugares = capacidadDeFranja(preferida.f === 0 ? 'manana' : 'tarde', HORARIO_DEMO);
      visitas.push({
        dia: semana * 7 + preferida.d,
        semana,
        diaSemana: preferida.diaSemana,
        inicio: franja.desde + Math.floor(azar() * lugares) * HORARIO_DEMO.paso,
        pasos: Math.ceil(servicio.minutos / HORARIO_DEMO.paso),
        servicioId: servicio.id,
        clienteId: id,
        vino: azar() > (preferida.diaSemana === 'sab' ? 0.14 : 0.07),
      });
    }
  }
  return { visitas, clientes };
}

const generado = generarHistorial(SEMILLA_HISTORIAL);
export const HISTORIAL_DEMO: readonly Visita[] = generado.visitas;
export const CLIENTES_DEMO: Readonly<Record<string, string>> = generado.clientes;

/** La semana en curso: turnos ya tomados, sin superponerse. */
function generarSemana(): Turno[] {
  const azar = azarConSemilla(424242);
  const turnos: Turno[] = [];
  const tramos = [HORARIO_DEMO.manana, HORARIO_DEMO.tarde];
  for (const dia of DIAS_SEMANA) {
    tramos.forEach((tramo, f) => {
      const llenar = PREFERENCIA[dia][f]! * 0.75;
      let inicio = tramo.desde;
      while (inicio < tramo.hasta) {
        const s = SERVICIOS_DEMO[azar() < 0.65 ? 0 : azar() < 0.5 ? 1 : 2]!;
        if (azar() < llenar && inicio + s.minutos <= tramo.hasta) {
          turnos.push({
            id: `s-${dia}-${inicio}`,
            dia,
            inicio,
            minutos: s.minutos,
            servicioId: s.id,
            cliente: `${NOMBRES[Math.floor(azar() * NOMBRES.length)]!} ${INICIALES[Math.floor(azar() * INICIALES.length)]!}.`,
          });
          inicio += s.minutos;
        } else {
          inicio += HORARIO_DEMO.paso;
        }
      }
    });
  }
  return turnos;
}

export const TURNOS_SEMANA_DEMO: readonly Turno[] = generarSemana();
