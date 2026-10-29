import { randomUUID } from 'node:crypto';
import type { z } from 'zod';
import {
  completarLeadSchema,
  LIMITES,
  leadParcialSchema,
  leadPayloadSchema,
  MENSAJES_API_LEAD,
} from '@/content/leads';
import { RUBRO_OTRO_ID } from '@/content/rubros';
import { parsePhoneAR } from '@/lib/phone';
import { sanitizeLine, sanitizeRecord } from '@/lib/sanitize';
import type { ServerEnv } from '../env';
import { getClientIp, hashIp } from '../ip';
import type { NotificationService } from '../notifications';
import { excedeLimiteDeLeads, type BurstLimiter } from '../rate-limit';
import type { LeadRepository, NuevoLead, NuevoLeadParcial } from '../repositories/types';
import { generarToken, hashToken } from './token';

export interface HandlerDeps {
  repo: LeadRepository;
  notifier: NotificationService;
  env: Pick<ServerEnv, 'IP_HASH_SALT' | 'RATE_LIMIT_MAX' | 'RATE_LIMIT_WINDOW_SECONDS'>;
  burst?: BurstLimiter;
  ahora?: () => Date;
}

/** Lo que necesita PATCH /api/leads/[id] (las mismas deps del POST sirven). */
export type CompletarDeps = Pick<HandlerDeps, 'repo' | 'burst' | 'ahora'> & {
  env: Pick<ServerEnv, 'IP_HASH_SALT'>;
};

/** Tamaño máximo del cuerpo. El formulario completo pesa ~1-2 KB; esto deja margen sin abrir la puerta. */
const MAX_BODY_BYTES = 16 * 1024;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type CodigoError =
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'PAYLOAD_TOO_LARGE'
  | 'INVALID_JSON'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

const MENSAJES: Record<CodigoError, string> = MENSAJES_API_LEAD;

const SIN_CACHE = { 'Cache-Control': 'no-store' };

function respuesta(status: number, body: unknown, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...SIN_CACHE, ...headers } });
}

function error(
  status: number,
  code: CodigoError,
  extra: { fields?: Record<string, string>; headers?: Record<string, string> } = {},
) {
  return respuesta(
    status,
    { error: { code, message: MENSAJES[code], ...(extra.fields && { fields: extra.fields }) } },
    extra.headers,
  );
}

const nullSiVacio = (v: string | undefined) => (v && v.length > 0 ? v : null);

/** Primer mensaje de cada campo (lo que muestra el formulario al lado del campo). */
function camposConError(issues: readonly z.core.$ZodIssue[]): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of issues) {
    const campo = String(issue.path[0] ?? 'form');
    fields[campo] ??= issue.message;
  }
  return fields;
}

/** Content-type, tamaño y JSON de objeto. Devuelve el cuerpo o la respuesta de error. */
async function leerCuerpo(
  request: Request,
): Promise<{ cuerpo: Record<string, unknown> } | { falla: Response }> {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return { falla: error(415, 'UNSUPPORTED_MEDIA_TYPE') };
  }
  const declarado = Number(request.headers.get('content-length') ?? 0);
  if (declarado > MAX_BODY_BYTES) return { falla: error(413, 'PAYLOAD_TOO_LARGE') };

  const texto = await request.text();
  if (new TextEncoder().encode(texto).length > MAX_BODY_BYTES) {
    return { falla: error(413, 'PAYLOAD_TOO_LARGE') };
  }

  let crudo: unknown;
  try {
    crudo = JSON.parse(texto);
  } catch {
    return { falla: error(400, 'INVALID_JSON') };
  }
  if (typeof crudo !== 'object' || crudo === null || Array.isArray(crudo)) {
    return { falla: error(400, 'INVALID_JSON') };
  }
  return { cuerpo: crudo as Record<string, unknown> };
}

/** Honeypot: un campo que los humanos no ven. Si viene completo es un bot. */
const esBot = (cuerpo: Record<string, unknown>) =>
  typeof cuerpo.website === 'string' && cuerpo.website.trim() !== '';

const userAgent = (request: Request) =>
  nullSiVacio(sanitizeLine(request.headers.get('user-agent') ?? '').slice(0, LIMITES.userAgent));

