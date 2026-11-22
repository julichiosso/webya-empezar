/**
 * Protectoras de animales y entidades sin fines de lucro (/protectoras). Rubro nuevo sobre el tipo de
 * sistema "a medida". Tono: humano y respetuoso; la emoción viene de las historias y los finales felices,
 * nunca de la urgencia ni del sufrimiento. Sin cifras, testimonios ni promesas que no existan.
 *
 * Cada módulo dice si es **base lista** (se arma sobre piezas que ya funcionan en negocios de la zona:
 * catálogo con fotos desde el celular, turnos con cupo, tienda, cobro con Mercado Pago, aviso al celular,
 * respuestas por WhatsApp, panel) o **a medida** (se construye para la organización).
 */

export type EstadoModulo = 'base' | 'medida';

export interface ModuloProtectora {
  id: string;
  nombre: string;
  texto: string;
  estado: EstadoModulo;
}

export const MODULOS_PROTECTORA: readonly ModuloProtectora[] = [
  {
    id: 'vitrina',
    nombre: 'Vitrina de adopción',
    texto: 'Fichas con foto y "Quiero adoptar". Se comparten en Instagram.',
    estado: 'base',
  },
  {
    id: 'adopcion',
    nombre: 'Adopciones en orden',
    texto: 'Solicitud corta, estados y turno de entrevista.',
    estado: 'base',
  },
  {
    id: 'panel',
    nombre: 'Panel para voluntarios',
    texto: 'Foto, cinco datos y publicar. Desde el celular.',
    estado: 'base',
  },
  {
    id: 'voluntariado',
    nombre: 'Voluntariado con cupos',
    texto: 'Paseos y ferias, con horarios y cupo.',
    estado: 'base',
  },
  {
    id: 'castraciones',
    nombre: 'Castraciones y jornadas',
    texto: 'Turnos con cupo para operativos.',
    estado: 'base',
  },
  {
    id: 'venta',
    nombre: 'Venta solidaria',
    texto: 'Remeras, rifas y ferias, online.',
    estado: 'base',
  },
  {
    id: 'bot',
    nombre: 'Respuestas por WhatsApp',
    texto: 'Las preguntas de siempre, respondidas solas.',
    estado: 'base',
  },
  {
    id: 'perdidos',
    nombre: 'Perdidos y encontrados',
    texto: 'Foto y contacto, sin depender de un grupo.',
    estado: 'base',
  },
  {
    id: 'socios',
    nombre: 'Socios y cuotas',
    texto: 'Alta online, carnet digital y quién está al día.',
    estado: 'medida',
  },
  {
    id: 'donaciones',
    nombre: 'Donaciones y campañas',
    texto: 'Única o mensual, y campañas con su avance.',
    estado: 'medida',
  },
  {
    id: 'apadrinar',
    nombre: 'Apadrinamiento',
    texto: 'Un aporte periódico para un animal.',
    estado: 'medida',
  },
  {
    id: 'transito',
    nombre: 'Hogares de tránsito',
    texto: 'Quién tiene a quién y cuánto lugar queda.',
    estado: 'medida',
  },
  {
    id: 'cuentas',
    nombre: 'Rendición de cuentas',
    texto: 'En qué se usa cada aporte, a la vista.',
    estado: 'medida',
  },
];

