import { MENSAJES_API_LEAD } from '@/content/leads';
import { getEnv } from '@/server/env';
import { handleCreateLead, type HandlerDeps } from '@/server/leads/handler';
import { getNotificationService } from '@/server/notifications';
import { crearBurstLimiter } from '@/server/rate-limit';
import { getLeadRepository } from '@/server/repositories';

// Ráfagas en memoria por instancia, por IP (hasheada). Se crea al primer request, con el valor del env.
let burst: ReturnType<typeof crearBurstLimiter> | undefined;

export async function POST(request: Request) {
  let deps: HandlerDeps;
  try {
    const env = getEnv();
    burst ??= crearBurstLimiter(env.RATE_LIMIT_BURST_PER_MINUTE, 60_000);
    deps = { repo: getLeadRepository(), notifier: getNotificationService(), env, burst };
  } catch (e) {
    // Configuración inválida (instrumentation.ts debería haberlo frenado al arrancar).
    console.error('[leads] configuración inválida', e instanceof Error ? e.message : 'error');
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: MENSAJES_API_LEAD.INTERNAL_ERROR } },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  return handleCreateLead(request, deps);
}
