import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  ESTADO_INICIAL_LEAD,
  ESTADO_PARCIAL,
  esMismoNegocio,
  ORIGEN_POR_DEFECTO,
  soloConValor,
  TTL_TOKEN_MS,
  type CambiosParcial,
  type DatosCompletar,
  type LeadRepository,
  type NuevoLead,
  type NuevoLeadParcial,
  type ResultadoCompletar,
} from './types';

type ErrorDb = { code?: string; message?: string };

/** PostgREST (PGRST204) o Postgres (42703) avisando que una columna no existe todavía. */
function faltaColumna(error: ErrorDb, columnas: RegExp): boolean {
  return (
    (error.code === 'PGRST204' || error.code === '42703') && columnas.test(error.message ?? '')
  );
}

/** La columna `demo` (migración leads_demo_origen) todavía no existe. */
export function faltaColumnaDemo(error: ErrorDb): boolean {
  return faltaColumna(error, /\bdemo\b/);
}

/** La columna `ciudad` (migración leads_ciudad) todavía no existe. */
export function faltaColumnaCiudad(error: ErrorDb): boolean {
  return faltaColumna(error, /\bciudad\b/);
}

/** El origen todavía no está en la lista de la base (migración leads_origenes_crear). */
export function origenRechazado(error: ErrorDb): boolean {
  return error.code === '23514' && /leads_origen_check/.test(error.message ?? '');
}

/** Alguna columna del lead parcial (migración leads_parcial_necesidades) todavía no existe. */
export function faltanColumnasParcial(error: ErrorDb): boolean {
  return faltaColumna(error, /\b(necesidades|necesidad_libre|token_hash|completado_at)\b/);
}

const AVISO_MIGRACION_PARCIAL =
  '[leads] Faltan las columnas del lead parcial: aplicá la migración leads_parcial_necesidades.';

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

  /** Inserta y devuelve el id. Si falta la columna `demo`, guarda sin ella (no se pierde el lead). */
  private async insertar(
    fila: Record<string, unknown> & { demo?: unknown; ciudad?: unknown },
  ): Promise<{ id: string }> {
    const { data, error } = await this.client.from('leads').insert(fila).select('id').single();
    if (error && fila.ciudad !== undefined && faltaColumnaCiudad(error)) {
      // Igual que con `demo`: el código puede llegar antes que la migración leads_ciudad.
      console.warn('[leads] Falta la columna "ciudad": aplicá la migración leads_ciudad.');
      const sinCiudad = { ...fila };
      delete sinCiudad.ciudad;
      return this.insertar(sinCiudad);
    }
    if (error && fila.demo !== undefined && faltaColumnaDemo(error)) {
      // Transición: el código llegó antes que la migración leads_demo_origen. No se pierde el
      // lead: se guarda sin `demo` y queda el aviso en el log para aplicar la migración.
      console.warn('[leads] Falta la columna "demo": aplicá la migración leads_demo_origen.');
      const sinDemo = { ...fila };
      delete sinDemo.demo;
      return this.insertar(sinDemo);
    }
    if (error && fila.origen !== ORIGEN_POR_DEFECTO && origenRechazado(error)) {
      // El código llegó antes que la migración: el lead vale más que el dato de dónde vino.
      console.warn('[leads] Origen rechazado: aplicá la migración leads_origenes_crear.');
      return this.insertar({ ...fila, origen: ORIGEN_POR_DEFECTO });
    }
    if (error && faltanColumnasParcial(error)) console.warn(AVISO_MIGRACION_PARCIAL);
    if (error) throw new Error(`Supabase insert falló: ${error.code ?? ''} ${error.message}`);
    return { id: (data as { id: string }).id };
  }

  crear(lead: NuevoLead): Promise<{ id: string }> {
    return this.insertar(lead);
  }

  crearParcial(lead: NuevoLeadParcial): Promise<{ id: string }> {
    // Sin el lead parcial la base no admite nombre ni negocio vacíos: sin la migración no hay
    // fallback posible, se informa el error (y el aviso de arriba dice qué aplicar).
    return this.insertar({ ...lead, estado: ESTADO_PARCIAL });
  }

  async completar(
    id: string,
    tokenHash: string,
    datos: DatosCompletar,
    ahora: Date,
  ): Promise<ResultadoCompletar> {
    // Un solo UPDATE condicionado: no hay lectura previa ni carrera entre dos envíos del mismo
    // token (el segundo ya no encuentra estado 'parcial' ni el token_hash).
    const { data, error } = await this.client
      .from('leads')
      .update({
        ...datos,
        estado: ESTADO_INICIAL_LEAD,
        completado_at: ahora.toISOString(),
        token_hash: null,
      })
      .eq('id', id)
      .eq('token_hash', tokenHash)
      .eq('estado', ESTADO_PARCIAL)
      .gte('created_at', new Date(ahora.getTime() - TTL_TOKEN_MS).toISOString())
      // Un lead completo necesita rubro (check de la base): sin él no se completa.
      .not('rubro', 'is', null)
      .select('id');
    if (error && faltanColumnasParcial(error)) console.warn(AVISO_MIGRACION_PARCIAL);
    if (error) throw new Error(`Supabase update falló: ${error.code ?? ''} ${error.message}`);
    return Array.isArray(data) && data.length > 0 ? 'ok' : 'no_encontrado';
  }

  async renovarParcial(
    whatsapp: string,
    ipHash: string,
    desde: Date,
    cambios: CambiosParcial,
  ): Promise<{ id: string } | null> {
    const { data, error } = await this.client
      .from('leads')
      .select('id, nombre_negocio')
      .eq('whatsapp', whatsapp)
      .eq('ip_hash', ipHash)
      .eq('estado', ESTADO_PARCIAL)
      .gte('created_at', desde.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) throw new Error(`Supabase select falló: ${error.code ?? ''} ${error.message}`);
    const previo = (data as { id: string; nombre_negocio: string | null }[] | null)?.[0];
    if (!previo || !esMismoNegocio(previo.nombre_negocio, cambios.nombre_negocio)) return null;

    // Ciudad, demo y origen pueden no existir o no estar admitidos todavía: no se reenvían. Lo
    // importante del reenvío es el token nuevo y lo que eligió; el lead original no se toca más.
    const resto = { ...cambios };
    delete resto.ciudad;
    delete resto.demo;
    delete resto.origen;
    const { data: filas, error: errorUpdate } = await this.client
      .from('leads')
      .update(soloConValor(resto))
      .eq('id', previo.id)
      .eq('estado', ESTADO_PARCIAL)
      .select('id');
    if (errorUpdate) {
      throw new Error(`Supabase update falló: ${errorUpdate.code ?? ''} ${errorUpdate.message}`);
    }
    return Array.isArray(filas) && filas.length > 0 ? { id: previo.id } : null;
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
