import type { Rubro } from './types';

export const rubro: Rubro = {
  id: 'gastronomia',
  nombre: 'Gastronomía',
  icono: 'cubiertos',
  descripcionCorta: 'Restaurantes, bares, cafés, rotiserías y delivery.',
  objetivos: [
    { id: 'mostrar_carta', etiqueta: 'Mostrar mi carta con QR' },
    { id: 'recibir_pedidos', etiqueta: 'Recibir pedidos online' },
    { id: 'recibir_reservas', etiqueta: 'Recibir reservas de mesa' },
    { id: 'cobrar_online', etiqueta: 'Cobrar online' },
    { id: 'que_me_contacten', etiqueta: 'Que me contacten fácil' },
  ],
  modulosSugeridos: ['carta_qr', 'turnos', 'pagos', 'notificaciones'],
  ejemploResultado:
    'Una carta digital con código QR para tus mesas, reservas online y aviso apenas entra un pedido.',
};
