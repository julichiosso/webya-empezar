// @vitest-environment node
import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import { faltaColumnaDemo, SupabaseLeadRepository } from './supabase';
import type { NuevoLead } from './types';

const LEAD: NuevoLead = {
  nombre: 'Ana',
  email: null,
  whatsapp: '+5491123456789',
  nombre_negocio: 'Lo de Tito',
  rubro: 'gastronomia',
  rubro_otro: null,
  modulos: ['carta_qr'],
  objetivos: [],
  mensaje: null,
  origen: 'demo_gastronomia',
  demo: { paleta: 'pileta', cocina: 'parrilla' },
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  ip_hash: 'h',
  user_agent: null,
};

/** Cliente falso: devuelve en orden las respuestas dadas y anota lo que se intentó insertar. */
function clienteFalso(respuestas: { data?: unknown; error?: { code: string; message: string } }[]) {
  const insertados: unknown[] = [];
  const client = {
    from: () => ({
      insert: (fila: unknown) => {
        insertados.push(fila);
        const r = respuestas.shift() ?? { data: { id: 'x' } };
        return {
          select: () => ({
            single: async () => ({ data: r.data ?? null, error: r.error ?? null }),
          }),
        };
      },
    }),
  } as unknown as SupabaseClient;
  return { client, insertados };
}

describe('SupabaseLeadRepository', () => {
  it('guarda demo y origen tal cual', async () => {
    const { client, insertados } = clienteFalso([{ data: { id: 'l1' } }]);
    const repo = new SupabaseLeadRepository('', '', client);
    expect(await repo.crear(LEAD)).toEqual({ id: 'l1' });
    expect(insertados[0]).toMatchObject({ demo: LEAD.demo, origen: 'demo_gastronomia' });
  });

  it('si la columna demo todavía no existe, guarda el lead sin demo (no se pierde)', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { client, insertados } = clienteFalso([
      { error: { code: 'PGRST204', message: "Could not find the 'demo' column of 'leads'" } },
      { data: { id: 'l2' } },
    ]);
    const repo = new SupabaseLeadRepository('', '', client);
    expect(await repo.crear(LEAD)).toEqual({ id: 'l2' });
    expect(insertados).toHaveLength(2);
    expect(insertados[1]).not.toHaveProperty('demo');
  });

  it('cualquier otro error se informa (no se reintenta a ciegas)', async () => {
    const { client, insertados } = clienteFalso([
      { error: { code: '23514', message: 'violates check constraint' } },
    ]);
    const repo = new SupabaseLeadRepository('', '', client);
    await expect(repo.crear(LEAD)).rejects.toThrow('23514');
    expect(insertados).toHaveLength(1);
  });

  it('reconoce solo el error de la columna demo', () => {
    expect(faltaColumnaDemo({ code: '42703', message: 'column "demo" does not exist' })).toBe(true);
    expect(faltaColumnaDemo({ code: '42703', message: 'column "otra" does not exist' })).toBe(
      false,
    );
  });
});
