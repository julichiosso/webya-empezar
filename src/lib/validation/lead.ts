import { z } from 'zod';
import { MODULO_IDS } from '@/config/modulos';
import { esObjetivoDeRubro, getRubro, RUBRO_OTRO_ID } from '@/config/rubros';
import { parsePhoneAR } from '../phone';

/** Límites de tamaño de campos (se aplican igual en cliente y servidor). */
export const LIMITES = {
  nombre: 80,
  nombreNegocio: 100,
  rubroOtro: 80,
  email: 254,
  mensaje: 1000,
  objetivos: 8,
  modulos: MODULO_IDS.length,
  utm: 100,
  userAgent: 400,
} as const;

/** Campos de la pantalla "Contanos de tu negocio". Los mensajes son lo que ve la persona. */
export const datosFormShape = {
  nombreNegocio: z
    .string()
    .trim()
    .min(2, 'Contanos cómo se llama tu negocio.')
    .max(LIMITES.nombreNegocio, `Usá hasta ${LIMITES.nombreNegocio} caracteres.`),
  nombre: z
    .string()
    .trim()
    .min(2, 'Decinos tu nombre para saber a quién escribirle.')
    .max(LIMITES.nombre, `Usá hasta ${LIMITES.nombre} caracteres.`),
  whatsapp: z
    .string()
    .trim()
    .min(1, 'Dejanos tu WhatsApp para poder escribirte.')
    .refine(
      (v) => v === '' || parsePhoneAR(v).ok, // vacío ya lo cubre el min(1)
      'Revisá el número: tiene que ser de Argentina, por ejemplo 11 2345 6789.',
    ),
  email: z
    .string()
    .trim()
    .max(LIMITES.email, 'Ese mail es demasiado largo.')
    .refine(
      (v) => v === '' || z.email().safeParse(v).success,
      'Revisá el mail: tiene que verse así, nombre@dominio.com. Si no querés dejarlo, lo podés vaciar.',
    ),
  mensaje: z.string().trim().max(LIMITES.mensaje, `Usá hasta ${LIMITES.mensaje} caracteres.`),
};

export const datosFormSchema = z.object(datosFormShape);
export type DatosForm = z.infer<typeof datosFormSchema>;

const utmField = z.string().trim().max(LIMITES.utm).optional();

/**
 * Payload completo que recibe POST /api/leads. El servidor sanitiza el texto ANTES de validar
 * (ver lib/sanitize.ts) y nunca confía en lo que mande el cliente.
 */
export const leadPayloadSchema = z
  .object({
    ...datosFormShape,
    rubro: z.string().trim().min(1, 'Elegí un rubro.'),
    rubroOtro: z.string().trim().max(LIMITES.rubroOtro).optional(),
    // Módulos que activó la persona: es la selección principal (mínimo 1).
    modulos: z
      .array(z.string().trim().min(1).max(60))
      .min(1, 'Activá al menos un módulo.')
      .max(LIMITES.modulos),
    // Opcionales: ayudan a entender para qué lo quiere.
    objetivos: z.array(z.string().trim().min(1).max(60)).max(LIMITES.objetivos),
    // Honeypot: los humanos no lo ven ni lo completan. La ruta lo revisa antes de validar.
    website: z.string().max(200).optional(),
    utm_source: utmField,
    utm_medium: utmField,
    utm_campaign: utmField,
  })
  .superRefine((lead, ctx) => {
    if (!getRubro(lead.rubro)) {
      ctx.addIssue({ code: 'custom', path: ['rubro'], message: 'Ese rubro no existe.' });
      return;
    }
    if (lead.rubro === RUBRO_OTRO_ID && (lead.rubroOtro ?? '').length < 2) {
      ctx.addIssue({
        code: 'custom',
        path: ['rubroOtro'],
        message: 'Contanos a qué se dedica tu negocio.',
      });
    }
    if (new Set(lead.modulos).size !== lead.modulos.length) {
      ctx.addIssue({ code: 'custom', path: ['modulos'], message: 'Hay módulos repetidos.' });
    }
    lead.modulos.forEach((id, i) => {
      if (!(MODULO_IDS as readonly string[]).includes(id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['modulos', i],
          message: 'Ese módulo no existe.',
        });
      }
    });
    if (new Set(lead.objetivos).size !== lead.objetivos.length) {
      ctx.addIssue({ code: 'custom', path: ['objetivos'], message: 'Hay objetivos repetidos.' });
    }
    lead.objetivos.forEach((o, i) => {
      if (!esObjetivoDeRubro(lead.rubro, o)) {
        ctx.addIssue({
          code: 'custom',
          path: ['objetivos', i],
          message: 'Ese objetivo no corresponde al rubro.',
        });
      }
    });
  });

export type LeadPayload = z.infer<typeof leadPayloadSchema>;
export type LeadPayloadInput = z.input<typeof leadPayloadSchema>;
