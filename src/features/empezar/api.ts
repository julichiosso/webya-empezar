import type { LeadPayloadInput } from '@/content/leads';

export type EnvioResultado =
  | { ok: true }
  | {
      ok: false;
      /** Causa para elegir el mensaje: validación, límite de envíos, servidor o red. */
      causa: 'validacion' | 'limite' | 'servidor' | 'red';
      /** Errores por campo devueltos por el servidor (solo en 'validacion'). */
      campos?: Record<string, string>;
    };

const TIMEOUT_MS = 15_000;

/** Envía el lead a POST /api/leads. Nunca lanza: devuelve un resultado tipado. */
export async function enviarLead(payload: LeadPayloadInput): Promise<EnvioResultado> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (res.ok) return { ok: true };
    if (res.status === 429) return { ok: false, causa: 'limite' };
    if (res.status === 400 || res.status === 422) {
      const body = (await res.json().catch(() => null)) as {
        error?: { fields?: Record<string, string> };
      } | null;
      return { ok: false, causa: 'validacion', campos: body?.error?.fields };
    }
    return { ok: false, causa: 'servidor' };
  } catch {
    return { ok: false, causa: 'red' };
  } finally {
    clearTimeout(timer);
  }
}
