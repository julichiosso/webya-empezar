/**
 * La mini demo de la vidriera de "Tu negocio" en el hero: un turno con seña en tres pasos, con los datos
 * de la demo de turnos (mismo servicio, precio y seña del 50 % del sistema real). Es decorativa: el hero
 * dice lo mismo en texto y la demo completa está en /demos/turnos.
 */
import { NEGOCIO_DEMO, SERVICIOS_DEMO } from './datos';
import { pesos } from './ui';

const servicio = SERVICIOS_DEMO[0];
const precio = servicio?.precio ?? 0;
const sena = Math.round((precio * NEGOCIO_DEMO.senaPorcentaje) / 100);

export const VIDRIERA_TURNO = {
  negocio: NEGOCIO_DEMO.nombre,
  /** Paso 1: elegir el horario. El del medio es el que se toca. */
  elegir: {
    titulo: servicio?.nombre ?? '',
    dia: 'Sábado',
    horarios: ['10:00', '11:30', '17:00'],
    elegido: 1,
  },
  /** Paso 2: pagar la seña con Mercado Pago. */
  pagar: {
    titulo: 'Seña para reservar',
    monto: pesos(sena),
    boton: 'Pagar con Mercado Pago',
  },
  /** Paso 3: el turno queda confirmado y al dueño le llega el aviso. */
  listo: {
    titulo: 'Turno confirmado',
    detalle: 'Sábado 11:30',
    aviso: 'Nuevo turno con seña pagada',
  },
} as const;
