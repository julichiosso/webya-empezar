/**
 * Demo "Creá tu tienda en vivo" (/demos/tienda): rubros con productos de ejemplo (nombre, precio en
 * pesos enteros y una foto de prueba dibujada), colores y los textos del armado y de la tienda.
 * Es una vista previa en el navegador: no se crea ninguna tienda ni se guarda nada.
 */

export type FotoId =
  | 'remera'
  | 'buzo'
  | 'zapatilla'
  | 'anillo'
  | 'collar'
  | 'aros'
  | 'taza'
  | 'vela'
  | 'regalo'
  | 'frasco'
  | 'cafe'
  | 'botella';

export interface ProductoEjemplo {
  nombre: string;
  /** Pesos enteros. */
  precio: number;
  foto: FotoId;
}

export interface RubroTienda {
  id: string;
  nombre: string;
  /** Nombre de ejemplo que se propone (se puede cambiar). */
  ejemplo: string;
  lema: string;
  categorias: readonly string[];
  productos: readonly ProductoEjemplo[];
  /** Fotos de prueba que ofrece el rubro. */
  fotos: readonly FotoId[];
}

export const RUBROS_TIENDA: readonly RubroTienda[] = [
  {
    id: 'ropa',
    nombre: 'Ropa y calzado',
    ejemplo: 'Tienda Aurora',
    lema: 'Lo nuevo de la temporada',
    categorias: ['Remeras', 'Buzos', 'Calzado'],
    productos: [
      { nombre: 'Remera de algodón', precio: 18000, foto: 'remera' },
      { nombre: 'Buzo con capucha', precio: 42000, foto: 'buzo' },
      { nombre: 'Zapatillas urbanas', precio: 65000, foto: 'zapatilla' },
    ],
    fotos: ['remera', 'buzo', 'zapatilla', 'regalo'],
  },
  {
    id: 'joyeria',
    nombre: 'Joyería y accesorios',
    ejemplo: 'Joyas Lumen',
    lema: 'Piezas para regalar y regalarte',
    categorias: ['Anillos', 'Collares', 'Aros'],
    productos: [
      { nombre: 'Anillo de plata', precio: 35000, foto: 'anillo' },
      { nombre: 'Collar con dije', precio: 28000, foto: 'collar' },
      { nombre: 'Aros argolla', precio: 19000, foto: 'aros' },
    ],
    fotos: ['anillo', 'collar', 'aros', 'regalo'],
  },
  {
    id: 'regaleria',
    nombre: 'Regalería y deco',
    ejemplo: 'Casa Nido',
    lema: 'Detalles para tu casa',
    categorias: ['Tazas', 'Velas', 'Regalos'],
    productos: [
      { nombre: 'Taza de cerámica', precio: 12000, foto: 'taza' },
      { nombre: 'Vela aromática', precio: 9500, foto: 'vela' },
      { nombre: 'Caja de regalo', precio: 24000, foto: 'regalo' },
    ],
    fotos: ['taza', 'vela', 'regalo', 'frasco'],
  },
  {
    id: 'almacen',
    nombre: 'Almacén y dietética',
    ejemplo: 'Almacén del Centro',
    lema: 'Productos de la zona, a un mensaje',
    categorias: ['Despensa', 'Infusiones', 'Aceites'],
    productos: [
      { nombre: 'Miel pura', precio: 7500, foto: 'frasco' },
      { nombre: 'Café de especialidad', precio: 14000, foto: 'cafe' },
      { nombre: 'Aceite de oliva', precio: 16500, foto: 'botella' },
    ],
    fotos: ['frasco', 'cafe', 'botella', 'regalo'],
  },
];

export const COLORES_TIENDA: readonly { id: string; nombre: string; valor: string }[] = [
  { id: 'negro', nombre: 'Negro', valor: '#111111' },
  { id: 'azul', nombre: 'Azul', valor: '#1f3a8a' },
  { id: 'bordo', nombre: 'Bordó', valor: '#7a2848' },
  { id: 'verde', nombre: 'Verde', valor: '#1f5a43' },
  { id: 'terracota', nombre: 'Terracota', valor: '#a8471f' },
  { id: 'violeta', nombre: 'Violeta', valor: '#4e3a8f' },
];

/** Hasta cuántos productos se cargan en la vista previa. */
export const MAX_PRODUCTOS = 3;

