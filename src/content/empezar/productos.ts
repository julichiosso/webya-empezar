/**
 * "Lo que ya funciona": los dos productos que se pueden probar hoy y el creador. Cada uno dice el
 * resultado, tres cosas concretas y un solo lugar adonde ir.
 */
export const PRODUCTOS = {
  titulo: 'Tocalo antes de decidir.',
  bajada: 'Esto no es una promesa: son demos que andan. Probalas sin dejar ningún dato.',
  turnos: {
    rubro: 'Peluquerías y barberías',
    titulo: 'Seguí cortando. El bot te toma los turnos.',
    puntos: [
      'Un bot atiende a tus clientes y reserva por vos.',
      'La agenda de la semana, ordenada y a mano.',
      'Estadísticas con ciencia de datos e IA: qué franjas llenar y a quién recuperar.',
    ],
    cta: 'Probar el bot de turnos',
    href: '/demo/peluqueria',
    chat: [
      { de: 'persona', texto: 'Corte y barba el sábado a la mañana' },
      { de: 'bot', texto: 'Tengo a las 9:00, 10:30 y 12:00. ¿Cuál te queda?' },
      { de: 'persona', texto: 'A las 10:30' },
      { de: 'bot', texto: 'Listo, Fede. Te esperamos el sábado a las 10:30.' },
    ],
    ejemplo: 'Conversación de ejemplo.',
  },
  pedidos: {
    rubro: 'Gastronomía',
    titulo: 'Tu carta y tus pedidos, sin líos de WhatsApp.',
    puntos: [
      'Escanean el QR, miran la carta y piden desde el celular.',
      'Cada pedido te llega ordenado, no mezclado en el chat.',
      'Tu carta siempre al día, con fotos y precios.',
    ],
    cta: 'Probar la carta con pedidos',
    href: '/demo/gastronomia',
    comanda: { titulo: 'Pedido nuevo', detalle: 'Dos muzzarellas y una fainá, para llevar.' },
    /** Id de un cliente real (content/clientes.ts) cuya captura se muestra. */
    cliente: 'abelardo',
    real: (nombre: string) => `El sitio real de ${nombre}.`,
  },
  crear: {
    rubro: 'Cualquier otro negocio',
    titulo: 'O armá tu sitio ahora, sin cuenta.',
    puntos: [
      'Cargá el nombre, lo que ofrecés y tus precios, y miralo mientras escribís.',
      'Te llevás un link para mandarle a quien quieras.',
      'Cuando te guste, lo publicamos con vos.',
    ],
    cta: 'Armar mi sitio',
    href: '/crear',
    ejemplo: { rubro: 'comercio', negocio: 'Casa Olivia', paleta: 'pileta' },
  },
} as const;
