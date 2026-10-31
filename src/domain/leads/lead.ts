import { z } from 'zod';
// Antes de construir los esquemas: sin eval (CSP). Ver lib/zod-sin-eval.ts.
import '@/lib/zod-sin-eval';
import { ORIGENES } from '@/config/origenes';
import { parsePhoneAR } from '@/lib/phone';
import { LIMITES_BASE, TOKEN_LEAD_REGEX } from './limites';

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
  /** Necesidades del paso "¿Qué necesitás?" y la que abre el texto libre ("otra"). */
  necesidadIds: readonly string[];
  necesidadOtraId: string;
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
  necesidadesRepetidas: string;
  necesidadInexistente: string;
  /** Marcó "Otra cosa" pero no escribió qué necesita. */
  necesidadLibreVacia: string;
  /** Escribió algo, pero demasiado corto para entenderlo. */
  necesidadLibreCorta: string;
  tokenInvalido: string;
}

export { LIMITES_BASE, TOKEN_LEAD_REGEX } from './limites';

type Ctx = z.RefinementCtx;

/** Ids sin repetir y todos del catálogo. Los mensajes y la ruta son los de cada campo. */
function revisarIds(
  ctx: Ctx,
  campo: string,
  lista: readonly string[],
  validos: readonly string[],
  repetidos: string,
  inexistente: string,
) {
  if (new Set(lista).size !== lista.length) {
    ctx.addIssue({ code: 'custom', path: [campo], message: repetidos });
  }
  lista.forEach((id, i) => {
    if (!validos.includes(id)) {
      ctx.addIssue({ code: 'custom', path: [campo, i], message: inexistente });
    }
  });
}

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
      revisarModulosDemoYObjetivos(ctx, lead, lead.rubro);
    });

  /** Módulos, demo y objetivos: mismas reglas en el lead completo y en el parcial. */
  function revisarModulosDemoYObjetivos(
    ctx: Ctx,
    lead: { modulos: string[]; objetivos: string[]; demo?: { paleta: string; cocina: string } },
    rubro: string | undefined,
  ) {
    revisarIds(
      ctx,
      'modulos',
      lead.modulos,
      catalogo.moduloIds,
      mensajes.modulosRepetidos,
      mensajes.moduloInexistente,
    );
    if (lead.demo && !demoValida(lead.demo)) {
      ctx.addIssue({ code: 'custom', path: ['demo'], message: mensajes.demoInexistente });
    }
    if (new Set(lead.objetivos).size !== lead.objetivos.length) {
      ctx.addIssue({ code: 'custom', path: ['objetivos'], message: mensajes.objetivosRepetidos });
    }
    lead.objetivos.forEach((o, i) => {
      if (!rubro || !catalogo.esObjetivoDeRubro(rubro, o)) {
        ctx.addIssue({
          code: 'custom',
          path: ['objetivos', i],
          message: mensajes.objetivoDeOtroRubro,
        });
      }
    });
  }

  const listaDeIds = (max: number) => z.array(z.string().trim().min(1).max(60)).max(max);

  /**
   * Lead parcial ("solo WhatsApp primero"): lo único obligatorio es el WhatsApp. Se guarda apenas
   * lo deja, con lo que haya elegido antes (necesidades, texto libre, rubro y módulos). El servidor
   * sanitiza antes de validar (necesidadLibre como texto multilínea).
   */
  const leadParcialSchema = z
    .object({
      whatsapp: datosFormShape.whatsapp,
      // Pantalla 2 del flujo: el nombre del negocio va con el WhatsApp; la ciudad es opcional.
      nombreNegocio: z
        .string()
        .trim()
        .max(LIMITES.nombreNegocio, mensajes.hastaCaracteres(LIMITES.nombreNegocio))
        .optional(),
      ciudad: z
        .string()
        .trim()
        .max(LIMITES.ciudad, mensajes.hastaCaracteres(LIMITES.ciudad))
        .optional(),
      necesidades: listaDeIds(LIMITES.necesidades).default([]),
      // "Otra cosa / a medida": pedido libre. Vacío equivale a no haberlo escrito.
      necesidadLibre: z
        .string()
        .trim()
        .max(LIMITES.necesidadLibre, mensajes.hastaCaracteres(LIMITES.necesidadLibre))
        .optional(),
      rubro: z.string().trim().max(60).optional(),
      rubroOtro: z.string().trim().max(LIMITES.rubroOtro).optional(),
      modulos: listaDeIds(LIMITES.modulosParcial).default([]),
      objetivos: listaDeIds(LIMITES.objetivos).default([]),
      origen: z.enum(ORIGENES).optional(),
      demo: z
        .object({ paleta: z.string().max(20), cocina: z.string().max(20) })
        .strict()
        .optional(),
      website: z.string().max(200).optional(),
      utm_source: utmField,
      utm_medium: utmField,
      utm_campaign: utmField,
    })
    .superRefine((lead, ctx) => {
      revisarIds(
        ctx,
        'necesidades',
        lead.necesidades,
        catalogo.necesidadIds,
        mensajes.necesidadesRepetidas,
        mensajes.necesidadInexistente,
      );
      const libre = lead.necesidadLibre ?? '';
      if (lead.necesidades.includes(catalogo.necesidadOtraId) && libre === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['necesidadLibre'],
          message: mensajes.necesidadLibreVacia,
        });
      } else if (libre !== '' && libre.length < LIMITES.necesidadLibreMin) {
        ctx.addIssue({
          code: 'custom',
          path: ['necesidadLibre'],
          message: mensajes.necesidadLibreCorta,
        });
      }
      const rubro = lead.rubro || undefined;
      if (rubro && !catalogo.rubroIds.includes(rubro)) {
        ctx.addIssue({ code: 'custom', path: ['rubro'], message: mensajes.rubroInexistente });
        return;
      }
      // "Otro": alcanza con el nombre del rubro o con el pedido libre "a medida".
      if (rubro === catalogo.rubroOtroId && (lead.rubroOtro ?? '').length < 2 && libre === '') {
        ctx.addIssue({ code: 'custom', path: ['rubroOtro'], message: mensajes.rubroOtroVacio });
      }
      revisarModulosDemoYObjetivos(ctx, lead, rubro);
    });

  /**
   * PATCH /api/leads/[id]: completa el lead parcial con el token que devolvió el POST. Solo el
   * nombre del negocio es obligatorio; el nombre de la persona, el mail y el mensaje son opcionales.
   */
  const completarLeadSchema = z.object({
    token: z.string().regex(TOKEN_LEAD_REGEX, mensajes.tokenInvalido),
    nombreNegocio: datosFormShape.nombreNegocio,
    nombre: z
      .string()
      .trim()
      .max(LIMITES.nombre, mensajes.hastaCaracteres(LIMITES.nombre))
      .refine((v) => v === '' || v.length >= 2, mensajes.nombreCorto)
      .optional(),
    email: datosFormShape.email.optional(),
    mensaje: datosFormShape.mensaje.optional(),
    website: z.string().max(200).optional(),
  });

  return {
    LIMITES,
    datosFormShape,
    datosFormSchema,
    leadPayloadSchema,
    leadParcialSchema,
    completarLeadSchema,
  };
}

export type EsquemasLead = ReturnType<typeof crearEsquemasLead>;
export type DatosForm = z.infer<EsquemasLead['datosFormSchema']>;
export type LeadPayload = z.infer<EsquemasLead['leadPayloadSchema']>;
export type LeadPayloadInput = z.input<EsquemasLead['leadPayloadSchema']>;
export type LeadParcial = z.infer<EsquemasLead['leadParcialSchema']>;
export type LeadParcialInput = z.input<EsquemasLead['leadParcialSchema']>;
export type CompletarLead = z.infer<EsquemasLead['completarLeadSchema']>;
export type CompletarLeadInput = z.input<EsquemasLead['completarLeadSchema']>;
