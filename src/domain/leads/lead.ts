import { z } from 'zod';
import { ORIGENES } from '@/config/origenes';
import { parsePhoneAR } from '@/lib/phone';

/**
 * Validación de leads como fábrica pura: el dominio no conoce los catálogos (rubros, módulos,
 * demos) ni el copy. Los recibe por parámetro y `src/content/leads.ts` arma los esquemas que usan
 * el cliente y el servidor.
 */

/** Lo que la validación necesita saber de los catálogos. */
export interface CatalogoLead {
  rubroIds: readonly string[];
  /** Id del rubro "Otro": exige describir a qué se dedica. */
  rubroOtroId: string;
  /** ¿Es este objetivo uno de los que ofrece ese rubro? */
  esObjetivoDeRubro: (rubroId: string, objetivoId: string) => boolean;
  moduloIds: readonly string[];
  /** Paletas y cocinas de la demo de Gastronomía que existen. */
  paletaDemoIds: readonly string[];
  cocinaDemoIds: readonly string[];
}

/** Mensajes que ve la persona. Los que llevan un número lo reciben por parámetro. */
export interface MensajesLead {
  hastaCaracteres: (max: number) => string;
  nombreNegocioCorto: string;
  nombreCorto: string;
  whatsappVacio: string;
  whatsappInvalido: string;
  emailLargo: string;
  emailInvalido: string;
  rubroVacio: string;
  rubroInexistente: string;
  rubroOtroVacio: string;
  modulosVacio: string;
  modulosRepetidos: string;
  moduloInexistente: string;
  demoInexistente: string;
  objetivosRepetidos: string;
  objetivoDeOtroRubro: string;
}

/** Límites que no dependen del catálogo (se aplican igual en cliente y servidor). */
export const LIMITES_BASE = {
  nombre: 80,
  nombreNegocio: 100,
  rubroOtro: 80,
  email: 254,
  mensaje: 1000,
  objetivos: 8,
  utm: 100,
  userAgent: 400,
} as const;

export function crearEsquemasLead(catalogo: CatalogoLead, mensajes: MensajesLead) {
  const LIMITES = { ...LIMITES_BASE, modulos: catalogo.moduloIds.length } as const;

  /** Campos de la pantalla "Contanos de tu negocio". */
  const datosFormShape = {
    nombreNegocio: z
      .string()
      .trim()
      .min(2, mensajes.nombreNegocioCorto)
      .max(LIMITES.nombreNegocio, mensajes.hastaCaracteres(LIMITES.nombreNegocio)),
    nombre: z
      .string()
      .trim()
      .min(2, mensajes.nombreCorto)
      .max(LIMITES.nombre, mensajes.hastaCaracteres(LIMITES.nombre)),
    whatsapp: z
      .string()
      .trim()
      .min(1, mensajes.whatsappVacio)
      .refine(
        (v) => v === '' || parsePhoneAR(v).ok, // vacío ya lo cubre el min(1)
        mensajes.whatsappInvalido,
      ),
    email: z
      .string()
      .trim()
      .max(LIMITES.email, mensajes.emailLargo)
      .refine((v) => v === '' || z.email().safeParse(v).success, mensajes.emailInvalido),
    mensaje: z.string().trim().max(LIMITES.mensaje, mensajes.hastaCaracteres(LIMITES.mensaje)),
  };

  const datosFormSchema = z.object(datosFormShape);

  const utmField = z.string().trim().max(LIMITES.utm).optional();

  /** La personalización de la demo solo vale con una paleta y una cocina que existen. */
  const demoValida = (demo: { paleta: string; cocina: string }): boolean =>
    catalogo.paletaDemoIds.includes(demo.paleta) && catalogo.cocinaDemoIds.includes(demo.cocina);

  /**
   * Payload completo que recibe POST /api/leads. El servidor sanitiza el texto ANTES de validar
   * (ver lib/sanitize.ts) y nunca confía en lo que mande el cliente.
   */
  const leadPayloadSchema = z
    .object({
      ...datosFormShape,
      rubro: z.string().trim().min(1, mensajes.rubroVacio),
      rubroOtro: z.string().trim().max(LIMITES.rubroOtro).optional(),
      // Módulos que activó la persona: es la selección principal (mínimo 1).
      modulos: z
        .array(z.string().trim().min(1).max(60))
        .min(1, mensajes.modulosVacio)
        .max(LIMITES.modulos),
      // Opcionales: ayudan a entender para qué lo quiere.
      objetivos: z.array(z.string().trim().min(1).max(60)).max(LIMITES.objetivos),
      // De dónde viene: SOLO valores de la lista cerrada (nunca texto libre).
      origen: z.enum(ORIGENES).optional(),
      // Lo que armó en una demo (paleta y cocina): ids conocidos, tamaño acotado.
      demo: z
        .object({ paleta: z.string().max(20), cocina: z.string().max(20) })
        .strict()
        .optional(),
      // Honeypot: los humanos no lo ven ni lo completan. La ruta lo revisa antes de validar.
      website: z.string().max(200).optional(),
      utm_source: utmField,
      utm_medium: utmField,
      utm_campaign: utmField,
    })
    .superRefine((lead, ctx) => {
      if (!catalogo.rubroIds.includes(lead.rubro)) {
        ctx.addIssue({ code: 'custom', path: ['rubro'], message: mensajes.rubroInexistente });
        return;
      }
      if (lead.rubro === catalogo.rubroOtroId && (lead.rubroOtro ?? '').length < 2) {
        ctx.addIssue({ code: 'custom', path: ['rubroOtro'], message: mensajes.rubroOtroVacio });
      }
      if (new Set(lead.modulos).size !== lead.modulos.length) {
        ctx.addIssue({ code: 'custom', path: ['modulos'], message: mensajes.modulosRepetidos });
      }
      lead.modulos.forEach((id, i) => {
        if (!catalogo.moduloIds.includes(id)) {
          ctx.addIssue({
            code: 'custom',
            path: ['modulos', i],
            message: mensajes.moduloInexistente,
          });
        }
      });
      if (lead.demo && !demoValida(lead.demo)) {
        ctx.addIssue({ code: 'custom', path: ['demo'], message: mensajes.demoInexistente });
      }
      if (new Set(lead.objetivos).size !== lead.objetivos.length) {
        ctx.addIssue({ code: 'custom', path: ['objetivos'], message: mensajes.objetivosRepetidos });
      }
      lead.objetivos.forEach((o, i) => {
        if (!catalogo.esObjetivoDeRubro(lead.rubro, o)) {
          ctx.addIssue({
            code: 'custom',
            path: ['objetivos', i],
            message: mensajes.objetivoDeOtroRubro,
          });
        }
      });
    });

  return { LIMITES, datosFormShape, datosFormSchema, leadPayloadSchema };
}

export type EsquemasLead = ReturnType<typeof crearEsquemasLead>;
export type DatosForm = z.infer<EsquemasLead['datosFormSchema']>;
export type LeadPayload = z.infer<EsquemasLead['leadPayloadSchema']>;
export type LeadPayloadInput = z.input<EsquemasLead['leadPayloadSchema']>;
