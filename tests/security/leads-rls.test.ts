// @vitest-environment node
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Todas las migraciones, en orden: una migración posterior no puede reabrir la tabla.
const dirMigraciones = resolve(process.cwd(), 'supabase/migrations');
const migracion = readdirSync(dirMigraciones)
  .filter((f) => f.endsWith('.sql'))
  .sort()
  .map((f) => readFileSync(resolve(dirMigraciones, f), 'utf8'))
  .join('\n');
// Sin comentarios: así las advertencias escritas en el SQL no cuentan como código.
const sql = migracion.replace(/--.*$/gm, '').toLowerCase();

describe('migración de leads (verificación estática, corre siempre)', () => {
  it('crea la tabla y los índices pedidos', () => {
    expect(sql).toContain('create table public.leads');
    expect(sql).toMatch(
      /create index leads_ip_hash_created_at_idx on public\.leads \(ip_hash, created_at\)/,
    );
    for (const columna of [
      'id uuid primary key default gen_random_uuid()',
      'created_at timestamptz',
      'objetivos      text[]'.replace(/\s+/g, ' '),
      'add column modulos text[] not null',
      "estado text not null default 'nuevo'",
      "origen text not null default 'instagram'",
      'ip_hash text not null',
      'user_agent text',
    ]) {
      expect(sql.replace(/\s+/g, ' ')).toContain(columna.replace(/\s+/g, ' '));
    }
  });

  it('activa Row Level Security y no define ninguna política sobre leads', () => {
    expect(sql).toContain('alter table public.leads enable row level security');
    expect(sql).not.toMatch(/create\s+policy[^;]*\bon\s+public\.leads\b/);
  });

  it('en ninguna tabla hay políticas que abran acceso: solo restrictivas que niegan', () => {
    const politicas = sql.match(/create\s+policy[^;']*/g) ?? [];
    for (const p of politicas) {
      expect(p, p).toMatch(/as\s+restrictive/);
      expect(p, p).toMatch(/using\s*\(\s*false\s*\)/);
    }
    expect(sql).not.toMatch(/using\s*\(\s*true\s*\)/);
  });

  it('quita todos los permisos a anon y authenticated', () => {
    expect(sql).toMatch(/revoke all on table public\.leads from anon, authenticated/);
  });

  it('no concede nada a roles públicos', () => {
    expect(sql).not.toMatch(/grant\s+.*\s+to\s+(anon|authenticated|public)/);
  });
});

// Verificación REAL contra un proyecto de Supabase: requiere credenciales de un proyecto de
// prueba con la migración aplicada. Sin ellas se omite (y el reporte final debe decirlo).
const url = process.env.SUPABASE_TEST_URL;
const anonKey = process.env.SUPABASE_TEST_ANON_KEY;
const serviceKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY;
const hayCredenciales = Boolean(url && anonKey && serviceKey);

describe.skipIf(!hayCredenciales)(
  'leads no es accesible con la clave pública (anon) — Supabase real',
  () => {
    const opts = { auth: { persistSession: false, autoRefreshToken: false } };

    it('anon no puede leer leads aunque existan filas', async () => {
      const admin = createClient(url!, serviceKey!, opts);
      const anon = createClient(url!, anonKey!, opts);
      const marca = `rls-probe-${randomUUID()}`;
      const { error: errInsert } = await admin.from('leads').insert({
        nombre: 'Prueba RLS',
        whatsapp: '+5491123456789',
        nombre_negocio: marca,
        rubro: 'otro',
        rubro_otro: 'prueba',
        modulos: ['formularios'],
        objetivos: ['que_me_contacten'],
        ip_hash: 'rls-probe',
      });
      expect(errInsert).toBeNull();
      try {
        const { data, error } = await anon.from('leads').select('*').eq('nombre_negocio', marca);
        // Sin permisos: error 42501. Con RLS sin políticas: lista vacía. Nunca la fila.
        expect(data ?? []).toHaveLength(0);
        if (error) expect(error.code).toBe('42501');
      } finally {
        await admin.from('leads').delete().eq('ip_hash', 'rls-probe');
      }
    });

    it('anon no puede insertar, modificar ni borrar', async () => {
      const anon = createClient(url!, anonKey!, opts);
      const insert = await anon.from('leads').insert({
        nombre: 'Intruso',
        whatsapp: '+5491123456789',
        nombre_negocio: 'Intruso SA',
        rubro: 'otro',
        modulos: ['x'],
        objetivos: ['x'],
        ip_hash: 'intruso',
      });
      expect(insert.error).not.toBeNull();
      const update = await anon
        .from('leads')
        .update({ estado: 'cliente' })
        .eq('ip_hash', 'x')
        .select();
      expect(update.data ?? []).toHaveLength(0);
      const del = await anon.from('leads').delete().eq('ip_hash', 'x').select();
      expect(del.data ?? []).toHaveLength(0);
    });
  },
);