/**
 * POST /api/leads. Nunca confía en el cliente: sanitiza, valida con Zod en el servidor,
 * limita por IP (hasheada) y no expone errores internos.
 *
 * Con `parcial: true` guarda el lead parcial ("solo WhatsApp primero") y devuelve el token para
 * completarlo después (PATCH /api/leads/[id]). Sin `parcial`, el flujo de un solo envío.
 */
export async function handleCreateLead(request: Request, deps: HandlerDeps): Promise<Response> {
  const ahora = (deps.ahora ?? (() => new Date()))();
  try {
    const leido = await leerCuerpo(request);
    if ('falla' in leido) return leido.falla;
    const { cuerpo } = leido;
    const parcial = cuerpo.parcial === true;

    // Honeypot: se responde "ok" idéntico a un éxito (para no darle pistas al bot) pero no se
    // guarda ni se avisa nada.
    if (esBot(cuerpo)) {
      return respuesta(
        201,
        parcial
          ? { ok: true, id: randomUUID(), token: generarToken() }
          : { ok: true, id: randomUUID() },
      );
    }

    const ipHash = hashIp(getClientIp(request.headers), deps.env.IP_HASH_SALT);

    if (deps.burst?.excede(ipHash)) {
      return error(429, 'RATE_LIMITED', { headers: { 'Retry-After': '60' } });
    }
    if (
      await excedeLimiteDeLeads(
        deps.repo,
        ipHash,
        deps.env.RATE_LIMIT_MAX,
        deps.env.RATE_LIMIT_WINDOW_SECONDS,
        ahora,
      )
    ) {
      return error(429, 'RATE_LIMITED', {
        headers: { 'Retry-After': String(deps.env.RATE_LIMIT_WINDOW_SECONDS) },
      });
    }

    if (parcial) return await crearParcial(request, cuerpo, ipHash, deps);

    // Sanitiza ANTES de validar, así los límites de largo se aplican al texto final.
    const limpio = sanitizeRecord(cuerpo, ['mensaje']);
    const validado = leadPayloadSchema.safeParse(limpio);
    if (!validado.success) {
      return error(400, 'VALIDATION_ERROR', { fields: camposConError(validado.error.issues) });
    }
    const d = validado.data;

    // El schema ya garantizó que el teléfono es válido: acá solo se normaliza a E.164.
    const telefono = parsePhoneAR(d.whatsapp);
    if (!telefono.ok) {
      return error(400, 'VALIDATION_ERROR', {
        fields: { whatsapp: MENSAJES_API_LEAD.WHATSAPP_INVALIDO },
      });
    }

    const lead: NuevoLead = {
      nombre: d.nombre,
      email: nullSiVacio(d.email),
      whatsapp: telefono.e164,
      nombre_negocio: d.nombreNegocio,
      rubro: d.rubro,
      rubro_otro: d.rubro === RUBRO_OTRO_ID ? nullSiVacio(d.rubroOtro) : null,
      modulos: d.modulos,
      objetivos: d.objetivos,
      mensaje: nullSiVacio(d.mensaje),
      // Lista cerrada (validada por el schema); sin origen, el repositorio pone el de siempre.
      origen: d.origen,
      // Solo si vino de una demo: así los leads comunes no dependen de la columna nueva.
      ...(d.demo ? { demo: d.demo } : {}),
      utm_source: nullSiVacio(d.utm_source),
      utm_medium: nullSiVacio(d.utm_medium),
      utm_campaign: nullSiVacio(d.utm_campaign),
      ip_hash: ipHash,
      user_agent: userAgent(request),
    };

    const { id } = await deps.repo.crear(lead);

    // El aviso es "best effort": si falla no se le devuelve un error a quien ya dejó sus datos.
    try {
      await deps.notifier.nuevoLead({ ...lead, id });
    } catch (e) {
      console.error(
        '[leads] falló el aviso de nuevo lead',
        e instanceof Error ? e.message : 'error',
      );
    }

    return respuesta(201, { ok: true, id });
  } catch (e) {
    // Detalle solo en el log del servidor; al cliente, un mensaje genérico.
    console.error('[leads] error interno', e instanceof Error ? e.message : 'error');
    return error(500, 'INTERNAL_ERROR');
  }
}

