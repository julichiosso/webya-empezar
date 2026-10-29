/** El pedido del cliente: barra, hoja del carrito y sus dos pasos (cliente/DemoCliente y CarritoHoja). */
export const CARRITO = {
  verPedido: 'Ver mi pedido',
  titulo: {
    resumen: 'Tu pedido',
    datos: '¿Cómo lo querés?',
  },
  vacio: {
    titulo: 'Tu pedido quedó vacío.',
    bajada: 'Acá encaja lo que elijas de la carta.',
  },
  propina: {
    titulo: '¿Querés dejar propina?',
    sin: 'Sin propina',
    porcentaje: (p: number) => `${p} %`,
  },
  filas: {
    subtotal: 'Subtotal',
    propina: 'Propina',
    envio: 'Envío',
    total: 'Total',
  },
  seguir: 'Seguir',
  modalidad: {
    titulo: '¿Cómo lo recibís?',
    opciones: {
      mesa: 'En la mesa',
      retiro: 'Paso a buscar',
      delivery: 'Delivery',
    },
  },
  mesa: 'Número de mesa',
  direccion: {
    titulo: '¿A dónde te lo llevamos?',
    placeholder: 'Calle, número y piso',
  },
  nombre: {
    titulo: 'Tu nombre',
    ayuda: 'Para llamarte cuando esté listo.',
  },
  pago: {
    titulo: '¿Cómo pagás?',
    medios: {
      efectivo: { nombre: 'Efectivo', detalle: 'Pagás al recibirlo.' },
      mercado_pago: {
        nombre: 'Mercado Pago (simulado)',
        detalle: 'En la demo no se cobra nada.',
      },
    },
  },
  volver: 'Volver',
  confirmar: 'Confirmar',
} as const;
