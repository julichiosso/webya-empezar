/**
 * Demo para protectoras (/demos/protectora): "Refugio Ventarrón", una organización FICTICIA (se buscó que no
 * coincida con ninguna real). Animales, personas, montos y fechas son de ejemplo y la pantalla lo dice.
 * Nada se envía: los recordatorios abren WhatsApp sin destinatario. Los números van como números (no en
 * el texto) y se formatean al mostrarlos.
 */

export type Especie = 'perro' | 'gato';
export type EstadoAnimal = 'disponible' | 'transito' | 'proceso' | 'adoptado';
export type Tamano = 'chico' | 'mediano' | 'grande';

export interface Animal {
  id: string;
  nombre: string;
  especie: Especie;
  edadMeses: number;
  tamano: Tamano;
  caracter: string;
  castrado: boolean;
  vacunado: boolean;
  estado: EstadoAnimal;
  /** Tono de la ilustración (paleta de la demo). */
  tono: 'arena' | 'salvia' | 'terracota' | 'cielo';
  historia: string;
}

/** Colores de la demo para lo que se dibuja fuera del CSS (la imagen para redes). Iguales a protectora.css. */
export const COLORES_PROTECTORA = {
  fondo: '#fbf7f1',
  tinta: '#2b2420',
  tinta2: '#5f544c',
  acento: '#a84a22',
  tonos: { arena: '#ecdcc4', salvia: '#d8e4d5', terracota: '#f0d2c2', cielo: '#d6e5ee' },
} as const;

export const ORG = {
  nombre: 'Refugio Ventarrón',
  lema: 'Adoptá, apadriná, sumate.',
  ficticia: 'Organización ficticia de ejemplo',
} as const;

export const ANIMALES: readonly Animal[] = [
  {
    id: 'luna',
    nombre: 'Luna',
    especie: 'perro',
    edadMeses: 24,
    tamano: 'mediano',
    caracter: 'Tranquila y cariñosa',
    castrado: true,
    vacunado: true,
    estado: 'disponible',
    tono: 'arena',
    historia:
      'La encontraron cerca de la ruta. Hoy duerme la siesta al sol y busca una casa con patio.',
  },
  {
    id: 'toto',
    nombre: 'Toto',
    especie: 'perro',
    edadMeses: 60,
    tamano: 'grande',
    caracter: 'Guardián y compañero',
    castrado: true,
    vacunado: true,
    estado: 'transito',
    tono: 'terracota',
    historia: 'Está en un hogar de tránsito, recuperándose. Le encantan las caminatas largas.',
  },
  {
    id: 'mora',
    nombre: 'Mora',
    especie: 'gato',
    edadMeses: 8,
    tamano: 'chico',
    caracter: 'Curiosa y juguetona',
    castrado: true,
    vacunado: true,
    estado: 'disponible',
    tono: 'salvia',
    historia: 'Llegó con sus hermanos. Es la primera en saludar cuando se abre la puerta.',
  },
  {
    id: 'pancho',
    nombre: 'Pancho',
    especie: 'perro',
    edadMeses: 4,
    tamano: 'chico',
    caracter: 'Cachorro, puro juego',
    castrado: false,
    vacunado: true,
    estado: 'disponible',
    tono: 'cielo',
    historia: 'Todavía aprende a caminar con correa. Se lleva bien con otros perros.',
  },
  {
    id: 'nina',
    nombre: 'Nina',
    especie: 'gato',
    edadMeses: 36,
    tamano: 'chico',
    caracter: 'Independiente y mimosa',
    castrado: true,
    vacunado: true,
    estado: 'proceso',
    tono: 'arena',
    historia: 'Ya tiene una familia en entrevista. Le gusta mirar por la ventana.',
  },
  {
    id: 'rulo',
    nombre: 'Rulo',
    especie: 'perro',
    edadMeses: 84,
    tamano: 'mediano',
    caracter: 'Sereno, ideal para departamento',
    castrado: true,
    vacunado: true,
    estado: 'adoptado',
    tono: 'salvia',
    historia: 'Encontró su casa este mes. Ahora duerme en un sillón que es solo suyo.',
  },
];

export const ESTADOS: Record<EstadoAnimal, string> = {
  disponible: 'Disponible',
  transito: 'En tránsito',
  proceso: 'En proceso',
  adoptado: 'Adoptado',
};

