import { BARRA_CAPTURA } from '@/brand/tokens/colores';
import type { TipoId } from './servicios';

/**
 * MANIFIESTO DE PROYECTOS (casos). Única fuente de la sección de la home, los filtros, la barra de datos,
 * las páginas /proyectos/[slug], las vidrieras y el JSON-LD. Para sumar un cliente alcanza con agregar un
 * objeto acá.
 *
 * Reglas: solo trabajos reales; `armamos` cuenta lo que el sistema hace hoy; `resultado` y `testimonio`
 * solo si son verificables y autorizados (si faltan, no se muestra el bloque). Nada de cifras inventadas:
 * los números de los sitios de los clientes son de ellos, no resultados de Webya.
 *
 * Imágenes: `mobile` y `desktop` son capturas reales de los sitios publicados; `admin`, del panel. Si una
 * falta, se dibuja el esquema vectorial de `mockup`. La lista de capturas pedidas está en IMAGENES.md.
 */

/**
 * - `produccion`: funcionando en el negocio.
 * - `producto`: sistema terminado, disponible para otros negocios (todavía sin uso en el que se armó).
 * - `construccion`: en desarrollo; no se muestra en la home ni tiene enlace público.
 */
export type EstadoProyecto = 'produccion' | 'producto' | 'construccion';

/** Mockups vectoriales disponibles (components/marketing/editorial/Pantallas). */
export type MockupId = 'pedidos' | 'tienda' | 'web' | 'turnero';

export interface ImagenProyecto {
  src: string;
  ancho: number;
  alto: number;
  alt: string;
  /**
   * Barra de estado del teléfono: toma el color de arriba del sitio, como en Safari. `claro`: hora e
   * íconos en blanco (sitios oscuros).
   */
  barra?: { fondo: string; claro: boolean };
  /** La captura ya trae la barra de estado del teléfono (pantalla completa). */
  completa?: boolean;
}

export interface Testimonio {
  cita: string;
  autor: string;
  cargo: string;
}

export interface PasoUso {
  /** Quién lo hace: el cliente final o el dueño. */
  quien: string;
  texto: string;
}

export interface Proyecto {
  /** Slug de la página del caso (/proyectos/[id]). */
  id: string;
  cliente: string;
  rubro: string;
  ciudad: string;
  tipo: TipoId;
  /** Rubro del configurador que corresponde (para "Armá tu sistema" con todo preseleccionado). */
  rubroConfigurador: string;
  /** Nombre del sistema, como se vende. */
  sistema: string;
  /** Lo que se armó, en pocas palabras (las etiquetas del índice). */
  etiquetas: readonly string[];
  estado: EstadoProyecto;
  /** Sitio publicado. Solo si está listo para mostrarse: sin URL, no hay enlace público. */
  url?: string;
  /** Qué necesitaba el negocio, en una línea. */
  desafio: string;
  /** Lo que armamos, módulo por módulo (los primeros cuatro van en la vista previa). */
  armamos: readonly string[];
  /** Qué ve el cliente o el dueño cuando lo usa, en una línea. */
  ve: string;
  /** Cómo se usa, en tres pasos. */
  uso: readonly PasoUso[];
  /** Solo si hay un dato verificable. Hoy ninguno. */
  resultado?: string;
  mockup: MockupId;
  imagenes: { mobile?: ImagenProyecto; desktop?: ImagenProyecto; admin?: ImagenProyecto };
  /** Vacío hasta tener uno real y autorizado. */
  testimonio?: Testimonio;
}

