import { getEventosDeps } from '@/server/eventos/deps';
import { handleEvento } from '@/server/eventos/handler';

export async function POST(request: Request) {
  try {
    return await handleEvento(request, getEventosDeps());
  } catch (e) {
    // La medición nunca le rompe nada a nadie: el detalle queda en el log.
    console.error('[eventos] error interno', e instanceof Error ? e.message : 'error');
    return new Response(null, { status: 204 });
  }
}
