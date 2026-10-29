/** Panel del dueño (duenio/PanelDuenio y duenio/calculos). */
export const PANEL = {
  eyebrow: 'Panel del dueño',
  titulo: (nombreLocal: string) => `Pedidos de ${nombreLocal}`,
  simular: 'Simular un pedido',
  sonido: 'Sonido al entrar un pedido',
  /** Anuncios para lectores de pantalla. `estado` llega en minúscula. */
  anuncio: {
    nuevo: (numero: number, detalle: string) => `Entró el pedido #${numero}: ${detalle}.`,
    estado: (numero: number, estado: string) => `Pedido #${numero}: ${estado}.`,
  },
  resumen: {
    pedidos: 'Pedidos',
    enCurso: 'En curso',
    entregados: 'Entregados',
    ventas: 'Ventas',
    nota: 'Calculado con los pedidos de esta demo.',
  },
  filtros: {
    leyenda: 'Filtrar por cómo se recibe',
    todas: 'Todos',
    mesa: 'Mesa',
    retiro: 'Retiro',
    delivery: 'Delivery',
  },
  vacio: {
    titulo: 'Acá encaja tu primer pedido.',
    bajada:
      'Hacé uno desde la carta o tocá “Simular un pedido”. Todavía no entró nada, pero ya va a picar.',
  },
  columnaVacia: 'Nada por acá.',
  /** Títulos de las columnas del tablero, por id de columna. */
  columnas: {
    nuevos: 'Nuevos',
    preparando: 'Preparando',
    listos: 'Listos',
    terminados: 'Entregados',
  },
  borrar: 'Borrar los pedidos de la demo',
  tituloComanda: (numero: number) => `Comanda #${numero}`,
  /** Cómo lo recibe, en corto: "Mesa 4", "Retira", "Delivery". */
  modalidad: {
    mesa: (mesa: string) => `Mesa ${mesa}`,
    retiro: 'Retira',
    delivery: 'Delivery',
  },
  /** Tiempo transcurrido desde una hora: "1 h 05 min". */
  horasYMinutos: (horas: number, minutos: string) => `${horas} h ${minutos} min`,
} as const;

/** Un pedido en el tablero (duenio/TarjetaPedido). */
export const TARJETA_PEDIDO = {
  /** Prefijo solo para lectores de pantalla ("Hace 01:15"). */
  hace: 'Hace ',
  entregadoEn: (minutos: number) => (minutos < 1 ? ' en menos de 1 min' : ` en ${minutos} min`),
  yMas: (n: number) => `y ${n} más`,
  total: 'Total',
  ariaAccion: (accion: string, numero: number) => `${accion} el pedido #${numero}`,
  comanda: 'Comanda',
  ariaComanda: (numero: number) => `Ver la comanda del pedido #${numero}`,
  cancelar: 'Cancelar',
  ariaCancelar: (numero: number) => `Cancelar el pedido #${numero}`,
} as const;

/** Comanda para la cocina (duenio/Comanda). */
export const COMANDA = {
  pie: 'Comanda de ejemplo',
  imprimir: 'Imprimir',
} as const;
