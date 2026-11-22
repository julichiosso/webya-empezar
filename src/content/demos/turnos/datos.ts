/**
 * Datos de ejemplo de la demo de turnos (/demo/turnos), tal como los da DEMO_SPEC_TURNOS §8: un negocio
 * genérico, tres profesionales, seis servicios y la agenda de ayer a dentro de unos días. Nombres
 * inventados, sin teléfonos ni correos. El "hoy" de la demo es un miércoles: así cada turno cae en un día
 * en que su profesional atiende. Reglas reales: seña del 50 %, horarios cada 30 minutos, 60 de
 * anticipación, 10 minutos para pagar y cancelación hasta 24 horas antes.
 */

export interface ServicioDemo {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  /** Pesos enteros. */
  precio: number;
}

export interface FranjaDemo {
  /** 0 = domingo. */
  dia: number;
  inicio: string;
  fin: string;
}

export interface ProfesionalDemo {
  id: string;
  nombre: string;
  iniciales: string;
  /** Color del círculo con la inicial (y de su columna en la agenda). */
  color: string;
  servicioIds: readonly string[];
  franjas: readonly FranjaDemo[];
}

export const NEGOCIO_DEMO = {
  nombre: 'Tu peluquería',
  reservar: 'Reservar turno',
  /** El logo genérico del sistema: la inicial sobre un cuadrado negro. */
  inicial: 'T',
  descripcion: 'Cortes, color y barbería. Reservá online y pagá el resto en el local.',
  direccion: 'Calle Falsa 123, Tu ciudad',
  senaPorcentaje: 50,
  holdMinutos: 10,
  intervaloMinutos: 30,
  anticipacionMinutos: 60,
  horizonteDias: 45,
  cancelacionHoras: 24,
  politica:
    'Podés cancelar hasta 24 horas antes del turno. Pasado ese plazo, la seña no se devuelve.',
  /** El "hoy" de la demo: miércoles 18 de noviembre de 2026 a las 16:40. */
  hoy: { anio: 2026, mes: 10, dia: 18, hora: '16:40' },
} as const;

/** Horario del local (la portada dice "Abierto · hasta las 20:00" con esto). */
export const HORARIO_NEGOCIO: readonly FranjaDemo[] = [
  { dia: 2, inicio: '10:00', fin: '13:00' },
  { dia: 2, inicio: '16:00', fin: '20:00' },
  { dia: 3, inicio: '10:00', fin: '13:00' },
  { dia: 3, inicio: '16:00', fin: '20:00' },
  { dia: 4, inicio: '10:00', fin: '13:00' },
  { dia: 4, inicio: '16:00', fin: '20:00' },
  { dia: 5, inicio: '10:00', fin: '20:00' },
  { dia: 6, inicio: '09:00', fin: '14:00' },
];

export const SERVICIOS_DEMO: readonly ServicioDemo[] = [
  {
    id: 'corte',
    nombre: 'Corte',
    descripcion: 'Lavado, corte y peinado',
    duracionMin: 30,
    precio: 18000,
  },
  {
    id: 'corte-barba',
    nombre: 'Corte y barba',
    descripcion: 'Corte con perfilado de barba',
    duracionMin: 45,
    precio: 22000,
  },
  {
    id: 'infantil',
    nombre: 'Corte infantil',
    descripcion: 'Hasta 12 años',
    duracionMin: 30,
    precio: 14000,
  },
  {
    id: 'peinado',
    nombre: 'Peinado',
    descripcion: 'Brushing o peinado para evento',
    duracionMin: 45,
    precio: 20000,
  },
  {
    id: 'color',
    nombre: 'Color',
    descripcion: 'Tintura completa con lavado',
    duracionMin: 90,
    precio: 38000,
  },
  {
    id: 'alisado',
    nombre: 'Alisado',
    descripcion: 'Alisado con keratina',
    duracionMin: 120,
    precio: 45000,
  },
];

const f = (dia: number, inicio: string, fin: string): FranjaDemo => ({ dia, inicio, fin });

export const PROFESIONALES_DEMO: readonly ProfesionalDemo[] = [
  {
    id: 'lucia',
    nombre: 'Lucía',
    iniciales: 'L',
    color: '#111111',
    servicioIds: ['corte', 'infantil', 'peinado', 'color', 'alisado'],
    franjas: [
      f(2, '10:00', '13:00'),
      f(2, '16:00', '20:00'),
      f(3, '10:00', '13:00'),
      f(3, '16:00', '20:00'),
      f(5, '10:00', '20:00'),
      f(6, '09:00', '14:00'),
    ],
  },
  {
    id: 'tomas',
    nombre: 'Tomás',
    iniciales: 'T',
    color: '#4a4a48',
    servicioIds: ['corte', 'corte-barba', 'infantil'],
    franjas: [
      f(2, '16:00', '20:00'),
      f(3, '16:00', '20:00'),
      f(4, '10:00', '13:00'),
      f(4, '16:00', '20:00'),
      f(5, '10:00', '20:00'),
      f(6, '09:00', '14:00'),
    ],
  },
  {
    id: 'martina',
    nombre: 'Martina',
    iniciales: 'M',
    color: '#17663a',
    servicioIds: ['corte', 'peinado', 'color', 'alisado'],
    franjas: [
      f(3, '10:00', '13:00'),
      f(4, '10:00', '13:00'),
      f(4, '16:00', '20:00'),
      f(5, '13:00', '20:00'),
      f(6, '09:00', '14:00'),
    ],
  },
];