export const PROTECTORAS = {
  ruta: '/protectoras',
  demo: '/demos/protectora',
  armar: '/armar?tipo=medida&rubro=entidades&modulos=adopciones,socios,donaciones,voluntarios',
  seo: {
    titulo: 'Sistema para protectoras de animales y entidades en San Jorge y zona',
    descripcion:
      'Adopciones ordenadas, socios y cuotas, donaciones y voluntariado, desde el celular. Para protectoras, refugios, clubes, cooperadoras y asociaciones de San Jorge, San Francisco y la zona.',
    servicio:
      'Sistema para protectoras de animales y entidades sin fines de lucro: vitrina de adopción, solicitudes con turno, socios y cuotas, donaciones, voluntariado y panel para voluntarios.',
  },
  hero: {
    rotulo: 'Protectoras y entidades',
    titulo: ['Cada animal,', 'con su final feliz.'],
    bajada: 'Adopciones, socios y donaciones. En un solo lugar.',
    telefonoAlt:
      'El sistema de una protectora en el celular: la vitrina de adopción con la ficha de un perro y el botón Quiero adoptar.',
  },
  problema: {
    rotulo: 'Hoy',
    titulo: 'Lo que hoy se pierde.',
    escenas: [
      {
        titulo: 'El mensaje sin responder.',
        texto: 'Alguien quería adoptar y quedó abajo.',
      },
      {
        titulo: 'La cuota en el cuaderno.',
        texto: 'Quién pagó y quién debe.',
      },
      {
        titulo: 'La foto que se perdió.',
        texto: 'Enterrada en un grupo de WhatsApp.',
      },
    ],
  },
  pasos: {
    rotulo: 'Una adopción',
    titulo: 'De la ficha al final feliz.',
    etiqueta: 'Una adopción en el celular: la ficha, la solicitud, la entrevista y el final feliz.',
    lista: [
      {
        rotulo: 'La ficha',
        titulo: 'Cada animal, con su ficha.',
        texto: 'Foto, edad y carácter. Lista para compartir.',
      },
      {
        rotulo: 'La solicitud',
        titulo: '"Quiero adoptar", con un formulario corto.',
        texto: 'Al equipo le llega el aviso.',
      },
      {
        rotulo: 'La entrevista',
        titulo: 'Entrevista con turno.',
        texto: 'Elige un horario con lugar.',
      },
      {
        rotulo: 'Adoptado',
        titulo: 'El final feliz, a la vista.',
        texto: 'La ficha pasa a adoptado.',
      },
    ],
  },
  modulos: {
    rotulo: 'Qué incluye',
    titulo: 'Solo lo que necesitás.',
    nota: 'Base lista: ya funciona en la zona. A medida: lo construimos para vos.',
    etiquetas: { base: 'Base lista', medida: 'A medida' } satisfies Record<EstadoModulo, string>,
  },
  paraQuien: {
    rotulo: 'Para quién',
    titulo: 'Para quienes se sostienen con su gente.',
    lista: [
      'Protectoras y refugios',
      'Fundaciones y asociaciones civiles',
      'Clubes',
      'Cooperadoras escolares',
      'Bomberos voluntarios',
      'Asociaciones vecinales y mutuales',
    ],
    nota: 'El mismo sistema sirve para clubes y entidades.',
  },
  como: {
    rotulo: 'Cómo trabajamos',
    titulo: 'Tres pasos.',
    pasos: [
      { titulo: 'Nos cuentan cómo trabajan.', texto: 'En persona o por WhatsApp.' },
      {
        titulo: 'Lo armamos con su identidad.',
        texto: 'Su nombre y sus colores.',
      },
      {
        titulo: 'Les enseñamos a usarlo.',
        texto: 'Y seguimos cerca.',
      },
    ],
  },
  datos: {
    titulo: 'Los datos de las personas, cuidados.',
    texto: 'Lo público muestra animales, nunca datos de personas.',
  },
  condiciones: {
    titulo: 'Condiciones para organizaciones.',
    texto: 'Escribinos: armamos una propuesta acorde.',
  },
  /** Las pantallas del celular en la landing (con datos de la demo ficticia). */
  pantallas: {
    horario: 'Elegí un horario para la entrevista',
    confirmar: 'Confirmar turno',
    final: 'Final feliz',
    demo: 'Datos de ejemplo',
  },
  mensaje:
    'Hola, vengo de webya.dev. Tenemos una protectora / entidad y queremos ver cómo sería un sistema para nosotros.',
} as const;
