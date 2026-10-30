import { HERO } from '@/content/empezar/hero';
import { PENDIENTES } from '@/content/pendientes';

/**
 * /marca: página interna para comparar las paletas de marca (no se indexa). Los nombres e ideas de
 * cada paleta y de cada combinación de contraste viven en brand/tokens/colores.
 */
export const MARCA = {
  titulo: 'Paletas de marca',
  bajada:
    'Concepto Encastre: tu negocio se arma pieza por pieza, y la pieza que encaja se enciende. Compará las tres paletas; si no elegís, queda Brasa.',
  nota: 'Página interna, no se indexa. Pedido y precios de ejemplo.',
  base: {
    titulo: 'Base, igual en las tres',
    tablaTitulo: 'Contraste medido de la base',
  },
  paleta: {
    porDefecto: 'Por defecto',
    tablaTitulo: (paleta: string) => `Contraste medido de ${paleta}`,
    /** Nombres de las muestras de color. */
    muestras: {
      acento: 'Acento',
      acentoSobrePapel: 'Acento sobre papel',
      crema: 'Crema',
      negro: 'Negro',
      error: 'Error',
    },
  },
  /** El hero de /empezar en miniatura, con la paleta aplicada. */
  heroMuestra: {
    etiqueta: 'Hero',
    titulo: HERO.titulo,
    subtitulo: HERO.subtitulo,
    cta: HERO.cta,
    acento: 'Te escribimos por WhatsApp',
    /** Mismo pendiente que el hero real. */
    todoPlazo: PENDIENTES.plazoRespuesta,
    piezas: { cartaQr: 'Carta con QR', pagos: 'Pagos online' },
    /** Estado de cada pieza para lectores de pantalla (va pegado al nombre). */
    activado: ' (activado)',
    sinActivar: ' (sin activar)',
  },
  /** Tarjeta de pedido de ejemplo (datos inventados a propósito: es una muestra de diseño). */
  pedidoMuestra: {
    etiqueta: 'Tarjeta de pedido',
    numero: 42,
    titulo: (numero: number) => `Pedido #${numero}`,
    estado: 'En preparación',
    detalle: 'Mesa 4 · hace 3 min',
    /** Precio unitario en pesos (se pasa a centavos en la página). */
    items: [
      { cantidad: 2, nombre: 'Muzzarella grande', nota: 'Sin aceitunas', precio: 9_800 },
      { cantidad: 1, nombre: 'Fainá', nota: null, precio: 2_400 },
      { cantidad: 1, nombre: 'Agua sin gas', nota: null, precio: 1_900 },
    ],
    total: 'Total',
    aviso: 'Nuevo: entró hace 3 minutos',
    accion: 'Marcar como listo',
  },
  /** Tabla de contraste. */
  tabla: {
    combinacion: 'Combinación',
    contraste: 'Contraste',
    minimo: 'Mínimo',
    aa: 'AA',
    /** Muestra de texto sobre el fondo de cada combinación. */
    muestra: 'Aa',
    pasa: 'Pasa',
    noLlega: 'No llega',
  },
} as const;
