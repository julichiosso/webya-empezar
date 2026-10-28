/**
 * Fila de la tabla `leads` (ver supabase/migrations). Es el contrato común de todas las
 * implementaciones de LeadRepository.
 *
 * TODO(multi-tenant): cuando WebYa sea plataforma, agregar `tenant_id uuid` acá, en la
 * migración y filtrar por tenant en cada consulta del repositorio.
 */
export interface LeadRow {
  id: string;
  created_at: string;
  nombre: string;
  email: string | null;
  /** E.164 normalizado, p. ej. +5491123456789. */
  whatsapp: string;
  nombre_negocio: string;
  rubro: string;
  rubro_otro: string | null;
  objetivos: string[];
  mensaje: string | null;
  origen: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  estado: string;
  ip_hash: string;
  user_agent: string | null;
}

/** Lo que aporta el servidor al crear un lead; id, fecha, estado y origen los define el repositorio. */
export type NuevoLead = Omit<LeadRow, 'id' | 'created_at' | 'estado' | 'origen'> & {
  origen?: string;
};

export interface LeadRepository {
  crear(lead: NuevoLead): Promise<{ id: string }>;
  /** Cuántos leads guardó esa IP (hasheada) desde la fecha dada. Alimenta el rate limit. */
  contarRecientesPorIp(ipHash: string, desde: Date): Promise<number>;
}

export const ESTADO_INICIAL_LEAD = 'nuevo';
export const ORIGEN_POR_DEFECTO = 'instagram';

/** Completa los campos que define el repositorio (comunes a memoria y archivo). */
export function aFila(lead: NuevoLead, id: string, ahora: Date): LeadRow {
  return {
    ...lead,
    id,
    created_at: ahora.toISOString(),
    origen: lead.origen ?? ORIGEN_POR_DEFECTO,
    estado: ESTADO_INICIAL_LEAD,
  };
}
