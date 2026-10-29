import { randomUUID } from 'node:crypto';
import { RUBRO_OTRO_ID } from '@/config/rubros';
import { parsePhoneAR } from '@/lib/phone';
import { sanitizeLine, sanitizeRecord } from '@/lib/sanitize';
import { LIMITES, leadPayloadSchema } from '@/lib/validation/lead';
import type { ServerEnv } from '../env';
import { getClientIp, hashIp } from '../ip';
import type { NotificationService } from '../notifications';
import { excedeLimiteDeLeads, type BurstLimiter } from '../rate-limit';
import type { LeadRepository, NuevoLead } from '../repositories/types';

export interface HandlerDeps {
  repo: LeadRepository;
  notifier: NotificationService;
  env: Pick<ServerEnv, 'IP_HASH_SALT' | 'RATE_LIMIT_MAX' | 'RATE_LIMIT_WINDOW_SECONDS'>;
  burst?: BurstLimiter;
  ahora?: () => Date;
}

/** Tamaño máximo del cuerpo. El formulario completo pesa ~1-2 KB; esto deja margen sin abrir la puerta. */
const MAX_BODY_BYTES = 16 * 1024;

type CodigoError =
  | 'UNSUPPORTED_MEDIA_TYPE'
  | 'PAYLOAD_TOO_LARGE'
  | 'INVALID_JSON'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

const MENSAJES: Record<CodigoError, string> = {
  UNSUPPORTED_MEDIA_TYPE: 'El formato de la solicitud no es válido.',
  PAYLOAD_TOO_LARGE: 'La solicitud es demasiado grande.',
  INVALID_JSON: 'No pudimos leer los datos enviados.',
  VALIDATION_ERROR: 'Revisá los datos del formulario.',
  RATE_LIMITED: 'Recibimos muchos envíos desde tu conexión. Probá de nuevo en unos minutos.',
  INTERNAL_ERROR: 'No pudimos guardar tus datos. Probá de nuevo en un momento.',
};

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

/**
 * POST /api/leads. Nunca confía en el cliente: sanitiza, valida con Zod en el servidor,
 * limita por IP (hasheada) y no expone errores internos.
 */
export async function handleCreateLead(request: Request, deps: HandlerDeps): Promise<Response> {
  const ahora = (deps.ahora ?? (() => new Date()))();
  try {
    if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      return error(415, 'UNSUPPORTED_MEDIA_TYPE');
    }
    const declarado = Number(request.headers.get('content-length') ?? 0);
    if (declarado > MAX_BODY_BYTES) return error(413, 'PAYLOAD_TOO_LARGE');

    const texto = await request.text();
    if (new TextEncoder().encode(texto).length > MAX_BODY_BYTES) {
      return error(413, 'PAYLOAD_TOO_LARGE');
    }

    let crudo: unknown;
    try {
      crudo = JSON.parse(texto);
    } catch {
      return error(400, 'INVALID_JSON');
    }
    if (typeof crudo !== 'object' || crudo === null || Array.isArray(crudo)) {
      return error(400, 'INVALID_JSON');
    }
    const cuerpo = crudo as Record<string, unknown>;

    // Honeypot: un campo que los humanos no ven. Si viene completo es un bot: se responde "ok"
    // idéntico a un éxito (para no darle pistas) pero no se guarda ni se avisa nada.
    if (typeof cuerpo.website === 'string' && cuerpo.website.trim() !== '') {
      return respuesta(201, { ok: true, id: randomUUID() });
    }

    const ipHash = hashIp(getClientIp(request.headers), deps.env.IP_HASH_SALT);

    const burst = deps.burst;
    if (burst?.excede(ipHash)) {
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

    // Sanitiza ANTES de validar, así los límites de largo se aplican al texto final.
    const limpio = sanitizeRecord(cuerpo, ['mensaje']);
    const validado = leadPayloadSchema.safeParse(limpio);
    if (!validado.success) {
      const fields: Record<string, string> = {};
      for (const issue of validado.error.issues) {
        const campo = String(issue.path[0] ?? 'form');
        fields[campo] ??= issue.message;
      }
      return error(400, 'VALIDATION_ERROR', { fields });
    }
    const d = validado.data;

    // El schema ya garantizó que el teléfono es válido: acá solo se normaliza a E.164.
    const telefono = parsePhoneAR(d.whatsapp);
    if (!telefono.ok)
      return error(400, 'VALIDATION_ERROR', { fields: { whatsapp: 'Número inválido.' } });

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
      user_agent: nullSiVacio(
        sanitizeLine(request.headers.get('user-agent') ?? '').slice(0, LIMITES.userAgent),
      ),
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
