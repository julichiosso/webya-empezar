import { errorDeConfiguracion, getLeadHandlerDeps } from '@/server/leads/deps';
import { handleCreateLead, type HandlerDeps } from '@/server/leads/handler';

export async function POST(request: Request) {
  let deps: HandlerDeps;
  try {
    deps = getLeadHandlerDeps();
  } catch (e) {
    return errorDeConfiguracion(e);
  }
  return handleCreateLead(request, deps);
}