export const DEMO_TIENDA_UI = {
  titulo: 'Creá tu tienda en vivo',
  descripcion:
    'Elegí tu rubro, poné el nombre y tus colores, cargá productos y mirá tu tienda armada al instante, en el celular y en la computadora.',
  pasos: {
    aria: 'Armá tu tienda',
    rubro: 'Tu rubro',
    negocio: 'Tu negocio',
    productos: 'Tus productos',
  },
  nombre: 'Nombre del negocio',
  color: 'Color',
  colorAria: (nombre: string) => `Color ${nombre}`,
  logo: 'Logo (opcional)',
  subirLogo: 'Subir logo',
  quitarLogo: 'Quitar logo',
  producto: {
    nombre: 'Nombre',
    precio: 'Precio',
    foto: 'Foto de prueba',
    fotoAria: (foto: string) => `Usar la foto de prueba: ${foto}`,
    subirFoto: 'Subir foto',
    quitar: 'Quitar producto',
    agregar: 'Agregar producto',
    numero: (n: number) => `Producto ${n}`,
  },
  fotos: {
    remera: 'remera',
    buzo: 'buzo',
    zapatilla: 'zapatilla',
    anillo: 'anillo',
    collar: 'collar',
    aros: 'aros',
    taza: 'taza',
    vela: 'vela',
    regalo: 'caja de regalo',
    frasco: 'frasco',
    cafe: 'paquete de café',
    botella: 'botella',
  } satisfies Record<FotoId, string>,
  privado: 'Las fotos que subas quedan en tu navegador: no se envían a ningún lado.',
  vista: 'Ver en',
  celular: 'Celular',
  computadora: 'Computadora',
  ladoTienda: 'Así la ven tus clientes',
  previa:
    'Vista previa con tus datos. La tienda real la armamos con vos: tu catálogo completo, pagos y un panel para cargar productos.',
  cta: 'Quiero esta tienda',
  ctaAria: 'Quiero esta tienda: enviar el resumen por WhatsApp, se abre en otra pestaña',
  movil: { aria: 'Armar o ver la tienda', armar: 'Armar', ver: 'Ver tienda' },
  tienda: {
    todos: 'Todo',
    agregar: 'Agregar',
    verProducto: 'Ver producto',
    agregarCarrito: 'Agregar al carrito',
    consultar: 'Consultar por WhatsApp',
    carrito: 'Carrito',
    carritoAria: (n: number) => `Carrito, ${n} productos`,
    vacio: 'Tu carrito está vacío.',
    total: 'Total',
    enviar: 'Enviar pedido por WhatsApp',
    volver: 'Volver',
    destacados: 'Destacados',
    envios: 'Envíos a toda la zona · Retiro en el local',
    pie: (nombre: string) => `${nombre} · Tienda de ejemplo`,
    aviso:
      'En tu tienda, esto abre WhatsApp con el pedido escrito (o el pago con Mercado Pago, si lo activás).',
    cerrarAviso: 'Entendido',
    sinNombre: 'Tu tienda',
  },
} as const;

const precioTexto = (n: number) => `$${n.toLocaleString('es-AR')}`;

/** El resumen que encuentra escrito al abrir WhatsApp con "Quiero esta tienda". */
export function mensajeTienda(d: {
  nombre: string;
  rubro: string;
  color: string;
  productos: readonly { nombre: string; precio: number }[];
}): string {
  const lista = d.productos
    .filter((p) => p.nombre.trim())
    .map((p) => `- ${p.nombre.trim().slice(0, 60)}: ${precioTexto(p.precio)}`);
  return [
    'Hola, vengo de webya.dev. Armé la vista previa de mi tienda y la quiero.',
    `Negocio: ${d.nombre.trim().slice(0, 60) || 'sin nombre todavía'} (${d.rubro}).`,
    `Color: ${d.color}.`,
    lista.length ? `Productos de ejemplo:\n${lista.join('\n')}` : '',
    '¿Me cuentan cómo seguimos?',
  ]
    .filter(Boolean)
    .join('\n');
}

/** Lo que armó la persona, en líneas cortas (resumen de "Enviarnos lo que armé"). */
export function resumenTienda(d: {
  nombre: string;
  rubro: string;
  color: string;
  productos: readonly { nombre: string }[];
}): string[] {
  const productos = d.productos.map((p) => p.nombre.trim()).filter(Boolean);
  return [
    `Negocio: ${d.nombre.trim() || 'sin nombre todavía'} (${d.rubro})`,
    `Color: ${d.color}`,
    productos.length ? `Productos: ${productos.join(', ')}` : '',
  ].filter(Boolean);
}
