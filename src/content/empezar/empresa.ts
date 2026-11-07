import { MODULOS } from '@/content/modulos';

/**
 * Lo que dice WebYa de sí misma como empresa: qué hace y cómo trabaja. Solo lo que se entrega hoy
 * (los módulos `disponible` de content/modulos.ts). Sin precios, plazos ni cifras inventadas.
 */
export const QUE_HACEMOS = {
  titulo: 'Cada pieza de tu negocio, hecha por nosotros.',
  bajada:
    'Elegís las que te sirven y encajan entre sí. Si lo tuyo es otra cosa, lo armamos a medida.',
  piezas: {
    sitio: {
      nombre: 'Tu sitio',
      texto: 'Tu negocio en internet, con tu nombre y tu estilo.',
      muestra: { negocio: 'Tu negocio', accion: 'Escribinos' },
    },
    carta: {
      nombre: MODULOS.carta_qr.nombre,
      texto: 'Escanean el código y ven tu carta en el celular.',
    },
    pedidos: {
      nombre: MODULOS.pedidos.nombre,
      texto: 'Cada pedido te llega ordenado, no mezclado en el chat.',
      muestra: { titulo: 'Pedido nuevo', detalle: 'Dos muzzarellas y una fainá, para llevar.' },
    },
    turnos: {
      nombre: MODULOS.turnos.nombre,
      texto: 'Toma los turnos y vos ves la agenda de la semana.',
      muestra: {
        dia: 'Sábado',
        franjas: [
          { nombre: 'Mañana', tomado: true },
          { nombre: 'Mediodía', tomado: false },
          { nombre: 'Tarde', tomado: false },
        ],
      },
    },
    catalogo: {
      nombre: MODULOS.catalogo.nombre,
      texto: 'Tus productos o servicios con fotos y precios, siempre al día.',
    },
    medida: {
      nombre: 'A medida',
      texto: 'Lo que no esté acá, lo armamos con vos.',
    },
  },
} as const;

export const COMO_TRABAJAMOS = {
  titulo: 'Cómo trabajamos',
  bajada: 'Sin vueltas y con una persona del otro lado.',
  pasos: [
    {
      nombre: 'Mirás cómo quedaría',
      texto: 'Elegís tu rubro y ves tu negocio con su nombre, sin dejar ningún dato.',
    },
    {
      nombre: 'Hablamos por WhatsApp',
      texto: 'Nos contás qué necesitás y te armamos un presupuesto sin compromiso.',
    },
    {
      nombre: 'Lo armamos nosotros',
      texto: 'Diseñamos y programamos todo. No tenés que configurar nada ni saber de tecnología.',
    },
    {
      nombre: 'Lo revisás y sale online',
      texto: 'Nada se publica sin tu visto bueno. Si tenés una duda, te contesta una persona.',
    },
  ],
} as const;
