import { errorDeConfiguracion, getLeadHandlerDeps } from '@/server/leads/deps';
import { handleCompletarLead, type HandlerDeps } from '@/server/leads/handler';

/** Completa un lead parcial: { token, nombreNegocio, nombre?, email?, mensaje? }. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let deps: HandlerDeps;
  try {
    deps = getLeadHandlerDeps();
  } catch (e) {
    return errorDeConfiguracion(e);
  }
  const { id } = await params;
  return handleCompletarLead(request, id, deps);
}
