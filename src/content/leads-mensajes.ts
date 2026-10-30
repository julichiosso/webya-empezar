import type { MensajesLead } from '@/domain/leads/lead';
import { WIZARD } from '@/content/empezar/wizard';

/*
 * Aparte de content/leads.ts (que arma los esquemas con zod) para que el estado del wizard use los
 * mensajes sin arrastrar zod al JS inicial.
 */

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
  necesidadesRepetidas: 'Hay opciones repetidas.',
  necesidadInexistente: 'Esa opción no existe.',
  necesidadLibreVacia: WIZARD.errores.necesidadLibreVacia,
  necesidadLibreCorta: WIZARD.errores.necesidadLibreCorta,
  tokenInvalido: 'El enlace para completar tus datos no es válido.',
};
