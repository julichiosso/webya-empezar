import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { LeadRepository, NuevoLead } from './types';

/**
 * Repositorio sobre Supabase (Postgres). Usa la SERVICE ROLE key, que se salta RLS: por eso
 * solo existe en el servidor. La tabla niega todo acceso a `anon`/`authenticated`.
 */
export class SupabaseLeadRepository implements LeadRepository {
  private readonly client: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async crear(lead: NuevoLead): Promise<{ id: string }> {
    const { data, error } = await this.client.from('leads').insert(lead).select('id').single();
    if (error) throw new Error(`Supabase insert falló: ${error.code ?? ''} ${error.message}`);
    return { id: (data as { id: string }).id };
  }

  async contarRecientesPorIp(ipHash: string, desde: Date): Promise<number> {
    const { count, error } = await this.client
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', desde.toISOString());
    if (error) throw new Error(`Supabase count falló: ${error.code ?? ''} ${error.message}`);
    return count ?? 0;
  }
}