export const TAMANOS: Record<Tamano, string> = {
  chico: 'Chico',
  mediano: 'Mediano',
  grande: 'Grande',
};
export const ESPECIES: Record<Especie, string> = { perro: 'Perros', gato: 'Gatos' };

export const CUOTAS = [
  { id: 'amigo', nombre: 'Amigo', monto: 3000 },
  { id: 'padrino', nombre: 'Padrino', monto: 6000 },
  { id: 'protector', nombre: 'Protector', monto: 12000 },
] as const;

export const CAMPANA = {
  titulo: 'La cirugía de Toto',
  texto: 'Toto necesita una operación de cadera. Cada aporte suma a la barra.',
  meta: 400000,
  juntado: 262000,
  montos: [2000, 5000, 10000],
} as const;

export const ESPECIE_NECESARIA = ['Alimento balanceado', 'Mantas', 'Piedras sanitarias'] as const;

/** Actividades con cupo: días desde hoy, hora y lugares. */
export const ACTIVIDADES = [
  { id: 'paseos', nombre: 'Paseos', dias: 2, hora: 10, cupo: 4, anotados: 2 },
  { id: 'limpieza', nombre: 'Limpieza de caniles', dias: 3, hora: 9, cupo: 3, anotados: 3 },
  { id: 'castracion', nombre: 'Jornada de castración', dias: 6, hora: 8, cupo: 12, anotados: 7 },
  { id: 'feria', nombre: 'Feria de adopción', dias: 9, hora: 16, cupo: 6, anotados: 1 },
] as const;

export interface Socio {
  id: string;
  nombre: string;
  cuota: (typeof CUOTAS)[number]['id'];
  /** Meses sin pagar (cero: al día). */
  debe: number;
}

export const SOCIOS: readonly Socio[] = [
  { id: 'marta', nombre: 'Marta G.', cuota: 'padrino', debe: 0 },
  { id: 'jorge', nombre: 'Jorge P.', cuota: 'amigo', debe: 2 },
  { id: 'sofia', nombre: 'Sofía R.', cuota: 'protector', debe: 0 },
  { id: 'hector', nombre: 'Héctor L.', cuota: 'amigo', debe: 1 },
  { id: 'carla', nombre: 'Carla M.', cuota: 'amigo', debe: 0 },
];

/** Rendición de cuentas del mes (de ejemplo). */
export const CUENTAS = {
  ingresos: [
    { nombre: 'Cuotas de socios', monto: 168000 },
    { nombre: 'Donaciones', monto: 94000 },
    { nombre: 'Venta solidaria', monto: 41000 },
  ],
  gastos: [
    { nombre: 'Veterinaria', monto: 142000 },
    { nombre: 'Alimento', monto: 98000 },
    { nombre: 'Castraciones', monto: 36000 },
  ],
} as const;

export const SOLICITUDES_INICIALES = [
  { id: 'sol-nina', animal: 'nina', persona: 'Laura B.', estado: 'entrevista' as const },
];

export const ESTADOS_SOLICITUD = {
  recibida: 'Recibida',
  entrevista: 'Entrevista',
  aprobada: 'Aprobada',
  adoptado: 'Adoptado',
} as const;

