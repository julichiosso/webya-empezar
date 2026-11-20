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
    texto:
      'Fichas con foto, edad, tamaño, carácter y salud. Filtros simples y el botón "Quiero adoptar". Cada ficha se comparte como imagen para Instagram y WhatsApp.',
    estado: 'base',
  },
  {
    id: 'adopcion',
    nombre: 'Adopciones en orden',
    texto:
      'Solicitud corta con consentimiento, estados (recibida, entrevista, aprobada, adoptado) y turno de entrevista con cupo.',
    estado: 'base',
  },
  {
    id: 'panel',
    nombre: 'Panel para voluntarios',
    texto:
      'Cargar un animal desde el celular: foto, cinco datos y publicar. Botones grandes, pocas pantallas, sin palabras técnicas.',
    estado: 'base',
  },
  {
    id: 'voluntariado',
    nombre: 'Voluntariado con cupos',
    texto: 'Paseos, limpieza y ferias: cada uno se anota en el horario que tiene lugar.',
    estado: 'base',
  },
  {
    id: 'castraciones',
    nombre: 'Castraciones y jornadas',
    texto: 'Turnos con cupo para operativos y campañas, con recordatorio.',
    estado: 'base',
  },
  {
    id: 'venta',
    nombre: 'Venta solidaria',
    texto: 'Una tienda para remeras, calendarios, rifas y ferias, con consulta por WhatsApp.',
    estado: 'base',
  },
  {
    id: 'bot',
    nombre: 'Respuestas por WhatsApp',
    texto:
      'Cómo adoptar, cómo hacerse socio, dónde donar: las preguntas de siempre, respondidas solas.',
    estado: 'base',
  },
  {
    id: 'perdidos',
    nombre: 'Perdidos y encontrados',
    texto:
      'Una publicación simple con foto y contacto, para que la búsqueda no dependa de un grupo.',
    estado: 'base',
  },
  {
    id: 'socios',
    nombre: 'Socios y cuotas',
    texto:
      'Alta online, carnet digital, registro de pagos y un tablero de quién está al día. El recordatorio sale por WhatsApp con un toque. El débito automático se integra a medida.',
    estado: 'medida',
  },
  {
    id: 'donaciones',
    nombre: 'Donaciones y campañas',
    texto:
      'Donación única o mensual, campañas con barra de avance y lo que se necesita en especie. Los montos los define la organización.',
    estado: 'medida',
  },
  {
    id: 'apadrinar',
    nombre: 'Apadrinamiento',
    texto: 'Apadrinar a un animal o un canil con un aporte periódico.',
    estado: 'medida',
  },
  {
    id: 'transito',
    nombre: 'Hogares de tránsito',
    texto:
      'Quién tiene a quién, cuánto lugar queda y el historial de cada animal. Solo para el equipo.',
    estado: 'medida',
  },
  {
    id: 'cuentas',
    nombre: 'Rendición de cuentas',
    texto:
      'Ingresos y gastos por categoría, cargados por la organización, para que socios y donantes vean en qué se usa cada aporte.',
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
    titulo: ['Cada animal tiene su historia.', 'Que no se pierda entre mensajes.'],
    bajada:
      'Adopciones, socios, donaciones y voluntarios en un sistema simple, con la identidad de tu organización. Para que el tiempo vaya a los animales y no a contestar mensajes.',
    telefonoAlt:
      'El sistema de una protectora en el celular: la vitrina de adopción con la ficha de un perro y el botón Quiero adoptar.',
  },
  problema: {
    rotulo: 'Hoy',
    titulo: 'Lo que se pierde entre un mensaje y otro.',
    escenas: [
      {
        titulo: 'El mensaje sin responder.',
        texto: 'Alguien quería adoptar y escribió a la noche. Entre tantos mensajes, quedó abajo.',
      },
      {
        titulo: 'La cuota en el cuaderno.',
        texto: 'Quién pagó, quién debe y desde cuándo. Siempre hay que preguntar dos veces.',
      },
      {
        titulo: 'La foto que se perdió.',
        texto: 'La foto del perro que buscaba casa quedó enterrada en un grupo de WhatsApp.',
      },
    ],
  },
  pasos: {
    rotulo: 'Una adopción',
    titulo: 'De la ficha al final feliz, en orden.',
    etiqueta: 'Una adopción en el celular: la ficha, la solicitud, la entrevista y el final feliz.',
    lista: [
      {
        rotulo: 'La ficha',
        titulo: 'Cada animal, con su ficha.',
        texto:
          'Foto, nombre, edad, tamaño, carácter y salud. Se comparte como imagen lista para Instagram y WhatsApp.',
      },
      {
        rotulo: 'La solicitud',
        titulo: '"Quiero adoptar", con un formulario corto.',
        texto:
          'La persona deja sus datos con su consentimiento. Al equipo le llega el aviso al celular.',
      },
      {
        rotulo: 'La entrevista',
        titulo: 'Entrevista con turno.',
        texto: 'Elige un horario con lugar. Nada de coordinar por mensajes sueltos.',
      },
      {
        rotulo: 'Adoptado',
        titulo: 'El final feliz, a la vista.',
        texto: 'La ficha pasa a adoptado y la historia queda para contar.',
      },
    ],
  },
  modulos: {
    rotulo: 'Qué incluye',
    titulo: 'Solo los módulos que tu organización necesita.',
    nota: 'Base lista: se arma sobre piezas que ya funcionan en negocios de la zona. A medida: lo construimos para tu organización.',
    etiquetas: { base: 'Base lista', medida: 'A medida' } satisfies Record<EstadoModulo, string>,
  },
  paraQuien: {
    rotulo: 'Para quién',
    titulo: 'Para las organizaciones que se sostienen con su gente.',
    lista: [
      'Protectoras y refugios',
      'Fundaciones y asociaciones civiles',
      'Clubes',
      'Cooperadoras escolares',
      'Bomberos voluntarios',
      'Asociaciones vecinales y mutuales',
    ],
    nota: 'Socios, cuotas, eventos, turnos y avisos: el mismo núcleo sirve para clubes y entidades, adaptado a cada una.',
  },
  como: {
    rotulo: 'Cómo trabajamos',
    titulo: 'Tres pasos, con alguien de acá.',
    pasos: [
      { titulo: 'Nos cuentan cómo trabajan.', texto: 'Una charla, en persona o por WhatsApp.' },
      {
        titulo: 'Lo armamos con su identidad.',
        texto: 'Su nombre, sus colores y solo los módulos que usan.',
      },
      {
        titulo: 'Les enseñamos a usarlo.',
        texto: 'Pensado para voluntarios que no son técnicos. Y seguimos cerca.',
      },
    ],
  },
  datos: {
    titulo: 'Los datos de las personas, cuidados.',
    texto:
      'La vista pública muestra animales y campañas, nunca datos de adoptantes ni de socios. Cada formulario pide consentimiento y solo lo necesario, y la organización decide quién del equipo ve qué.',
  },
  condiciones: {
    titulo: 'Condiciones para organizaciones.',
    texto:
      'Sabemos que cada aporte cuenta. Escribinos y armamos una propuesta acorde a tu organización.',
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
