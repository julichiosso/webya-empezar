// @vitest-environment node
import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import { faltaColumnaDemo, faltanColumnasParcial, SupabaseLeadRepository } from './supabase';
import { TTL_TOKEN_MS, type NuevoLead, type NuevoLeadParcial } from './types';

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

const PARCIAL: NuevoLeadParcial = {
  whatsapp: '+5491123456789',
  nombre_negocio: null,
  necesidades: ['otra'],
  necesidad_libre: 'Facturación electrónica',
  rubro: 'comercio',
  rubro_otro: null,
  modulos: [],
  objetivos: [],
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  ip_hash: 'h',
  user_agent: null,
  token_hash: 'a'.repeat(64),
};

/** Cliente falso para UPDATE: anota la cadena de filtros y devuelve la respuesta dada. */
function clienteUpdate(respuesta: { data?: unknown; error?: { code: string; message: string } }) {
  const llamadas: [string, ...unknown[]][] = [];
  const cadena = {
    eq: (...a: unknown[]) => (llamadas.push(['eq', ...a]), cadena),
    gte: (...a: unknown[]) => (llamadas.push(['gte', ...a]), cadena),
    not: (...a: unknown[]) => (llamadas.push(['not', ...a]), cadena),
    select: async (...a: unknown[]) => {
      llamadas.push(['select', ...a]);
      return { data: respuesta.data ?? null, error: respuesta.error ?? null };
    },
  };
  const client = {
    from: (tabla: string) => ({
      update: (valores: unknown) => (llamadas.push(['update', tabla, valores]), cadena),
    }),
  } as unknown as SupabaseClient;
  return { client, llamadas };
}

describe('SupabaseLeadRepository — lead parcial', () => {
  it('crearParcial inserta con estado "parcial" y solo el hash del token', async () => {
    const { client, insertados } = clienteFalso([{ data: { id: 'p1' } }]);
    const repo = new SupabaseLeadRepository('', '', client);
    expect(await repo.crearParcial(PARCIAL)).toEqual({ id: 'p1' });
    expect(insertados[0]).toEqual({ ...PARCIAL, estado: 'parcial' });
  });

  it('crearParcial: si la columna ciudad todavía no existe, guarda sin ella', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { client, insertados } = clienteFalso([
      { error: { code: 'PGRST204', message: "Could not find the 'ciudad' column of 'leads'" } },
      { data: { id: 'p3' } },
    ]);
    const repo = new SupabaseLeadRepository('', '', client);
    expect(await repo.crearParcial({ ...PARCIAL, ciudad: 'San Jorge' })).toEqual({ id: 'p3' });
    expect(insertados[0]).toMatchObject({ ciudad: 'San Jorge' });
    expect(insertados[1]).not.toHaveProperty('ciudad');
  });

  it('crearParcial: sin la migración avisa qué aplicar y falla (no hay fallback)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { client } = clienteFalso([
      { error: { code: 'PGRST204', message: "Could not find the 'necesidades' column" } },
    ]);
    const repo = new SupabaseLeadRepository('', '', client);
    await expect(repo.crearParcial(PARCIAL)).rejects.toThrow('PGRST204');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('leads_parcial_necesidades'));
  });

  it('crearParcial: si solo falta la columna demo, guarda sin demo', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { client, insertados } = clienteFalso([
      { error: { code: '42703', message: 'column "demo" does not exist' } },
      { data: { id: 'p2' } },
    ]);
    const repo = new SupabaseLeadRepository('', '', client);
    const demo = { paleta: 'brasa', cocina: 'cafe' };
    expect(await repo.crearParcial({ ...PARCIAL, demo })).toEqual({ id: 'p2' });
    expect(insertados[1]).not.toHaveProperty('demo');
  });

  it('completar es un solo UPDATE condicionado por id, hash, estado, plazo y rubro', async () => {
    const { client, llamadas } = clienteUpdate({ data: [{ id: 'l1' }] });
    const repo = new SupabaseLeadRepository('', '', client);
    const ahora = new Date('2026-10-30T12:00:00Z');
    const datos = { nombre_negocio: 'Luna', nombre: null, email: null, mensaje: 'Hola' };
    expect(await repo.completar('l1', 'b'.repeat(64), datos, ahora)).toBe('ok');
    expect(llamadas).toEqual([
      [
        'update',
        'leads',
        {
          ...datos,
          estado: 'nuevo',
          completado_at: ahora.toISOString(),
          token_hash: null,
        },
      ],
      ['eq', 'id', 'l1'],
      ['eq', 'token_hash', 'b'.repeat(64)],
      ['eq', 'estado', 'parcial'],
      ['gte', 'created_at', new Date(ahora.getTime() - TTL_TOKEN_MS).toISOString()],
      ['not', 'rubro', 'is', null],
      ['select', 'id'],
    ]);
  });

  it('completar sin filas afectadas → "no_encontrado"; con error → lanza', async () => {
    const vacio = new SupabaseLeadRepository('', '', clienteUpdate({ data: [] }).client);
    const datos = { nombre_negocio: 'Luna', nombre: null, email: null, mensaje: null };
    expect(await vacio.completar('l1', 'b'.repeat(64), datos, new Date())).toBe('no_encontrado');
    const roto = new SupabaseLeadRepository(
      '',
      '',
      clienteUpdate({ error: { code: '23514', message: 'check' } }).client,
    );
    await expect(roto.completar('l1', 'b'.repeat(64), datos, new Date())).rejects.toThrow('23514');
  });

  it('reconoce las columnas del lead parcial', () => {
    expect(
      faltanColumnasParcial({ code: '42703', message: 'column "token_hash" does not exist' }),
    ).toBe(true);
    expect(faltanColumnasParcial({ code: '42703', message: 'column "demo" does not exist' })).toBe(
      false,
    );
  });
});