export const PROYECTOS: readonly Proyecto[] = [
  {
    id: 'micios',
    cliente: "Micio's Pizzería",
    rubro: 'Pizzería',
    ciudad: 'San Jorge',
    tipo: 'pedidos',
    rubroConfigurador: 'gastronomia',
    sistema: 'Sistema de pedidos online',
    etiquetas: ['Pedidos por internet', 'Panel para el dueño', 'Se instala en el celular'],
    estado: 'produccion',
    url: 'https://www.miciospizzas.com.ar',
    desafio: 'Pedidos desordenados en el horario pico y una cocina que no daba abasto.',
    armamos: [
      'Carrito y pedido desde el celular',
      'Franjas de 15 minutos con límite de pedidos',
      'Hora exacta de retiro',
      'Comanda impresa automática',
      'Panel del dueño: productos, precios y horarios',
      'Se instala en el celular como una aplicación',
    ],
    ve: 'El cliente arma su pedido, elige a qué hora lo retira y la cocina lo recibe ordenado.',
    uso: [
      {
        quien: 'El cliente',
        texto: 'Entra desde el celular, arma el pedido y elige la franja de retiro.',
      },
      { quien: 'La cocina', texto: 'El pedido entra al panel y la comanda sale impresa sola.' },
      { quien: 'El dueño', texto: 'Cambia precios, productos y horarios desde el panel.' },
    ],
    mockup: 'pedidos',
    imagenes: {
      mobile: {
        src: '/clientes/micios.webp',
        barra: { fondo: BARRA_CAPTURA.micios, claro: true },
        ancho: 375,
        alto: 2198,
        alt: "Sitio de Micio's Pizzería en el celular: carta con pizzas, bebidas y postres.",
      },
      desktop: {
        src: '/clientes/micios-escritorio.jpg',
        ancho: 1600,
        alto: 1000,
        alt: "Sitio de Micio's Pizzería en la computadora: portada con el buscador y las categorías del menú.",
      },
    },
  },
  {
    id: 'petrucci',
    cliente: 'Joyería Petrucci',
    rubro: 'Joyería',
    ciudad: 'San Jorge',
    tipo: 'tienda',
    rubroConfigurador: 'comercio',
    sistema: 'Tienda online con panel propio',
    etiquetas: ['Tienda por internet', 'Carga de productos', 'WhatsApp'],
    estado: 'produccion',
    url: 'https://www.joyeriapetrucci.com.ar',
    desafio: 'Mostrar todo el catálogo y que el dueño pudiera cargar productos solo.',
    armamos: [
      'Catálogo completo por categorías',
      'Panel interno para el dueño',
      'Subida de fotos de productos desde el celular',
      'Consulta por WhatsApp en cada producto',
    ],
    ve: 'El dueño carga una pieza con su foto desde el celular y ya está en la tienda.',
    uso: [
      { quien: 'El cliente', texto: 'Recorre el catálogo por categorías y elige una pieza.' },
      { quien: 'El cliente', texto: 'Consulta por WhatsApp con el producto ya elegido.' },
      { quien: 'El dueño', texto: 'Saca la foto, la sube desde el panel y la publica.' },
    ],
    mockup: 'tienda',
    imagenes: {
      mobile: {
        src: '/clientes/petrucci.webp',
        barra: { fondo: BARRA_CAPTURA.petrucci, claro: true },
        ancho: 375,
        alto: 4200,
        alt: 'Sitio de Joyería Petrucci en el celular: alianzas, categorías y novedades.',
      },
      desktop: {
        src: '/clientes/petrucci-escritorio.jpg',
        ancho: 1600,
        alto: 1000,
        alt: 'Sitio de Joyería Petrucci en la computadora: portada con las alianzas hechas en su taller.',
      },
    },
  },
  {
    id: 'lorena',
    cliente: 'Lorena Almagro · Fonoaudióloga',
    rubro: 'Salud',
    ciudad: 'San Jorge',
    tipo: 'web',
    rubroConfigurador: 'salud',
    sistema: 'Sitio web profesional',
    etiquetas: ['Página web', 'WhatsApp', 'Pedido de turno'],
    estado: 'produccion',
    url: 'https://www.fonosanjorge.com.ar',
    desafio: 'Una presencia profesional y que las familias pudieran consultar sin vueltas.',
    armamos: [
      'Página web con dirección propia (fonosanjorge.com.ar)',
      'Especialidades, talleres y obras sociales',
      'Consulta por WhatsApp con el mensaje armado',
      'Pedido de turno desde cualquier sección',
    ],
    ve: 'Las familias conocen cómo trabaja y le escriben con un toque.',
    uso: [
      { quien: 'La familia', texto: 'La busca en Google y encuentra su página.' },
      { quien: 'La familia', texto: 'Lee especialidades y obras sociales, y toca WhatsApp.' },
      { quien: 'La profesional', texto: 'Recibe la consulta con el mensaje ya armado.' },
    ],
    mockup: 'web',
    imagenes: {
      mobile: {
        src: '/clientes/fonosanjorge.webp',
        barra: { fondo: BARRA_CAPTURA.fonosanjorge, claro: false },
        ancho: 375,
        alto: 4200,
        alt: 'Sitio de Lorena Almagro en el celular: presentación de la fonoaudióloga y sus especialidades.',
      },
      desktop: {
        src: '/clientes/lorena-escritorio.jpg',
        ancho: 1600,
        alto: 1000,
        alt: 'Sitio de Lorena Almagro en la computadora: portada con la presentación y el botón de turno.',
      },
    },
  },
  {
    id: 'canina',
    cliente: 'Turnero con seña',
    rubro: 'Peluquería canina',
    ciudad: 'San Jorge',
    tipo: 'turnero',
    rubroConfigurador: 'mascotas',
    sistema: 'Armado para Peluquería Canina San Jorge',
    etiquetas: ['Turnos', 'Seña con Mercado Pago', 'Varios profesionales'],
    estado: 'producto',
    desafio: 'Turnos reservados que después nadie venía a ocupar.',
    armamos: [
      'Reserva online con seña por Mercado Pago',
      'Agenda para varios profesionales',
      'Aviso al celular de cada reserva',
      'Panel simple para ver el día',
    ],
    ve: 'El cliente elige servicio, profesional y horario, paga la seña y el turno queda asegurado.',
    uso: [
      { quien: 'El cliente', texto: 'Elige servicio, profesional, día y hora desde el celular.' },
      { quien: 'El cliente', texto: 'Paga la seña con Mercado Pago y el turno queda asegurado.' },
      { quien: 'El dueño', texto: 'Recibe el aviso al instante y ve la agenda del día.' },
    ],
    mockup: 'turnero',
    imagenes: {
      mobile: {
        src: '/proyectos/turnero-aviso.webp',
        ancho: 738,
        alto: 1600,
        completa: true,
        alt: 'Captura real del turnero en un iPhone: el turno confirmado con la seña pagada y la notificación de nueva reserva para el dueño.',
      },
    },
  },
  {
    id: 'abelardo',
    cliente: 'Abelardo Pizzería',
    rubro: 'Pizzería',
    ciudad: 'San Jorge',
    tipo: 'pedidos',
    rubroConfigurador: 'gastronomia',
    sistema: 'Pedidos con stock, promos y envío',
    etiquetas: ['Pedidos por internet', 'Control de stock', 'Envíos'],
    estado: 'construccion',
    desafio: 'Más productos, variantes y envíos, todo cerrando con el stock real.',
    armamos: ['Control de stock', 'Promos', 'Productos personalizables', 'Envío a domicilio'],
    ve: 'Promos del día, productos a su gusto y envío a domicilio, con el stock al día.',
    uso: [
      { quien: 'El cliente', texto: 'Arma su pedido con promos y opciones a su gusto.' },
      { quien: 'El cliente', texto: 'Elige retiro o envío a domicilio.' },
      { quien: 'El dueño', texto: 'Ve el stock descontarse con cada pedido.' },
    ],
    mockup: 'pedidos',
    imagenes: {
      mobile: {
        src: '/clientes/abelardo.webp',
        barra: { fondo: BARRA_CAPTURA.abelardo, claro: true },
        ancho: 375,
        alto: 2178,
        alt: 'Avance del sitio de Abelardo en el celular: promos del día y categorías.',
      },
    },
  },
];

