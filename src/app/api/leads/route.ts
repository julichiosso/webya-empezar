import { getEnv } from '@/server/env';
import { handleCreateLead, type HandlerDeps } from '@/server/leads/handler';
import { getNotificationService } from '@/server/notifications';
import { crearBurstLimiter } from '@/server/rate-limit';
import { getLeadRepository } from '@/server/repositories';

// Ráfagas en memoria por instancia: máx. 20 intentos por minuto y por IP (hasheada).
const burst = crearBurstLimiter(20, 60_000);

export async function POST(request: Request) {
  let deps: HandlerDeps;
  try {
    deps = {
      repo: getLeadRepository(),
      notifier: getNotificationService(),
      env: getEnv(),
      burst,
    };
  } catch (e) {
    // Configuración inválida (instrumentation.ts debería haberlo frenado al arrancar).
    console.error('[leads] configuración inválida', e instanceof Error ? e.message : 'error');
    return Response.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'No pudimos guardar tus datos. Probá de nuevo en un momento.',
        },
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  return handleCreateLead(request, deps);
}
