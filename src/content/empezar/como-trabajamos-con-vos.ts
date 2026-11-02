import { PENDIENTES } from '@/content/pendientes';

/**
 * "Cómo trabajamos con vos" (fondo Brasa oscura): el recorrido real desde que dejás tus datos hasta
 * que lo ponemos online, en cuatro tramos (qué pasa con tus datos → qué hacemos nosotros → qué hacés
 * vos → qué recibís). Reemplaza a "Por qué confiar en WebYa" y a "Qué pasa después de dejar tus
 * datos": junta sus compromisos en una sola secuencia. Solo lo que hoy cumplimos (la entrega es
 * manual, la hacemos nosotros); lo que no está definido queda como TODO: visible.
 *
 * Borrador de la etapa (b): el copy final es la etapa (d).
 */
export const COMO_TRABAJAMOS_CON_VOS = {
  titulo: 'Así trabajamos con vos',
  bajada: 'Hoy lo armamos nosotros, a mano y con vos. Este es el recorrido.',
  /** Nombre accesible de la lista ordenada del recorrido. */
  aria: 'El recorrido, de tus datos a tu negocio online',
  tramos: [
    {
      /** Quién hace el tramo: el rótulo que va sobre la línea del plano. */
      rol: 'Vos',
      titulo: 'Dejás tus datos',
      texto: 'Elegís lo que necesitás y nos dejás tu WhatsApp. Sin compromiso.',
      /** Lo que pasa con esos datos, dicho en el mismo lugar donde se piden. */
      nota: 'Los usamos solo para contactarte y no los compartimos con nadie.',
      todos: [PENDIENTES.privacidad],
    },
    {
      rol: 'Nosotros',
      titulo: 'Te escribimos y lo armamos',
      texto:
        'Una persona te escribe por WhatsApp y te pasa un presupuesto sin compromiso. Si te cierra, cargamos tus productos, tu carta o tus servicios.',
      todos: [PENDIENTES.plazoRespuesta, PENDIENTES.precios],
    },
    {
      rol: 'Vos',
      titulo: 'Lo revisás antes de publicar',
      texto:
        'No configurás nada: lo mirás, nos pedís cambios y lo ajustamos con vos hasta que te guste.',
      todos: [],
    },
    {
      rol: 'Lo que recibís',
      titulo: 'Tu negocio online',
      texto: 'Con las piezas que activaste, y sumás más cuando quieras.',
      todos: [PENDIENTES.plazoEntrega],
    },
  ] satisfies readonly {
    rol: string;
    titulo: string;
    texto: string;
    nota?: string;
    /** Pendientes visibles (empiezan con "TODO:"). */
    todos: readonly string[];
  }[],
  /** Aclaración honesta al pie del recorrido. */
  aclaracion: 'Todavía no hay una plataforma para armarlo por tu cuenta: lo hacemos nosotros.',
  /** Probar antes de decidir (compromiso real: la demo funciona sin registrarte). */
  demo: {
    texto: 'Antes de decidir, probá la demo: pedí como cliente y miralo como dueño.',
    enlace: 'Probar la demo',
  },
} as const;
