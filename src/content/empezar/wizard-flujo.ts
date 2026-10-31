import { PASO_DATOS, PASO_LISTO, PASO_RUBRO } from '@/content/empezar/pasos';
import { WIZARD } from '@/content/empezar/wizard';
import { PENDIENTES } from '@/content/pendientes';

/**
 * Textos del flujo "tu negocio, armado en un minuto" de /empezar:
 * rubro (con "Otro" → pedido a medida) → negocio (nombre, WhatsApp, ciudad) → "Así te queda" →
 * completar (opcional) → gracias. Lo que sirve igual que antes se reutiliza de content/empezar/pasos.ts
 * (campos, privacidad, errores de envío) para que no haya dos versiones del mismo texto.
 */
export const FLUJO = {
  /** Pantalla 1, arriba del pliegue: una sola pregunta y un toque avanza. */
  rubro: {
    titulo: '¿Qué negocio tenés?',
    bajada: 'Elegí el tuyo y en menos de un minuto ves cómo te queda.',
    leyenda: PASO_RUBRO.leyendaRubros,
    /** Nombre accesible de cada tarjeta: "Gastronomía. Restaurantes, bares…". */
    tarjeta: (nombre: string, descripcion: string) => `${nombre}. ${descripcion}`,
  },

  /** "Otro": el pedido libre (hasta 500 caracteres) antes del formulario. Sin vista previa. */
  aMedida: {
    titulo: 'Contanos qué necesitás',
    bajada: 'Con tus palabras, como se lo contarías a un amigo. Lo leemos nosotros.',
    etiqueta: 'Qué necesita tu negocio',
    placeholder: 'Ej: tengo un lavadero y quiero que me saquen turno por WhatsApp',
    /** Contador visible: "120 de 500". */
    contador: (usados: number, max: number) => `${usados} de ${max}`,
    /** Contador para lectores de pantalla (se anuncia cerca del límite, no en cada tecla). */
    contadorAccesible: (restantes: number) =>
      `Te ${restantes === 1 ? 'queda' : 'quedan'} ${restantes} ${restantes === 1 ? 'carácter' : 'caracteres'}.`,
    alLimite: 'Llegaste al máximo. Si te falta lugar, lo seguimos por WhatsApp.',
    siguiente: 'Siguiente',
  },

  /** Pantalla 2: formulario mínimo. Al enviarlo se guarda el lead parcial. */
  negocio: {
    titulo: 'Contanos de tu negocio',
    /** Arriba, bien visible: la promesa de la pantalla. */
    promesa: 'Completalo y en segundos ves cómo te quedaría.',
    /** En "Otro" no hay vista previa: la promesa es otra. */
    promesaAMedida: 'Completalo y te escribimos para armarlo con vos.',
    /** Orden B (experimento): solo el nombre antes de la vista previa. */
    promesaSoloNombre: 'Poné el nombre y mirá cómo te queda.',
    campos: {
      nombreNegocio: { ...PASO_DATOS.campos.nombreNegocio, placeholder: 'Ej: Lo de Tito' },
      whatsapp: PASO_DATOS.campos.whatsapp,
      ciudad: { etiqueta: 'Ciudad', placeholder: 'Ej: Rosario' },
    },
    honeypot: PASO_DATOS.honeypot,
    erroresEnvio: PASO_DATOS.erroresEnvio,
    whatsappRespaldo: PASO_DATOS.whatsappRespaldo,
    enviar: 'Ver cómo me queda',
    enviarAMedida: 'Enviar',
    enviando: 'Armando…',
    privacidad: PASO_DATOS.privacidad,
    todoPrivacidad: PASO_DATOS.todoPrivacidad,
  },

  /** Pantalla 3: "Así te queda" (o "Lo armamos a medida" si eligió "Otro"). */
  resultado: {
    titulo: (negocio: string) => `Así te queda ${negocio}`,
    tituloSinNombre: 'Así te queda tu negocio',
    bajada: 'Es una vista previa con textos de ejemplo. Lo real lo armamos con vos.',
    cta: 'Quiero esto para mi negocio',
    completar: 'Prefiero dejar más datos',
    demo: { titulo: 'Probá la demo completa', bajada: 'Con tu nombre y tus colores ya cargados.' },
    /** Debajo del CTA: qué pasa al tocarlo. */
    queSigue: 'Se abre WhatsApp con lo que armaste. Lo seguimos por ahí.',
    todoPlazo: PENDIENTES.plazoRespuesta,
    aMedida: {
      titulo: 'Lo armamos a medida',
      texto:
        'Para lo que nos contaste no hay una vista previa armada: lo leemos nosotros y te decimos si se puede hacer y cómo.',
      cta: 'Hablarlo por WhatsApp',
    },
    /** Cambiar cómo se ve la vista previa (celular o computadora). */
    verEn: { leyenda: 'Ver en', celular: 'Celular', escritorio: 'Computadora' },
    /** Elegir entre las paletas curadas (content/paletas.ts). */
    colores: { leyenda: 'Colores', opcion: (nombre: string) => `Colores ${nombre}` },
    /** Prender o apagar los módulos del rubro en la vista previa. */
    modulos: {
      leyenda: 'Qué incluye',
      ayuda: 'Tocá para sacar o sumar.',
      estado: (cantidad: number) =>
        `${cantidad} ${cantidad === 1 ? 'pieza activada' : 'piezas activadas'}.`,
    },
    /** Barra fija abajo en celular, con el CTA siempre a mano. */
    barra: 'Quiero esto para mi negocio',
    todoWhatsapp: PASO_LISTO.todoWhatsapp,
    /** El guardado del lead falló pero la vista previa igual se muestra: le dejamos la salida. */
    sinGuardar:
      'Todavía no pudimos guardar tus datos. Lo volvemos a intentar solo; si querés, reintentá ahora o escribinos por WhatsApp.',
    reintentar: 'Reintentar ahora',
    reintentando: 'Reintentando…',
    /** Un reintento salió bien. */
    guardadoTarde: 'Listo, ya guardamos tus datos.',
  },

  /** Orden B (experimento): el WhatsApp se pide al tocar "Quiero esto", después de la vista previa. */
  contacto: {
    titulo: '¿A qué WhatsApp te escribimos?',
    promesa: 'Te escribimos con esto armado para seguirlo con vos.',
    enviar: 'Guardar y seguir',
  },

  /** Completar (opcional): todo menos el nombre del negocio es opcional. Actualiza el mismo lead. */
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
    /** Salida secundaria: vuelve a la vista previa sin completar. */
    omitir: 'Ahora no',
  },

  /** Gracias (después de completar). */
  listo: {
    titulo: 'Listo, ya nos llegaron tus datos',
    texto: (negocio: string) => `Te escribimos por WhatsApp para armar ${negocio} con vos.`,
    textoSinNombre: 'Te escribimos por WhatsApp para armar tu negocio con vos.',
    todoPlazo: PENDIENTES.plazoRespuesta,
    whatsapp: PASO_LISTO.whatsapp,
    reiniciar: PASO_LISTO.reiniciar,
  },

  /** Errores que no son de un campo (los de cada campo salen de MENSAJES_LEAD). */
  errores: {
    necesidadLibreVacia: WIZARD.errores.necesidadLibreVacia,
    necesidadLibreCorta: WIZARD.errores.necesidadLibreCorta,
    /** El enlace para completar venció o ya se usó: el WhatsApp llegó igual. */
    completarVencido:
      'No pudimos sumar estos datos, pero tu WhatsApp ya nos llegó: te escribimos igual.',
  },
} as const;