export const ESTADO_PROYECTO: Record<EstadoProyecto, string> = {
  produccion: 'En producción',
  producto: 'Disponible para tu negocio',
  construccion: 'Próximo lanzamiento',
};

/** Los casos que se muestran (los que están en construcción todavía no). */
export const CASOS = PROYECTOS.filter((p) => p.estado !== 'construccion');

export const getProyecto = (id: string) => PROYECTOS.find((p) => p.id === id);

/** Dominio para mostrar: sin protocolo ni www. */
export const dominioDe = (url: string) => new URL(url).host.replace(/^www\./, '');

/** Testimonios reales: se muestran solo los que existen. Hoy no hay ninguno cargado. */
export const testimonios = (lista: readonly Proyecto[] = PROYECTOS) =>
  lista.flatMap((p) => (p.testimonio ? [{ ...p.testimonio, proyecto: p.cliente }] : []));

/** Barra de datos de la sección, calculada desde el manifiesto (nunca escrita a mano). */
export function datosCasos(lista: readonly Proyecto[] = CASOS) {
  const rubros = [...new Set(lista.map((p) => p.rubro.toLowerCase()))];
  const ciudades = [...new Set(lista.map((p) => p.ciudad))];
  return {
    casos: lista.length,
    enProduccion: lista.filter((p) => p.estado === 'produccion').length,
    rubros,
    ciudades,
  };
}
