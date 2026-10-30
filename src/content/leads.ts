import { PALETAS_DEMO } from '@/content/demos/gastronomia/paletas';
import { COCINA_IDS } from '@/content/demos/gastronomia/types';
import { MODULO_IDS } from '@/content/modulos';
import { NECESIDAD_IDS, NECESIDAD_OTRA_ID } from '@/content/necesidades';
import { esObjetivoDeRubro, RUBRO_IDS, RUBRO_OTRO_ID } from '@/content/rubros';
import { crearEsquemasLead, type CatalogoLead } from '@/domain/leads/lead';
import { MENSAJES_LEAD } from './leads-mensajes';

export type {
  CompletarLead,
  CompletarLeadInput,
  DatosForm,
  LeadParcial,
  LeadParcialInput,
  LeadPayload,
  LeadPayloadInput,
} from '@/domain/leads/lead';

export { MENSAJES_LEAD } from './leads-mensajes';

/** Respuestas de la API de leads (errores generales, no de un campo). */
export const MENSAJES_API_LEAD = {
  UNSUPPORTED_MEDIA_TYPE: 'El formato de la solicitud no es válido.',
  /** Pedido armado desde otro sitio (Sec-Fetch-Site: cross-site): el formulario es siempre del mismo sitio. */
  FORBIDDEN: 'Esta solicitud no se puede hacer desde otro sitio.',
  PAYLOAD_TOO_LARGE: 'La solicitud es demasiado grande.',
  INVALID_JSON: 'No pudimos leer los datos enviados.',
  VALIDATION_ERROR: 'Revisá los datos del formulario.',
  RATE_LIMITED: 'Recibimos muchos envíos desde tu conexión. Probá de nuevo en unos minutos.',
  INTERNAL_ERROR: 'No pudimos guardar tus datos. Probá de nuevo en un momento.',
  /**
   * PATCH con id o token que no coinciden, o ya vencido o usado. Es el mismo mensaje para todos los
   * casos: no le da pistas a quien prueba ids.
   */
  NOT_FOUND:
    'No encontramos tu consulta o el enlace ya venció. Tu WhatsApp nos llegó igual: te escribimos.',
  /** El schema ya validó el teléfono: esto solo aparece si algo se desincroniza. */
  WHATSAPP_INVALIDO: 'Número inválido.',
} as const;

/** Lo que la validación necesita de los catálogos de content. */
export const CATALOGO_LEAD: CatalogoLead = {
  rubroIds: RUBRO_IDS,
  rubroOtroId: RUBRO_OTRO_ID,
  esObjetivoDeRubro,
  moduloIds: MODULO_IDS,
  necesidadIds: NECESIDAD_IDS,
  necesidadOtraId: NECESIDAD_OTRA_ID,
  paletaDemoIds: PALETAS_DEMO.map((p) => p.id),
  cocinaDemoIds: COCINA_IDS,
};

/** Esquemas del lead, armados con los catálogos y el copy de WebYa. */
export const ESQUEMAS_LEAD = crearEsquemasLead(CATALOGO_LEAD, MENSAJES_LEAD);

export const {
  LIMITES,
  datosFormShape,
  datosFormSchema,
  leadPayloadSchema,
  leadParcialSchema,
  completarLeadSchema,
} = ESQUEMAS_LEAD;
