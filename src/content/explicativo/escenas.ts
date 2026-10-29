/**
 * Texto que aparece DENTRO de las escenas del video explicativo (features/explicativo/escenas).
 * Ojo: el lienzo es un SVG de ancho fijo; los textos largos no se cortan solos.
 */
export const TEXTOS_ESCENAS = {
  problema: {
    /** Mensajes de WhatsApp que se amontonan. */
    mensajes: [
      '¿Siguen abiertos?',
      'Dos muzzas, porfa',
      '¿A qué hora paso?',
      'Mandame la carta',
      '¿Me anotaste?',
    ],
  },
  encastre: {
    rubro: 'Gastronomía',
    /** Piezas (módulos) que encajan en el teléfono. */
    piezas: {
      carta: 'Carta',
      pedidos: 'Pedidos',
      pagos: 'Pagos',
      avisos: 'Avisos',
    },
  },
  carta: {
    local: 'Tu pizzería',
    /** Por ilustración del plato. */
    platos: {
      pizza: { nombre: 'Muzzarella', precio: '$ 13.500' },
      empanada: { nombre: 'Empanada', precio: '$ 1.900' },
      faina: { nombre: 'Fainá', precio: '$ 1.800' },
    },
  },
  pedido: {
    modalidades: ['Retiro', 'En el local', 'Envío'],
    confirmar: 'Confirmar',
    numero: '#24',
  },
  panel: {
    columnas: ['Nuevo', 'Preparando', 'Listo'],
    /** Números de los pedidos del tablero. */
    numeros: { preparando: '#21', listo: '#20', nuevo: '#24' },
  },
  seguimiento: {
    titulo: 'Pedido #24',
    pasos: ['Recibido', 'En preparación', 'Listo', 'Entregado'],
    /** El mensaje que deja de hacer falta (se tacha). */
    burbuja: '¿Falta mucho?',
  },
  marca: {
    local: 'Tu local',
  },
  nosotros: {
    online: 'Online',
  },
  cta: {
    lema: 'Creá. Digitalizá. Crecé.',
  },
} as const;