export const UI_PROTECTORA = {
  titulo: 'Demo para protectoras',
  descripcion:
    'Probá el sistema de una protectora ficticia: adoptar, hacerse socio, donar y anotarse como voluntario; y del otro lado, cómo lo gestiona el equipo.',
  vistas: { publica: 'Vista pública', admin: 'Vista administración', etiqueta: 'Qué ver' },
  aviso: 'Demostración con datos ficticios. No se envía nada.',
  secciones: {
    adoptar: 'Adoptar',
    socios: 'Hacete socio',
    donar: 'Donar',
    sumate: 'Sumate',
  },
  filtros: { todos: 'Todos', etiqueta: 'Filtrar por especie' },
  ficha: {
    edad: (meses: number) =>
      meses < 12
        ? `${meses} ${meses === 1 ? 'mes' : 'meses'}`
        : `${Math.floor(meses / 12)} ${meses < 24 ? 'año' : 'años'}`,
    castrado: 'Castrado',
    vacunado: 'Vacunas al día',
    quiero: 'Quiero adoptar',
    compartir: 'Compartir ficha',
    volver: 'Volver a la vitrina',
  },
  solicitud: {
    titulo: (nombre: string) => `Solicitud para adoptar a ${nombre}`,
    nombre: 'Tu nombre',
    telefono: 'Tu celular',
    vivienda: '¿Dónde vivís?',
    viviendas: ['Casa con patio', 'Casa sin patio', 'Departamento'],
    consentimiento:
      'Acepto que el refugio use estos datos solo para evaluar la adopción. Puedo pedir que los borren cuando quiera.',
    enviar: 'Enviar solicitud',
    faltaNombre: 'Escribí tu nombre.',
    faltaTelefono: 'Escribí un celular para que te contacten.',
    faltaConsentimiento: 'Para enviar, aceptá el uso de tus datos.',
    listo: '¡Solicitud enviada!',
    queSigue:
      'El equipo la revisa y te escribe para coordinar una entrevista. Mientras, podés seguir mirando la vitrina.',
  },
  socio: {
    titulo: 'Hacete socio',
    texto: 'Tu cuota mensual sostiene el refugio todo el año.',
    montoEjemplo: 'Montos de ejemplo: los define cada organización.',
    nombre: 'Tu nombre',
    pagar: 'Pagar la primera cuota',
    pagando: 'Procesando el pago…',
    carnet: 'Carnet de socio',
    numero: (n: number) => `Socio n.º ${n}`,
    alDia: 'Al día',
    otro: 'Volver',
  },
  donar: {
    titulo: 'Campaña',
    de: (juntado: string, meta: string) => `${juntado} de ${meta}`,
    elegir: 'Elegí un monto',
    donar: 'Donar',
    gracias: 'Gracias. Tu aporte ya suma.',
    especie: 'También se necesita',
  },
  sumate: {
    titulo: 'Voluntariado y jornadas',
    texto: 'Elegí una actividad con lugar y anotate.',
    lugares: (n: number) => (n === 1 ? 'Queda un lugar' : `Quedan ${n} lugares`),
    lleno: 'Completo',
    anotarme: 'Anotarme',
    anotado: 'Anotado',
  },
  admin: {
    solicitudes: 'Solicitudes',
    cargar: 'Cargar animal',
    socios: 'Socios',
    cuentas: 'Cuentas',
    vacio: 'No hay solicitudes nuevas. Cuando alguien quiera adoptar, aparece acá.',
    avanzar: 'Pasar a',
    push: { app: 'Refugio Ventarrón', titulo: 'Nueva solicitud de adopción', cuando: 'ahora' },
    pushTexto: (persona: string, animal: string) => `${persona} quiere adoptar a ${animal}`,
    nuevo: {
      titulo: 'Nuevo animal',
      foto: 'Sacar foto',
      fotoLista: 'Foto lista',
      nombre: 'Nombre',
      especie: 'Especie',
      tamano: 'Tamaño',
      caracter: 'Cómo es',
      caracterEjemplo: 'Ej.: compañero y tranquilo',
      caracterPorDefecto: 'Recién llegado',
      historia: 'Recién llegado al refugio. Pronto contamos su historia.',
      publicar: 'Publicar en la vitrina',
      publicado: (nombre: string) => `${nombre} ya está en la vitrina pública.`,
      faltan: 'Completá el nombre y sacale una foto.',
    },
    alDia: 'Al día',
    debe: (meses: number) => (meses === 1 ? 'Debe un mes' : `Debe ${meses} meses`),
    recordar: 'Recordar por WhatsApp',
    recordado: 'Recordatorio listo',
    recordatorio: (nombre: string) =>
      `Hola ${nombre}, te escribimos del Refugio Ventarrón. Te recordamos la cuota de socio de este mes. ¡Gracias por sostener el refugio!`,
    ingresos: 'Ingresos',
    gastos: 'Gastos',
    saldo: 'Saldo del mes',
    cuentasNota: 'Lo carga la organización y se publica para socios y donantes.',
  },
  compartir: {
    titulo: 'Imagen para redes',
    texto: 'Lista para Instagram y WhatsApp.',
    descargar: 'Descargar imagen',
    cerrar: 'Cerrar',
    busca: 'Busca familia',
  },
  final: {
    titulo: '¿Querés esto para tu organización?',
    quiero: 'Quiero este sistema',
    escribinos: 'Escribinos',
    mensaje:
      'Hola, vengo de webya.dev. Probé la demo para protectoras y quiero algo así para nuestra organización.',
  },
} as const;
