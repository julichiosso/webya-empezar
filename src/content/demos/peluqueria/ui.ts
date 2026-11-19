import type { DiaSemana, Franja } from '@/domain/turnos/agenda';

const pesos = (centavos: number) =>
  (centavos / 100).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  });

const pct = (ratio: number) => `${Math.round(ratio * 100)} %`;

export const DIA_CORTO: Readonly<Record<DiaSemana, string>> = {
  mar: 'Mar',
  mie: 'Mié',
  jue: 'Jue',
  vie: 'Vie',
  sab: 'Sáb',
};
export const DIA_LARGO: Readonly<Record<DiaSemana, string>> = {
  mar: 'martes',
  mie: 'miércoles',
  jue: 'jueves',
  vie: 'viernes',
  sab: 'sábado',
};
export const FRANJA_NOMBRE: Readonly<Record<Franja, string>> = {
  manana: 'Mañana',
  tarde: 'Tarde',
};
const FRANJA_FRASE: Readonly<Record<Franja, string>> = {
  manana: 'a la mañana',
  tarde: 'a la tarde',
};

export const AVISO_DEMO_PELU = 'Demo con datos de ejemplo. No se reserva ni se envía nada.';

export const PAGINA_PELU = {
  titulo: 'Bot de turnos para peluquerías y barberías',
  descripcion:
    'Probá el bot que toma los turnos de tu peluquería, mirá cómo se llena la agenda y qué te dicen las estadísticas. Con datos de ejemplo.',
  ariaLogo: 'WebYa: volver al inicio',
  encabezado: {
    titulo: 'Seguí cortando. El bot te toma los turnos.',
    bajada:
      'Pedile un turno como si fueras un cliente. Escribí con tus palabras o tocá una opción, y mirá cómo cae en la agenda.',
  },
  og: { sitio: 'WebYa', titulo: (t: string) => `${t} | WebYa` },
} as const;

export const CTA_PELU = {
  texto: 'Quiero esto para mi peluquería',
  corto: 'Lo quiero',
  ariaCorto: 'Lo quiero para mi peluquería',
} as const;

export const PERSONALIZAR_PELU = {
  etiqueta: 'El nombre de tu peluquería',
  placeholder: 'Ej: Barbería Norte',
  colores: 'Colores',
} as const;

export const VISTAS_PELU = {
  aria: 'Qué ver',
  cliente: 'Tu cliente',
  duenio: 'Tu agenda',
} as const;

export const BOT = {
  aria: 'Conversación con el bot de turnos',
  campo: 'Escribile al bot',
  placeholderTexto: 'Ej: corte y barba el sábado a la mañana',
  placeholderNombre: 'Tu nombre',
  enviar: 'Enviar',
  reiniciar: 'Pedir otro turno',
  saludo: (negocio: string) => `¡Hola! Soy el bot de ${negocio}. ¿Qué te querés hacer?`,
  preguntaDia: (servicio: string) => `${servicio}, perfecto. ¿Qué día te queda bien?`,
  preguntaHorario: (dia: string, franja: Franja | null) =>
    `Para el ${dia}${franja ? ` ${FRANJA_FRASE[franja]}` : ''} tengo estos horarios:`,
  preguntaNombre: (dia: string, hora: string) =>
    `Te guardo el ${dia} a las ${hora}. ¿A nombre de quién?`,
  confirmado: (nombre: string, servicio: string, dia: string, hora: string) =>
    `Listo, ${nombre}. ${servicio} el ${dia} a las ${hora}. Te esperamos.`,
  avisos: {
    no_entendi: 'No te entendí. Decime qué te querés hacer y qué día, o tocá una opción.',
    sin_lugar: 'Ese día está completo para lo que pedís. ¿Probamos otro?',
    ocupado: 'Ese horario ya está tomado. Elegí uno de estos:',
    nombre_corto: 'Necesito un nombre para anotar el turno.',
  },
} as const;

export const PANEL_PELU = {
  aria: 'Panel del dueño',
  pestanas: { agenda: 'Agenda', estadisticas: 'Estadísticas' },
  agenda: {
    titulo: 'La agenda de la semana',
    diaAria: 'Elegí el día',
    vacio: 'Este día todavía no tiene turnos. Ya va a picar.',
    delBot: 'Lo tomó el bot recién',
    libres: (n: number) => (n === 1 ? 'Queda un lugar libre' : `Quedan ${n} lugares libres`),
    anuncio: (cliente: string, dia: string, hora: string) =>
      `Turno nuevo: ${cliente}, ${dia} a las ${hora}.`,
    deEjemplo: 'Clientes y horarios de ejemplo.',
  },
  numeros: {
    ocupacion: { titulo: 'De esta semana ya está tomado', valor: pct },
    ingresos: { titulo: 'Ingreso de los turnos tomados', valor: pesos },
    ausencias: { titulo: 'Turnos a los que no vinieron', valor: pct },
    porVolver: { titulo: 'Clientes para recuperar', valor: (n: number) => String(n) },
  },
  calor: {
    titulo: 'Qué tan llena está cada franja',
    bajada: 'Promedio de las últimas doce semanas.',
    celda: (dia: string, franja: string, ocupacion: number) =>
      `${dia}, ${franja}: ${pct(ocupacion)} ocupado`,
    valor: pct,
    franja: 'Franja',
  },
  prevision: {
    titulo: 'Turnos que se esperan la semana que viene',
    bajada: 'Sale de las últimas cuatro semanas, pesando más las más recientes.',
    barra: (dia: string, turnos: number) => `${dia}: ${turnos} turnos`,
    sube: 'viene subiendo',
    baja: 'viene bajando',
  },
  volver: {
    titulo: 'Hace mucho que no vienen',
    bajada: 'Se pasaron de su ritmo de siempre. Un mensaje a tiempo los trae de vuelta.',
    fila: (ritmo: number, sinVenir: number) =>
      `Venía cada ${ritmo} días. Hace ${sinVenir} que no viene.`,
    vacio: 'Todos al día. Hoy no hay a quién recuperar.',
  },
  sugerencia: {
    titulo: 'Lo que haríamos esta semana',
    floja: (dia: string, franja: Franja, ocupacion: number) =>
      `El ${dia} ${FRANJA_FRASE[franja]} es tu franja con más lugar (${pct(ocupacion)}). Una promo ahí llena horas que hoy están vacías.`,
    recuperar: (n: number) =>
      n === 1
        ? 'Tenés un cliente que se pasó de su ritmo: escribile antes de que se vaya a otro lado.'
        : `Tenés ${n} clientes que se pasaron de su ritmo: escribiles antes de que se vayan a otro lado.`,
    ausencias: (tasa: number) =>
      `Faltan a ${pct(tasa)} de los turnos. Pedir una seña en los horarios más buscados te cuida esas horas.`,
  },
  aclaracion:
    'Las cuentas son de verdad, sobre clientes y turnos de ejemplo. Con tu negocio, salen de tus datos.',
} as const;
