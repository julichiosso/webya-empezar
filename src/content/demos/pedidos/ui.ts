/**
 * Textos de la demo del sistema de pedidos (/demo/pedidos): la app del cliente, el panel del local y la
 * comanda. Es el producto, sin nombre de cliente (el caso real se muestra aparte). No se envía nada.
 */

export const pesos = (n: number) =>
  n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export const PAGINA_PEDIDOS = {
  titulo: 'Demo del sistema de pedidos para pizzerías',
  descripcion:
    'Probá el sistema de pedidos para pizzerías: pedí desde el celular, elegí la franja de retiro y mirá cómo entra el pedido al panel del local.',
  og: {
    sitio: 'Webya',
    titulo: (t: string) => `${t} · Webya`,
  },
} as const;

export const BARRA_DEMO = {
  titulo: 'Demo del sistema de pedidos',
} as const;

export const GUIA = {
  aria: 'Cómo probar la demo',
  pasos: [
    { titulo: 'Pedí desde el celular', texto: 'Elegí una pizza, el horario de retiro y confirmá.' },
    { titulo: 'Mirá cómo llega', texto: 'El pedido entra en su franja del panel, al instante.' },
    { titulo: 'Imprimí la comanda', texto: 'Tocá «Ver comanda» en el pedido nuevo.' },
  ],
  hecho: 'Hecho',
} as const;

/** Rótulos de escritorio sobre cada lado de la demo. */
export const LADOS = {
  cliente: 'Así lo ve tu cliente',
  panel: 'Así lo manejás vos',
} as const;

export const VISTAS = {
  aria: 'Qué pantalla ver',
  cliente: 'Cliente',
  duenio: 'Dueño',
  novedad: 'Entró un pedido nuevo',
} as const;

export const APP = {
  marca: 'TU PIZZERÍA',
  carritoAria: (n: number | string) => `Ver el carrito: ${n} productos`,
  takeAway: 'Take away',
  titulo: ['Pedí tu pizza', 'y retirala sin esperar.'],
  abierto: (hora: string) => `Abierto · retirás desde las ${hora}`,
  cerrado: 'Cerrado por ahora',
  sinCupo: 'Sin cupos de retiro por hoy',
  elegi: 'Elegí qué pedir',
  verMenu: 'Ver el menú',
  destacadas: 'Destacadas',
  cantidadProductos: (n: number | string) => `${n} productos`,
  agregar: 'Agregar',
  desde: (precio: string) => `Desde ${precio}`,
  volver: 'Volver',
  tamanio: 'Elegí el tamaño',
  otraMitad: 'Elegí la otra mitad',
  agregarPrecio: (precio: string) => `Agregar al carrito · ${precio}`,
  agregado: 'Agregado al carrito',
  conMitad: (otra: string) => `Mitad y mitad con ${otra}`,
  verPedido: (n: number | string, total: string) => `Ver mi pedido (${n}) · ${total}`,
  inicioAria: 'Ir al inicio',
  avisoEjemplo: 'Carta, precios y pedidos de ejemplo.',
} as const;

export const CARRITO = {
  titulo: 'Tu pedido',
  vacio: 'Todavía no agregaste nada.',
  verCarta: 'Ver la carta',
  quitar: (nombre: string) => `Quitar uno de ${nombre}`,
  sumar: (nombre: string) => `Sumar uno de ${nombre}`,
  retiro: 'Retiro en el local',
  asap: 'Lo antes posible',
  elegir: 'Elegir horario',
  demora: (min: number | string, hora: string) =>
    `Demora estimada: ~${min} min. Retiro a partir de las ${hora} hs.`,
  salto: 'Las franjas de antes están completas: te toca la siguiente con lugar.',
  franjaHora: (hora: string) => `${hora} hs`,
  elegiFranja: 'Elegí una franja',
  datos: 'Tus datos',
  nombre: 'Nombre',
  apellido: 'Apellido',
  falta: 'Completá nombre y apellido.',
  total: 'Total',
  confirmar: 'Confirmar por WhatsApp',
  localCerrado: 'El local está cerrado',
} as const;

export const ENVIADO = {
  titulo: 'Así le llega el pedido al local',
  texto: 'En el sistema real se abre WhatsApp con este mensaje. Acá no se envía nada.',
  enviar: 'Enviar (simulado)',
  listo: '¡Pedido enviado!',
  listoTexto: 'Ya está en el panel del dueño, en su franja.',
  verPanel: 'Ver el panel del dueño',
  seguir: 'Seguir mirando',
  cta: '¿Lo querés para tu negocio?',
} as const;

/** El mensaje que arma el sistema para WhatsApp (mismo formato que el real). */
export function mensajeWhatsapp(d: {
  nombre: string;
  lineas: readonly string[];
  total: string;
  retiro: string;
}) {
  return [
    `Hola, soy ${d.nombre}. Quiero hacer este pedido:`,
    ...d.lineas.map((l) => `• ${l}`),
    `Total: ${d.total}`,
    `Retiro: ${d.retiro}`,
  ].join('\n');
}

export const lineaItem = (cantidad: number | string, nombre: string, tamanio: string) =>
  `${cantidad}x ${nombre} (${tamanio})`;

export const PANEL = {
  marca: 'Panel del local',
  turnos: 'Turnos',
  productos: 'Productos',
  pestanasAria: 'Secciones del panel',
  hoy: (dia: string, hora: string) => `${dia} · ${hora} hs`,
  localAbierto: 'Local abierto',
  abierto: 'Abierto',
  cerrado: 'Cerrado',
  horario: (a: string, b: string) => `Horario ${a} a ${b}`,
  capacidad: 'Pedidos por franja',
  rango: (a: string, b: string) => `${a} – ${b}`,
  ocupacion: (n: number | string, c: number | string) => `${n}/${c} pedidos`,
  estados: {
    pasado: 'Horario pasado',
    pausado: 'Pausado',
    lleno: 'Lleno',
    casi: 'Casi lleno',
    libre: 'Con lugar',
  },
  pausar: 'Pausar',
  habilitar: 'Habilitar',
  menos: (rango: string) => `Bajar el cupo de ${rango}`,
  mas: (rango: string) => `Subir el cupo de ${rango}`,
  verPedidos: (n: number | string) => `Ver pedidos (${n})`,
  ocultarPedidos: 'Ocultar pedidos',
  nuevo: 'Nuevo',
  numero: (id: number | string) => `#${id}`,
  estadoPedido: { pendiente: 'Pendiente', confirmado: 'Confirmado' },
  verComanda: 'Ver comanda',
  confirmar: 'Confirmar',
  avisoProductos: 'Lo que cambiás acá se ve al instante en el celular del cliente.',
  visible: (nombre: string) => `Mostrar ${nombre} en la carta`,
  destacado: (nombre: string) => `Destacar ${nombre} en el inicio`,
  oculto: 'Oculto',
} as const;

export const COMANDA = {
  marca: 'TU PIZZERÍA',
  titulo: (id: number | string) => `Comanda #${id}`,
  cliente: 'Cliente',
  retira: 'Retira',
  total: 'Total',
  imprimir: 'Imprimir comanda',
  cerrar: 'Cerrar',
  aria: 'Comanda del pedido',
} as const;
