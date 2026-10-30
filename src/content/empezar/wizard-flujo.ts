import { ESTADO_MODULO_UI, ESTADOS_MODULO_TEXTO } from '@/content/estados-modulo';
import { PASO_DATOS, PASO_LISTO, PASO_MODULOS, PASO_RUBRO } from '@/content/empezar/pasos';
import { WIZARD } from '@/content/empezar/wizard';
import { PENDIENTES } from '@/content/pendientes';

/**
 * Textos del wizard nuevo de /empezar (docs/plan-sprint.md §6, orden confirmado por el usuario):
 * necesidad → rubro → módulos → WhatsApp → completar → confirmación.
 *
 * Lo cablea la Ola 3. Mientras tanto, el wizard actual sigue leyendo PASO_RUBRO, PASO_MODULOS, PASO_DATOS y
 * PASO_LISTO (content/empezar/pasos.ts); lo que sirve igual en los dos flujos se reutiliza desde ahí para que
 * no haya dos versiones del mismo texto. Las etiquetas de cada necesidad viven en content/necesidades.ts y
 * los mensajes de validación de cada campo, en content/leads.ts.
 */
export const FLUJO = {
  /** Nombres cortos de los pasos, para el indicador de progreso (MICROCOPY.pasoDeTotal da "Paso N de M"). */
  nombresPasos: ['Qué necesitás', 'Rubro', 'Módulos', 'WhatsApp', 'Tus datos'],

  /** Paso 1: "¿Qué necesitás?" (chips, se pueden marcar varias). */
  necesidad: {
    titulo: '¿Qué necesitás?',
    bajada: 'Marcá todo lo que te sirva. Si lo tuyo no está, elegí "Otra cosa".',
    leyenda: 'Lo que necesita tu negocio',
    ayuda: 'Podés marcar varias.',
    /** Se anuncia a lectores de pantalla al marcar o desmarcar. */
    marcadas: (cantidad: number) =>
      `Marcaste ${cantidad} ${cantidad === 1 ? 'opción' : 'opciones'}.`,
    siguiente: 'Siguiente',
  },

  /** "Otra cosa / a medida": el texto libre que se abre al marcar "Otra cosa". */
  otra: {
    etiqueta: 'Contanos qué necesitás',
    ayuda: 'Con tus palabras, como se lo contarías a un amigo. Lo leemos nosotros.',
    placeholder: 'Ej: quiero controlar el stock de mis dos locales',
    /** Contador visible: "120 de 500". */
    contador: (usados: number, max: number) => `${usados} de ${max}`,
    /** Contador para lectores de pantalla (se anuncia cerca del límite, no en cada tecla). */
    contadorAccesible: (restantes: number) =>
      `Te ${restantes === 1 ? 'queda' : 'quedan'} ${restantes} ${restantes === 1 ? 'carácter' : 'caracteres'}.`,
    /** Al llegar al máximo. */
    alLimite: 'Llegaste al máximo. Si te falta lugar, lo seguimos por WhatsApp.',
    /** Debajo del campo: qué pasa con lo que escribe. */
    queSigue: 'Lo vemos con vos y te decimos si se puede armar a medida.',
  },

  /** Paso 2: rubro. Ajusta las sugerencias de módulos. "Otro" sigue existiendo. */
  rubro: {
    titulo: '¿A qué se dedica tu negocio?',
    bajada: 'Con esto ajustamos lo que te sugerimos. Si no está, elegí "Otro".',
    leyenda: PASO_RUBRO.leyendaRubros,
    rubroOtro: PASO_RUBRO.rubroOtro,
    demo: PASO_RUBRO.demo,
    siguiente: 'Siguiente',
  },

  /** Paso 3: módulos sugeridos, con su estado y la vista previa en vivo. */
  modulos: {
    titulo: PASO_MODULOS.titulo,
    bajada: 'Ya marcamos lo que va con lo que elegiste. Sacá o sumá lo que quieras.',
    leyenda: PASO_MODULOS.leyendaModulos,
    /** Marca de un módulo que viene sugerido por las necesidades marcadas en el paso 1. */
    sugeridoPorNecesidad: 'Va con lo que necesitás',
    activaste: PASO_MODULOS.activaste,
    /** Sin módulos activos: se puede seguir igual (el lead parcial no los exige). */
    sinModulos: 'No activaste ninguno. Podés seguir igual: lo vemos con vos por WhatsApp.',
    /** Solo marcó "Otra cosa" y no hay piezas sugeridas. */
    soloAMedida: 'Para lo que nos contaste no hay una pieza armada. Seguí y lo vemos a medida.',
    estados: ESTADOS_MODULO_TEXTO,
    estadoUi: ESTADO_MODULO_UI,
    objetivos: PASO_MODULOS.objetivos,
    siguiente: 'Siguiente',
  },

  /** Paso 4: solo el WhatsApp. Al enviarlo se guarda el lead parcial, aunque la persona no siga. */
  whatsapp: {
    titulo: '¿A qué WhatsApp te escribimos?',
    bajada: 'Es lo único que necesitamos para empezar. El resto es opcional.',
    campo: PASO_DATOS.campos.whatsapp,
    queSigue: {
      titulo: 'Qué pasa después',
      items: [
        'Guardamos lo que elegiste hasta acá.',
        'Te escribimos por WhatsApp para conocer tu negocio.',
        'Si querés, en el paso siguiente nos contás un poco más.',
      ],
    },
    todoPlazo: PENDIENTES.plazoRespuesta,
    privacidad: PASO_DATOS.privacidad,
    todoPrivacidad: PASO_DATOS.todoPrivacidad,
    honeypot: PASO_DATOS.honeypot,
    erroresEnvio: PASO_DATOS.erroresEnvio,
    whatsappRespaldo: PASO_DATOS.whatsappRespaldo,
    enviar: 'Guardar y seguir',
    enviando: 'Guardando…',
  },

  /** Paso 5: completar. Todo opcional salvo el nombre del negocio. Actualiza el mismo lead. */
  completar: {
    titulo: 'Contanos un poco más',
    bajada: 'Solo el nombre del negocio es obligatorio. Así llegamos a la charla sabiendo de vos.',
    /** Arriba del formulario: tranquiliza a quien duda en seguir. */
    yaGuardado: 'Ya tenemos tu WhatsApp: aunque cierres esta página, te escribimos igual.',
    campos: {
      nombreNegocio: PASO_DATOS.campos.nombreNegocio,
      nombre: { etiqueta: 'Tu nombre', ayuda: 'Para saber a quién saludar.' },
      email: { etiqueta: 'Tu mail', ayuda: 'Por si preferís recibir el presupuesto por mail.' },
      mensaje: PASO_DATOS.campos.mensaje,
    },
    erroresEnvio: PASO_DATOS.erroresEnvio,
    whatsappRespaldo: PASO_DATOS.whatsappRespaldo,
    enviar: 'Enviar mis datos',
    enviando: PASO_DATOS.enviando,
    /** Salida secundaria: deja el lead como parcial y va a la confirmación. */
    omitir: 'Ahora no, sigo por WhatsApp',
  },

  /** Confirmación. `completo` reutiliza PASO_LISTO; `parcial` es si omitió el último paso. */
  confirmacion: {
    completo: PASO_LISTO,
    parcial: {
      titulo: 'Ya tenemos tu WhatsApp',
      texto: 'Te escribimos por ahí para conocer tu negocio y armarlo con vos.',
      todoPlazo: PENDIENTES.plazoRespuesta,
    },
    /** Completó sin dejar su nombre (es opcional): el saludo arranca por el rubro. */
    graciasSinNombre: { antes: 'Para ', trasRubro: PASO_LISTO.gracias.trasRubro },
    /** No activó ningún módulo (en el lead parcial son opcionales). */
    sinPiezas: 'Todavía no elegiste piezas: las vemos juntos por WhatsApp.',
    /** Se suma a cualquiera de las dos si marcó "Otra cosa". */
    aMedida: 'Leemos lo que nos contaste y te decimos si se puede armar a medida.',
  },

  /** Errores que no son de un campo (los de cada campo salen de MENSAJES_LEAD). */
  errores: {
    sinNecesidad: WIZARD.errores.sinNecesidad,
    sinRubro: WIZARD.errores.sinRubro,
    sinRubroOtro: WIZARD.errores.sinRubroOtro,
    /** El enlace para completar venció o ya se usó: el WhatsApp llegó igual. */
    completarVencido:
      'No pudimos sumar estos datos, pero tu WhatsApp ya nos llegó: te escribimos igual.',
  },
} as const;
