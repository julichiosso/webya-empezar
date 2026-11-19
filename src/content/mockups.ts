/**
 * Textos de las mini pantallas vectoriales (turnero, pedidos, tienda, web). Son DATOS DE EJEMPLO para
 * explicar el flujo: no son clientes, precios ni horarios reales.
 */

export const MOCKUPS = {
  etiqueta: 'Ejemplo ilustrativo',
  turnero: {
    alt: 'Ejemplo del turnero en el celular: reserva con seña, aviso al dueño, recordatorio del bot y agenda.',
    app: 'Turnos',
    dia: 'Sábado 14',
    noVino: 'No vino',
    sinAviso: 'Sin aviso',
    libre: 'Libre',
    reservado: 'Reservado',
    horarios: ['09:00', '09:30', '10:00', '10:30', '11:00'],
    servicio: 'Corte y baño',
    profesional: 'Con Sofía',
    hora: '10:30',
    sena: 'Seña 50%',
    pagar: 'Pagar seña con Mercado Pago',
    asegurado: 'Turno asegurado',
    bloqueo: { hora: '10:24', fecha: 'jueves 12 de noviembre' },
    notificacion: {
      app: 'Turnos',
      cuando: 'ahora',
      titulo: 'Nueva reserva',
      texto: 'Sábado 10:30 · Seña pagada',
    },
    chat: {
      nombre: 'Turnos · Bot',
      mensajes: [
        { de: 'bot', texto: 'Listo, tu turno quedó para el sábado a las 10:30.' },
        { de: 'bot', texto: 'Te recuerdo: mañana a las 10:30 tenés turno. ¿Venís?' },
        { de: 'cliente', texto: 'Sí, ahí estoy' },
      ],
    },
    agenda: {
      titulo: 'Hoy',
      profesionales: ['Sofía', 'Martín'],
      filas: [
        { hora: '09:00', a: 'Reservado', b: '' },
        { hora: '09:30', a: '', b: 'Reservado' },
        { hora: '10:00', a: 'Reservado', b: 'Reservado' },
        { hora: '10:30', a: 'Reservado', b: '' },
        { hora: '11:00', a: '', b: 'Reservado' },
      ],
    },
  },
  pedidos: {
    alt: 'Ejemplo del sistema de pedidos: el cliente arma el pedido, elige la franja de retiro y sale la comanda impresa.',
    app: 'Pedidos',
    items: [
      { nombre: 'Muzzarella', cantidad: '1' },
      { nombre: 'Napolitana', cantidad: '1' },
      { nombre: 'Fainá', cantidad: '2' },
    ],
    carrito: 'Tu pedido',
    retiro: 'Retiro',
    franjas: [
      { hora: '21:00', estado: 'Completa' },
      { hora: '21:15', estado: 'Quedan 2' },
      { hora: '21:30', estado: 'Libre' },
    ],
    confirmar: 'Confirmar pedido',
    confirmado: 'Pedido confirmado · retirás 21:15',
    comanda: {
      titulo: 'Comanda #24',
      retira: 'Retira 21:15',
    },
  },
  tienda: {
    app: 'Tienda',
    categorias: ['Anillos', 'Relojes', 'Mates'],
    consultar: 'Consultar',
    agregar: 'Agregar',
  },
  web: {
    app: 'Sitio',
    titulo: 'Fonoaudiología',
    secciones: ['Especialidades', 'Obras sociales', 'Contacto'],
    whatsapp: 'Pedir turno por WhatsApp',
  },
} as const;
