import { MENSAJES_API_LEAD } from '@/content/leads';
import { getEnv } from '../env';
import { getNotificationService } from '../notifications';
import { crearBurstLimiter, type BurstLimiter } from '../rate-limit';
import { getLeadRepository } from '../repositories';
import type { HandlerDeps } from './handler';

// Ráfagas en memoria por instancia, por IP (hasheada). Se crea al primer request, con el valor
// del env, y la comparten POST /api/leads y PATCH /api/leads/[id].
let burst: BurstLimiter | undefined;

/** Dependencias reales de los route handlers de leads. Lanza si la configuración es inválida. */
export function getLeadHandlerDeps(): HandlerDeps {
  const env = getEnv();
  burst ??= crearBurstLimiter(env.RATE_LIMIT_BURST_PER_MINUTE, 60_000);
  return { repo: getLeadRepository(), notifier: getNotificationService(), env, burst };
}

/** Configuración inválida (instrumentation.ts debería haberlo frenado al arrancar): 500 genérico. */
export function errorDeConfiguracion(e: unknown): Response {
  console.error('[leads] configuración inválida', e instanceof Error ? e.message : 'error');
  return Response.json(
    { error: { code: 'INTERNAL_ERROR', message: MENSAJES_API_LEAD.INTERNAL_ERROR } },
    { status: 500, headers: { 'Cache-Control': 'no-store' } },
  );
}
