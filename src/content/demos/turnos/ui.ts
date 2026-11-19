/**
 * Textos de la demo de turnos (/demo/turnos): el turnero que ve el cliente, el checkout simulado de
 * Mercado Pago y el panel del dueño. Salen del sistema real (DEMO_SPEC_TURNOS §1, §2 y §5). No se envía
 * nada: el pago, los avisos y los mensajes se simulan.
 */

export const pesos = (n: number) =>
  n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;
export const DIAS_LARGO = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
] as const;
export const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

export const FECHAS = {
  hoy: 'Hoy',
  manana: 'Mañana',
  mananaCorto: 'Mañ',
  /** "Hoy 16:30", "Mañana 10:00", "Vie 21 11:30". */
  momento: (dia: string, hora: string) => `${dia} ${hora}`,
  /** "viernes 20 de noviembre a las 16:30". */
  largo: (diaSemana: string, dia: number | string, mes: string, hora: string) =>
    `${diaSemana} ${dia} de ${mes} a las ${hora}`,
  /** "viernes 20 de noviembre". */
  dia: (diaSemana: string, dia: number | string, mes: string) => `${diaSemana} ${dia} de ${mes}`,
  /** "hoy a las 16:30". */
  aLas: (dia: string, hora: string) => `${dia} a las ${hora}`,
} as const;

export const PAGINA_TURNOS = {
  titulo: 'Demo del sistema de turnos con seña',
  descripcion:
    'Probá el turnero con seña: el cliente elige servicio, día y hora, paga la seña y el turno entra solo a tu agenda.',
  og: { sitio: 'Webya', titulo: (t: string) => `${t} · Webya` },
} as const;

export const GUIA_TURNOS = {
  aria: 'Cómo probar la demo',
  hecho: 'Hecho',
  pasos: [
    { titulo: 'Reservá un turno', texto: 'Elegí servicio, día y hora, y pagá la seña.' },
    {
      titulo: 'Mirá cómo llega',
      texto: 'Entra a la agenda ya confirmado. No hay que aprobar nada.',
    },
    { titulo: 'Atendelo y cobrá', texto: 'Tocá «Terminé» y anotá lo que te pagó.' },
  ],
} as const;

export const LADOS_TURNOS = {
  cliente: 'Así lo ve tu cliente',
  panel: 'Así lo manejás vos',
} as const;

export const VISTAS_TURNOS = {
  aria: 'Qué pantalla ver',
  cliente: 'Cliente',
  duenio: 'Dueño',
  novedad: 'Entró una reserva nueva',
} as const;

export const PORTADA = {
  abierto: (hasta: string) => `Abierto · hasta las ${hasta}`,
  cerradoHoy: (hora: string) => `Cerrado · abre hoy a las ${hora}`,
  cerradoManana: (hora: string) => `Cerrado · abre mañana a las ${hora}`,
  cerradoDia: (dia: string, hora: string) => `Cerrado · abre el ${dia} a las ${hora}`,
  acciones: ['WhatsApp', 'Cómo llegar', 'Instagram', 'Compartir'],
  firma: 'Desarrollado por Webya',
} as const;

export const PASOS = {
  aria: 'Pasos de la reserva',
  nombres: ['Servicio', 'Día y hora', 'Confirmar'],
  volver: 'Volver',
} as const;

export const ELEGIR_SERVICIO = {
  titulo: '¿Qué te hacés?',
  bajada: 'Reservás con una seña del 50%. El resto lo pagás en el local.',
  minutos: (n: number | string) => `${n} min`,
  sena: (monto: string) => `Seña ${monto}`,
  sinLugar: 'Sin lugar por ahora',
  deSiempre: (nombre: string) => `¿Lo de siempre, ${nombre}?`,
  reservar: 'Reservar',
} as const;

export const ELEGIR_PROFESIONAL = {
  titulo: '¿Con quién?',
  cualquiera: 'Cualquiera',
  cualquieraTexto: 'El primero libre',
} as const;

