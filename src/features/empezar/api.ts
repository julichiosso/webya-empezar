import type { CompletarLeadInput, LeadParcialInput, LeadPayloadInput } from '@/content/leads';
import type { LeadGuardado } from './state';

type Causa = 'validacion' | 'limite' | 'servidor' | 'red';

export type EnvioResultado =
  | { ok: true }
  | {
      ok: false;
      /** Causa para elegir el mensaje: validación, límite de envíos, servidor o red. */
      causa: Causa;
      /** Errores por campo devueltos por el servidor (solo en 'validacion'). */
      campos?: Record<string, string>;
    };

export type ParcialResultado =
  ({ ok: true } & LeadGuardado) | Extract<EnvioResultado, { ok: false }>;

/** Completar: además de las de siempre, el enlace pudo vencer (6 h) o ya haberse usado. */
export type CompletarResultado =
  { ok: true } | Extract<EnvioResultado, { ok: false }> | { ok: false; causa: 'vencido' };

const TIMEOUT_MS = 15_000;

/** Pide a la API con timeout. Nunca lanza: si no hubo respuesta devuelve null. */
async function pedir(url: string, method: 'POST' | 'PATCH', body: unknown) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fallo(res: Response | null): Promise<Extract<EnvioResultado, { ok: false }>> {
  if (!res) return { ok: false, causa: 'red' };
  if (res.status === 429) return { ok: false, causa: 'limite' };
  if (res.status === 400 || res.status === 422) {
    const body = (await res.json().catch(() => null)) as {
      error?: { fields?: Record<string, string> };
    } | null;
    return { ok: false, causa: 'validacion', campos: body?.error?.fields };
  }
  return { ok: false, causa: 'servidor' };
}

/** Envío completo de un solo paso (quien viene de la demo): POST /api/leads. */
export async function enviarLead(payload: LeadPayloadInput): Promise<EnvioResultado> {
  const res = await pedir('/api/leads', 'POST', payload);
  return res?.ok ? { ok: true } : fallo(res);
}

/** Lead parcial ("solo WhatsApp primero"): POST /api/leads con `parcial: true` → { id, token }. */
export async function crearLeadParcial(payload: LeadParcialInput): Promise<ParcialResultado> {
  const res = await pedir('/api/leads', 'POST', { ...payload, parcial: true });
  if (!res?.ok) return fallo(res);
  const body = (await res.json().catch(() => null)) as Partial<LeadGuardado> | null;
  if (typeof body?.id !== 'string' || typeof body.token !== 'string') {
    return { ok: false, causa: 'servidor' };
  }
  return { ok: true, id: body.id, token: body.token };
}

/** Completa el lead parcial: PATCH /api/leads/[id]. Un 404 es "venció o ya se usó". */
export async function completarLead(
  lead: LeadGuardado,
  datos: Omit<CompletarLeadInput, 'token'>,
): Promise<CompletarResultado> {
  const res = await pedir(`/api/leads/${encodeURIComponent(lead.id)}`, 'PATCH', {
    ...datos,
    token: lead.token,
  });
  if (res?.ok) return { ok: true };
  if (res?.status === 404) return { ok: false, causa: 'vencido' };
  return fallo(res);
}
