/** Seguimiento en vivo del pedido, del lado del cliente (cliente/Seguimiento). */
export const SEGUIMIENTO = {
  /** Qué le decimos al cliente en cada estado (el de "listo" depende de cómo lo recibe). */
  mensajes: {
    recibido: 'El local recibió tu pedido.',
    en_preparacion: 'Lo están preparando.',
    listo: {
      mesa: 'Está listo: ya te lo llevan a la mesa.',
      retiro: 'Está listo: pasá a buscarlo.',
      delivery: 'Está listo: sale para tu casa.',
    },
    entregado: '¡Que lo disfrutes!',
    cancelado: 'El local canceló el pedido.',
  },
  detalle: {
    mesa: (mesa: string | null) => `Mesa ${mesa}`,
    delivery: (direccion: string | null) => `Delivery a ${direccion}`,
    retiro: 'Para retirar',
  },
  titulo: (numero: number) => `Pedido #${numero}`,
  /** Solo para lectores de pantalla, al lado de cada paso. */
  paso: {
    hecho: ' (hecho)',
    ahora: ' (ahora)',
  },
  total: 'Total',
  aviso: {
    intro: 'Es una demo: este pedido no llega a ninguna cocina. Lo recibe el panel del dueño:',
    celular: 'tocá “Ver como dueño” abajo para avanzarlo.',
    escritorio: 'avanzalo desde el panel de al lado.',
  },
  otroPedido: 'Hacer otro pedido',
} as const;
