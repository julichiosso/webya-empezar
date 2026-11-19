import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getEnv } from '../env';
import { crearBurstLimiter } from '../rate-limit';
import type { EventoRepository, EventosDeps, FilaEvento } from './handler';

/** La tabla todavía no existe (migración eventos): el embudo se apaga sin molestar a nadie. */
const faltaTabla = (code?: string) => code === 'PGRST205' || code === '42P01';

class SupabaseEventoRepository implements EventoRepository {
  private avisado = false;

  constructor(private readonly client: SupabaseClient) {}

  async guardar(evento: FilaEvento): Promise<void> {
    const { error } = await this.client.from('eventos').insert(evento);
    if (!error) return;
    if (faltaTabla(error.code)) {
      if (!this.avisado) console.warn('[eventos] Falta la tabla: aplicá la migración eventos.');
      this.avisado = true;
      return;
    }
    throw new Error(`Supabase insert falló: ${error.code ?? ''} ${error.message}`);
  }
}

/** Fuera de producción no se guarda nada: el embudo se prueba con los tests de la API. */
const sinGuardar: EventoRepository = { guardar: async () => undefined };

let deps: EventosDeps | undefined;

export function getEventosDeps(): EventosDeps {
  if (deps) return deps;
  const env = getEnv();
  deps = {
    repo:
      env.LEAD_REPOSITORY === 'supabase'
        ? new SupabaseEventoRepository(
            createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
              auth: { persistSession: false, autoRefreshToken: false },
            }),
          )
        : sinGuardar,
    // Una visita manda pocos eventos, pero detrás de una IP puede haber un barrio entero.
    burst: crearBurstLimiter(env.RATE_LIMIT_BURST_PER_MINUTE * 6, 60_000),
    salt: env.IP_HASH_SALT,
  };
  return deps;
}