export const ELEGIR_HORARIO = {
  titulo: '¿Cuándo venís?',
  masCercano: 'Lo más cercano',
  reservar: 'Reservar',
  elegi: 'Elegí día y hora',
  diasConLugar: (n: number | string) => `${n} días con lugar`,
  momentos: { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' },
  quedan: (n: number) => (n === 1 ? 'Queda 1 horario' : `Quedan ${n}`),
  sinHorarios:
    'No quedan horarios para este servicio. Escribinos por WhatsApp y vemos cómo hacemos.',
  ocupado: 'Ese horario se acaba de ocupar. Elegí otro.',
} as const;

export const DATOS = {
  titulo: 'Último paso',
  hola: (nombre: string) => `Hola de nuevo, ${nombre}. Ya completamos tus datos.`,
  senaAhora: 'Seña ahora',
  enLocal: 'En el local',
  nombre: 'Nombre y apellido',
  whatsapp: 'WhatsApp',
  whatsappAyuda: 'Solo para avisarte sobre tu turno.',
  whatsappEjemplo: '11 2345 6789',
  correo: 'Correo',
  correoAyuda: 'Te mandamos la confirmación y un recordatorio 30 minutos antes.',
  correoEjemplo: 'nombre@gmail.com',
  errores: {
    nombre: 'Ingresá tu nombre.',
    telefono: 'Poné característica y número, por ejemplo 11 2345 6789.',
    correo: 'Ingresá tu correo.',
    correoMal: 'Revisá el correo, por ejemplo nombre@gmail.com.',
  },
  nota: 'Nota para el peluquero',
  notaEjemplo: 'Por ejemplo: vengo con mi hijo',
  opcional: 'Opcional',
  pagar: (monto: string) => `Pagar seña ${monto}`,
  protegido: 'Pago protegido por Mercado Pago',
  garantias: [
    'Pagás en la página segura de Mercado Pago. Acá no guardamos los datos de tu tarjeta.',
    'Apartamos tu horario 10 minutos mientras pagás.',
    'Al acreditarse el pago, tu turno queda confirmado.',
  ],
} as const;

export const CHECKOUT = {
  marca: 'Mercado Pago',
  aviso: 'Simulación de pago. No se cobra nada ni se usa ninguna tarjeta.',
  concepto: (servicio: string) => `Seña · ${servicio}`,
  pregunta: '¿Cómo querés que salga el pago?',
  aprobado: 'Pago aprobado',
  rechazado: 'Pago rechazado',
  volver: 'Volver sin pagar',
  pie: 'Entorno de prueba',
} as const;

export const ESPERA = {
  reservando: 'Reservando tu turno',
  reservandoTexto: 'Te llevamos a Mercado Pago para pagar la seña.',
  confirmando: 'Confirmando tu pago',
  confirmandoTexto: 'Mercado Pago nos avisa en unos segundos. No cierres esta página.',
} as const;

export const MI_RESERVA = {
  confirmado: (nombre: string) => `¡Listo, ${nombre}! Tu turno está confirmado`,
  pendiente: 'Falta pagar la seña',
  pendienteTexto: 'El turno se confirma cuando se acredita el pago.',
  guardado: (tiempo: string) => `Horario guardado por ${tiempo}`,
  pagarMp: (monto: string) => `Pagar ${monto} con Mercado Pago`,
  soltar: 'Soltar este horario',
  expirado: 'La reserva venció',
  expiradoTexto: 'No registramos el pago y el horario se liberó.',
  cancelado: 'Turno cancelado',
  otro: 'Sacar otro turno',
  servicio: 'Servicio',
  cuando: 'Cuándo',
  sena: 'Seña',
  pagada: (monto: string) => `${monto} (pagada)`,
  enLocal: 'A pagar en el local',
  avisar: 'Avisarme 30 minutos antes',
  avisado: 'Te avisamos 30 minutos antes',
  calendario: 'Agregar al calendario, suena 30 min antes',
  cancelar: 'Cancelar turno',
  cancelarTarde: 'Para cancelar faltando menos de 24 horas, escribinos por WhatsApp.',
  cancelarPregunta: '¿Cancelar este turno?',
  si: 'Sí, cancelar',
  no: 'No',
  verPanel: 'Ver la agenda del dueño',
  eventoCalendario: (servicio: string, negocio: string) => `${servicio} en ${negocio}`,
} as const;

export const PANEL_TURNOS = {
  marca: 'Tu Panel',
  pestanas: { inicio: 'Inicio', agenda: 'Agenda' },
  pestanasAria: 'Secciones del panel',
  enVivo: 'En vivo',
  titulo: (n: number) =>
    n === 0 ? 'Terminaste por hoy' : n === 1 ? 'Último del día' : `${n} por atender`,
  enLaSilla: 'En la silla',
  con: (profesional: string) => `con ${profesional}`,
  cobrar: (monto: string) => `Cobrar ${monto}`,
  pagoTodo: 'Pagó todo',
  termine: 'Terminé',
  noVino: 'No vino',
  fila: 'La fila',
  enMinutos: (min: number) =>
    min < 60 ? `en ${min} min` : `en ${Math.floor(min / 60)} h ${min % 60} min`,
  atendidos: (n: number | string, monto: string) => `Atendidos · ${n} · entró ${monto}`,
  aResolver: 'A resolver',
  conflicto: (nombre: string) => `${nombre} · pagó y el horario se ocupó`,
  senaCancelado: (nombre: string) => `${nombre} · seña de un turno cancelado`,
  adelantar: '+10 min',
  adelantarAria: 'Adelantar 10 minutos el reloj de la demo',
  resolver: 'Resolver',
  manana: (n: number | string, desde: string) => `Mañana ${n} · desde ${desde}`,
  nueva: 'Nueva',
  cobrado: 'Cobrado',
  sinSena: 'Sin seña',
  avisoNueva: {
    titulo: 'Nueva reserva',
    texto: (nombre: string, servicio: string, cuando: string) =>
      `${nombre} · ${servicio} · ${cuando}. Seña pagada.`,
  },
  agenda: {
    resumen: (n: number | string, monto: string) => `${n} turnos · ${monto} en señas`,
    libre: (hasta: string) => `Libre hasta las ${hasta}`,
    bloqueado: (hasta: string, motivo: string) => `Bloqueado hasta las ${hasta} · ${motivo}`,
    bloqueadoDia: (motivo: string) => `Bloqueado todo el día · ${motivo}`,
    todos: 'Todos',
    cerrado: 'Cerrado',
    filtroAria: 'Profesional',
  },
} as const;

export const ESTADOS_TURNO = {
  pendiente_pago: 'Esperando seña',
  confirmado: 'Confirmado',
  completado: 'Atendido',
  ausente: 'No vino',
  cancelado: 'Cancelado',
  expirado: 'Venció sin pago',
  conflicto_pago: 'Pagó sin horario',
} as const;

export const ESTADOS_SENA = {
  pendiente: 'Seña pendiente',
  pagada: 'Seña pagada',
  devuelta: 'Seña devuelta',
  no_aplica: 'Sin seña',
} as const;

export const HOJA_TURNO = {
  cerrar: 'Cerrar',
  cuando: 'Cuándo',
  servicio: 'Servicio',
  profesional: 'Con',
  precio: 'Precio',
  sena: 'Seña',
  aCobrar: 'A cobrar en el local',
  nota: 'Nota del cliente',
  sobreCliente: 'Sobre el cliente',
  faltas: (n: number, ultima: string) =>
    `Faltó ${n === 1 ? '1 vez' : `${n} veces`} antes · la última, el ${ultima}`,
  origen: { web: 'Reservó online', panel: 'Lo cargaste vos', bot: 'Reservó por el bot' },
  atendido: 'Atendido',
  noVino: 'No vino',
  cancelar: 'Cancelar turno',
  cancelarPregunta: (nombre: string, sena: string) =>
    `¿Cancelar el turno de ${nombre}? El horario se libera. La seña de ${sena} no se devuelve sola: vas a poder devolverla después.`,
  siCancelar: 'Sí, cancelar',
  no: 'No',
  restaurar: 'Volver a confirmado',
  devolver: (monto: string) => `Devolver ${monto}`,
  devolverPregunta: (nombre: string, monto: string) =>
    `¿Devolver ${monto} a ${nombre}? Mercado Pago le reintegra el total. No se puede deshacer.`,
  siDevolver: 'Sí, devolver',
} as const;

export const COBRO = {
  titulo: (nombre: string) => `Terminaste con ${nombre}`,
  debe: (monto: string) => `Te tiene que pagar ${monto}`,
  cuanto: '¿Cuánto te pagó?',
  ayuda: 'Cambialo si le hiciste descuento o te dejó propina.',
  medios: {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    tarjeta: 'Tarjeta',
    otro: 'Otro',
  },
  listo: (monto: string) => `Listo, cobré ${monto}`,
  sinAnotar: 'Terminar sin anotar el cobro',
  todoPago: 'Ya pagó todo con la seña. No te debe nada.',
} as const;

export const CARTELES = {
  atendido: (nombre: string) => `${nombre} · atendido`,
  noVino: (nombre: string) => `${nombre} · no vino`,
  cancelado: (nombre: string) => `${nombre} · turno cancelado`,
  devuelta: (nombre: string) => `Seña devuelta a ${nombre}`,
  restaurado: (nombre: string) => `${nombre} · volvió a confirmado`,
  deshacer: 'Deshacer',
} as const;