/** Lead parcial: valida, guarda con el hash del token y devuelve { id, token }. */
async function crearParcial(
  request: Request,
  cuerpo: Record<string, unknown>,
  ipHash: string,
  deps: HandlerDeps,
): Promise<Response> {
  // El pedido "a medida" admite saltos de línea, igual que el mensaje.
  const limpio = sanitizeRecord(cuerpo, ['mensaje', 'necesidadLibre']);
  const validado = leadParcialSchema.safeParse(limpio);
  if (!validado.success) {
    return error(400, 'VALIDATION_ERROR', { fields: camposConError(validado.error.issues) });
  }
  const d = validado.data;
  const telefono = parsePhoneAR(d.whatsapp);
  if (!telefono.ok) {
    return error(400, 'VALIDATION_ERROR', {
      fields: { whatsapp: MENSAJES_API_LEAD.WHATSAPP_INVALIDO },
    });
  }

  const token = generarToken();
  const rubro = nullSiVacio(d.rubro);
  const lead: NuevoLeadParcial = {
    whatsapp: telefono.e164,
    necesidades: d.necesidades,
    necesidad_libre: nullSiVacio(d.necesidadLibre),
    rubro,
    rubro_otro: rubro === RUBRO_OTRO_ID ? nullSiVacio(d.rubroOtro) : null,
    modulos: d.modulos,
    objetivos: d.objetivos,
    origen: d.origen,
    ...(d.demo ? { demo: d.demo } : {}),
    utm_source: nullSiVacio(d.utm_source),
    utm_medium: nullSiVacio(d.utm_medium),
    utm_campaign: nullSiVacio(d.utm_campaign),
    ip_hash: ipHash,
    user_agent: userAgent(request),
    // Solo el hash: con la base no se puede completar el lead de nadie.
    token_hash: hashToken(token),
  };

  const { id } = await deps.repo.crearParcial(lead);

  try {
    await deps.notifier.nuevoLeadParcial({
      id,
      whatsapp: lead.whatsapp,
      necesidades: lead.necesidades,
      necesidad_libre: lead.necesidad_libre,
      rubro: lead.rubro,
      rubro_otro: lead.rubro_otro,
      modulos: lead.modulos,
    });
  } catch (e) {
    console.error(
      '[leads] falló el aviso de lead parcial',
      e instanceof Error ? e.message : 'error',
    );
  }

  return respuesta(201, { ok: true, id, token });
}

/**
 * PATCH /api/leads/[id]: completa un lead parcial con el token que devolvió el POST. Un id o un
 * token que no coinciden, vencidos o ya usados responden igual (404 genérico): no hay pistas para
 * quien prueba.
 */
export async function handleCompletarLead(
  request: Request,
  id: string,
  deps: CompletarDeps,
): Promise<Response> {
  const ahora = (deps.ahora ?? (() => new Date()))();
  try {
    const leido = await leerCuerpo(request);
    if ('falla' in leido) return leido.falla;
    const { cuerpo } = leido;

    if (esBot(cuerpo)) return respuesta(200, { ok: true });

    const ipHash = hashIp(getClientIp(request.headers), deps.env.IP_HASH_SALT);
    if (deps.burst?.excede(ipHash)) {
      return error(429, 'RATE_LIMITED', { headers: { 'Retry-After': '60' } });
    }

    if (!UUID.test(id)) return error(404, 'NOT_FOUND');

    const limpio = sanitizeRecord(cuerpo, ['mensaje']);
    const validado = completarLeadSchema.safeParse(limpio);
    if (!validado.success) {
      // Un token con forma inválida es lo mismo que uno que no coincide.
      if (validado.error.issues.some((i) => i.path[0] === 'token')) {
        return error(404, 'NOT_FOUND');
      }
      return error(400, 'VALIDATION_ERROR', { fields: camposConError(validado.error.issues) });
    }
    const d = validado.data;

    const resultado = await deps.repo.completar(
      id.toLowerCase(),
      hashToken(d.token),
      {
        nombre_negocio: d.nombreNegocio,
        nombre: nullSiVacio(d.nombre),
        email: nullSiVacio(d.email),
        mensaje: nullSiVacio(d.mensaje),
      },
      ahora,
    );
    if (resultado !== 'ok') return error(404, 'NOT_FOUND');
    return respuesta(200, { ok: true });
  } catch (e) {
    console.error('[leads] error interno al completar', e instanceof Error ? e.message : 'error');
    return error(500, 'INTERNAL_ERROR');
  }
}
