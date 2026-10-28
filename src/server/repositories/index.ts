import { getEnv, type ServerEnv } from '../env';
import { FileLeadRepository } from './file';
import { MemoryLeadRepository } from './memory';
import { SupabaseLeadRepository } from './supabase';
import type { LeadRepository } from './types';

export type { LeadRepository, LeadRow, NuevoLead } from './types';

/** Elige la implementación según LEAD_REPOSITORY. Intercambiables: misma interfaz. */
export function crearRepositorio(env: ServerEnv): LeadRepository {
  switch (env.LEAD_REPOSITORY) {
    case 'supabase':
      // env.ts ya garantizó que ambas variables existen.
      return new SupabaseLeadRepository(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);
    case 'memory':
      return new MemoryLeadRepository();
    case 'file':
      return new FileLeadRepository(env.LEADS_FILE_PATH);
  }
}

let instancia: LeadRepository | undefined;

export function getLeadRepository(): LeadRepository {
  instancia ??= crearRepositorio(getEnv());
  return instancia;
}
