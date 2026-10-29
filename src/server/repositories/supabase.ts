import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { LeadRepository, NuevoLead } from './types';

/** PostgREST (PGRST204) o Postgres (42703) avisando que la columna `demo` no existe todavía. */
export function faltaColumnaDemo(error: { code?: string; message?: string }): boolean {
  return (
    (error.code === 'PGRST204' || error.code === '42703') && /\bdemo\b/.test(error.message ?? '')
  );
}

/**
 * Repositorio sobre Supabase (Postgres). Usa la SERVICE ROLE key, que se salta RLS: por eso
 * solo existe en el servidor. La tabla niega todo acceso a `anon`/`authenticated`.
 */
export class SupabaseLeadRepository implements LeadRepository {
  private readonly client: SupabaseClient;

  constructor(url: string, serviceRoleKey: string, client?: SupabaseClient) {
    this.client =
      client ??
      createClient(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
  }

  async crear(lead: NuevoLead): Promise<{ id: string }> {
    const { data, error } = await this.client.from('leads').insert(lead).select('id').single();
    if (error && lead.demo !== undefined && faltaColumnaDemo(error)) {
      // Transición: el código llegó antes que la migración leads_demo_origen. No se pierde el
      // lead: se guarda sin `demo` y queda el aviso en el log para aplicar la migración.
      console.warn('[leads] Falta la columna "demo": aplicá la migración leads_demo_origen.');
      const sinDemo: NuevoLead = { ...lead };
      delete sinDemo.demo;
      return this.crear(sinDemo);
    }
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
