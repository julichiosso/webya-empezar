import { PALETAS_DEMO } from '@/content/demos/gastronomia/paletas';
import { COCINA_IDS } from '@/content/demos/gastronomia/types';
import { MODULO_IDS } from '@/content/modulos';
import { esObjetivoDeRubro, RUBRO_IDS, RUBRO_OTRO_ID } from '@/content/rubros';
import { crearEsquemasLead, type CatalogoLead, type MensajesLead } from '@/domain/leads/lead';

export type { DatosForm, LeadPayload, LeadPayloadInput } from '@/domain/leads/lead';

/** Mensajes de validación del lead: lo que ve la persona al lado de cada campo. */
export const MENSAJES_LEAD: MensajesLead = {
  hastaCaracteres: (max) => `Usá hasta ${max} caracteres.`,
  nombreNegocioCorto: 'Contanos cómo se llama tu negocio.',
  nombreCorto: 'Decinos tu nombre para saber a quién escribirle.',
  whatsappVacio: 'Dejanos tu WhatsApp para poder escribirte.',
  whatsappInvalido: 'Revisá el número: tiene que ser de Argentina, por ejemplo 11 2345 6789.',
  emailLargo: 'Ese mail es demasiado largo.',
  emailInvalido:
    'Revisá el mail: tiene que verse así, nombre@dominio.com. Si no querés dejarlo, lo podés vaciar.',
  rubroVacio: 'Elegí un rubro.',
  rubroInexistente: 'Ese rubro no existe.',
  rubroOtroVacio: 'Contanos a qué se dedica tu negocio.',
  modulosVacio: 'Activá al menos un módulo.',
  modulosRepetidos: 'Hay módulos repetidos.',
  moduloInexistente: 'Ese módulo no existe.',
  demoInexistente: 'Esa personalización no existe.',
  objetivosRepetidos: 'Hay objetivos repetidos.',
  objetivoDeOtroRubro: 'Ese objetivo no corresponde al rubro.',
};

/** Respuestas de la API de leads (errores generales, no de un campo). */
export const MENSAJES_API_LEAD = {
  UNSUPPORTED_MEDIA_TYPE: 'El formato de la solicitud no es válido.',
  PAYLOAD_TOO_LARGE: 'La solicitud es demasiado grande.',
  INVALID_JSON: 'No pudimos leer los datos enviados.',
  VALIDATION_ERROR: 'Revisá los datos del formulario.',
  RATE_LIMITED: 'Recibimos muchos envíos desde tu conexión. Probá de nuevo en unos minutos.',
  INTERNAL_ERROR: 'No pudimos guardar tus datos. Probá de nuevo en un momento.',
  /** El schema ya validó el teléfono: esto solo aparece si algo se desincroniza. */
  WHATSAPP_INVALIDO: 'Número inválido.',
} as const;

/** Lo que la validación necesita de los catálogos de content. */
export const CATALOGO_LEAD: CatalogoLead = {
  rubroIds: RUBRO_IDS,
  rubroOtroId: RUBRO_OTRO_ID,
  esObjetivoDeRubro,
  moduloIds: MODULO_IDS,
  paletaDemoIds: PALETAS_DEMO.map((p) => p.id),
  cocinaDemoIds: COCINA_IDS,
};

/** Esquemas del lead, armados con los catálogos y el copy de WebYa. */
export const ESQUEMAS_LEAD = crearEsquemasLead(CATALOGO_LEAD, MENSAJES_LEAD);

export const { LIMITES, datosFormShape, datosFormSchema, leadPayloadSchema } = ESQUEMAS_LEAD;