/** "Sobre el cliente": notas que solo ve el dueño. */
export const NOTAS_CLIENTES: Readonly<Record<string, string>> = {
  'Bruno Acosta': 'Prefiere la máquina en 2',
  'Camila Herrera': 'Alérgica a la tintura con amoníaco',
};

export type EstadoSemilla =
  'confirmado' | 'completado' | 'ausente' | 'cancelado' | 'pendiente_pago' | 'conflicto_pago';

export interface TurnoSemilla {
  /** Días desde hoy (−1 = ayer). */
  dia: number;
  hora: string;
  servicioId: string;
  profesionalId: string;
  cliente: string;
  estado: EstadoSemilla;
  sena: 'pagada' | 'pendiente' | 'no_aplica';
  origen: 'web' | 'panel' | 'bot';
  cobrado?: number;
  medio?: 'efectivo' | 'transferencia';
  nota?: string;
  /** Para el que espera la seña: cuántos minutos le quedan de apartado. */
  holdMinutosRestantes?: number;
}

/** La agenda con la que arranca la demo (DEMO_SPEC_TURNOS §8). */
export const AGENDA_DEMO: readonly TurnoSemilla[] = [
  {
    dia: -1,
    hora: '10:00',
    servicioId: 'corte',
    profesionalId: 'lucia',
    cliente: 'Sofía Ramírez',
    estado: 'completado',
    sena: 'pagada',
    origen: 'web',
    cobrado: 9000,
    medio: 'efectivo',
  },
  {
    dia: -1,
    hora: '16:00',
    servicioId: 'corte-barba',
    profesionalId: 'tomas',
    cliente: 'Joaquín Medina',
    estado: 'ausente',
    sena: 'pagada',
    origen: 'web',
  },
  {
    dia: -1,
    hora: '17:00',
    servicioId: 'infantil',
    profesionalId: 'tomas',
    cliente: 'Tiziano Correa',
    estado: 'completado',
    sena: 'no_aplica',
    origen: 'panel',
    cobrado: 14000,
    medio: 'transferencia',
  },
  {
    dia: 0,
    hora: '10:00',
    servicioId: 'color',
    profesionalId: 'martina',
    cliente: 'Camila Herrera',
    estado: 'confirmado',
    sena: 'pagada',
    origen: 'web',
  },
  {
    dia: 0,
    hora: '16:00',
    servicioId: 'corte',
    profesionalId: 'lucia',
    cliente: 'Valentina Ortiz',
    estado: 'confirmado',
    sena: 'pagada',
    origen: 'web',
    nota: 'Vengo con mi hijo',
  },
  {
    dia: 0,
    hora: '16:30',
    servicioId: 'corte-barba',
    profesionalId: 'tomas',
    cliente: 'Bruno Acosta',
    estado: 'confirmado',
    sena: 'pagada',
    origen: 'bot',
  },
  {
    dia: 0,
    hora: '17:30',
    servicioId: 'peinado',
    profesionalId: 'lucia',
    cliente: 'Florencia Ledesma',
    estado: 'confirmado',
    sena: 'no_aplica',
    origen: 'panel',
  },
  {
    dia: 0,
    hora: '18:30',
    servicioId: 'corte',
    profesionalId: 'tomas',
    cliente: 'Mateo Giménez',
    estado: 'pendiente_pago',
    sena: 'pendiente',
    origen: 'web',
    holdMinutosRestantes: 7,
  },
  {
    dia: 1,
    hora: '10:30',
    servicioId: 'alisado',
    profesionalId: 'martina',
    cliente: 'Abril Domínguez',
    estado: 'confirmado',
    sena: 'pagada',
    origen: 'web',
  },
  {
    dia: 1,
    hora: '16:00',
    servicioId: 'corte',
    profesionalId: 'tomas',
    cliente: 'Lautaro Benítez',
    estado: 'confirmado',
    sena: 'pagada',
    origen: 'web',
  },
  {
    dia: 1,
    hora: '17:00',
    servicioId: 'corte',
    profesionalId: 'lucia',
    cliente: 'Sofía Ramírez',
    estado: 'cancelado',
    sena: 'pagada',
    origen: 'web',
  },
  {
    dia: 2,
    hora: '11:00',
    servicioId: 'corte-barba',
    profesionalId: 'tomas',
    cliente: 'Joaquín Medina',
    estado: 'confirmado',
    sena: 'pagada',
    origen: 'bot',
  },
  {
    dia: 2,
    hora: '13:00',
    servicioId: 'color',
    profesionalId: 'martina',
    cliente: 'Valentina Ortiz',
    estado: 'confirmado',
    sena: 'pagada',
    origen: 'web',
  },
  {
    dia: 3,
    hora: '09:00',
    servicioId: 'peinado',
    profesionalId: 'lucia',
    cliente: 'Florencia Ledesma',
    estado: 'confirmado',
    sena: 'pagada',
    origen: 'web',
  },
  {
    dia: 3,
    hora: '10:00',
    servicioId: 'corte',
    profesionalId: 'tomas',
    cliente: 'Tiziano Correa',
    estado: 'conflicto_pago',
    sena: 'pagada',
    origen: 'web',
  },
];

/** Bloqueos de la agenda (solo los ve el dueño). Sin horas = el día entero; sin profesional = todo el local. */
export const BLOQUEOS_DEMO: readonly {
  dia: number;
  desde: string | null;
  hasta: string | null;
  profesionalId: string | null;
  motivo: string;
}[] = [
  { dia: 2, desde: '16:00', hasta: '17:00', profesionalId: 'lucia', motivo: 'Médico' },
  { dia: 8, desde: null, hasta: null, profesionalId: null, motivo: 'Feriado' },
];
