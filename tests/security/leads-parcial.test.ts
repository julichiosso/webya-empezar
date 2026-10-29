// @vitest-environment node
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { NECESIDAD_IDS } from '@/config/necesidades';
import { LIMITES } from '@/content/leads';

// Verificación estática de la migración del lead parcial y de la vista "a medida": corre siempre.
const dir = resolve(process.cwd(), 'supabase/migrations');
const leer = (f: string) => readFileSync(resolve(dir, f), 'utf8').replace(/\r\n/g, '\n');
const nombre = readdirSync(dir).find((f) => f.endsWith('_leads_parcial_necesidades.sql'));
if (!nombre) throw new Error('Falta la migración *_leads_parcial_necesidades.sql');
// Sin comentarios (las advertencias escritas no cuentan como código), en minúscula y en una línea.
const sql = leer(nombre).replace(/--.*$/gm, '').toLowerCase().replace(/\s+/g, ' ');

/**
 * Las migraciones ya aplicadas no se editan: una corrección va en una migración NUEVA. Si este test
 * falla, se cambió una migración vieja (revertilo y escribí una nueva).
 */
const MIGRACIONES_APLICADAS: Record<string, string> = {
  '20261028000000_create_leads.sql':
    '16090d07d51b54af4219f7dfcd86fccfdc827ae6d691aa951c199c2899228ea8',
  '20261028120000_leads_modulos.sql':
    'c24fb0859428666e3f79fb172bd90dfa4668a008e903a08d38999bcbf263c9d1',
  '20261029120000_pedidos.sql': '9b5ce5051c7669fc6fc464ab98ff871daf0f28ff3dc4dded193500c9bd645930',
  '20261029130000_leads_demo_origen.sql':
    'e7c150035ee984a955cbf0260c4fd955313e98974d8bc069392e22c50ec7ac65',
};

describe('migración leads_parcial_necesidades', () => {
  it.each(Object.entries(MIGRACIONES_APLICADAS))('no toca %s', (archivo, hash) => {
    expect(createHash('sha256').update(leer(archivo)).digest('hex')).toBe(hash);
  });

  it('agrega las columnas con sus límites (los mismos que valida el servidor)', () => {
    expect(sql).toContain("add column necesidades text[] not null default '{}'");
    expect(sql).toContain('add column necesidad_libre text');
    expect(sql).toContain('add column token_hash text');
    expect(sql).toContain('add column completado_at timestamptz');
    expect(sql).toContain(`check (cardinality(necesidades) <= ${LIMITES.necesidades})`);
    expect(LIMITES.necesidades).toBeGreaterThanOrEqual(NECESIDAD_IDS.length);
    expect(sql).toContain(
      `char_length(necesidad_libre) between ${LIMITES.necesidadLibreMin} and ${LIMITES.necesidadLibre}`,
    );
    expect(sql).toContain(`cardinality(modulos) <= ${LIMITES.modulosParcial}`);
  });

  it('solo guarda el hash del token (sha256 hex) y solo en leads parciales', () => {
    expect(sql).toContain("token_hash ~ '^[0-9a-f]{64}$' and estado = 'parcial'");
    expect(sql).not.toMatch(/add column token\b/);
  });

  it('nombre, negocio y rubro pueden faltar solo en un lead parcial', () => {
    for (const col of ['nombre', 'nombre_negocio', 'rubro']) {
      expect(sql).toMatch(new RegExp(`alter column ${col} drop not null`));
    }
    expect(sql).toContain(
      "check (estado = 'parcial' or (nombre_negocio is not null and rubro is not null))",
    );
  });

  it('el check de módulos se recrea NOT VALID (no invalida leads viejos)', () => {
    expect(sql).toContain('drop constraint if exists leads_modulos_cantidad_check');
    expect(sql).toMatch(/add constraint leads_modulos_cantidad_check check \(.*\) not valid;/);
  });

  it('no crea políticas ni concede permisos a roles públicos', () => {
    expect(sql).not.toMatch(/create\s+policy/);
    expect(sql).not.toMatch(/grant\s/);
    expect(sql).not.toMatch(/disable row level security/);
  });
});

describe('vista leads_a_medida_resumen', () => {
  const vista = sql.slice(sql.indexOf('create view public.leads_a_medida_resumen'));

  it('existe, es security_invoker y lee solo de leads', () => {
    expect(vista).toMatch(
      /^create view public\.leads_a_medida_resumen with \(security_invoker = true\) as /,
    );
    expect(vista).toContain('from public.leads l');
  });

  it('le quita todos los permisos a anon y authenticated', () => {
    expect(sql).toMatch(
      /revoke all on table public\.leads_a_medida_resumen from public, anon, authenticated;/,
    );
  });

  it('agrupa por tema (en el orden pedido, con "otros" al final) y por rubro', () => {
    const temas = [...vista.matchAll(/then '([a-z_]+)'/g)].map((m) => m[1]);
    expect(temas).toEqual([
      'stock_inventario',
      'facturacion',
      'delivery_envios',
      'turnos_agenda',
      'pagos_cobros',
      'clientes_fidelizacion',
      'reportes_ventas',
      'automatizacion_whatsapp',
    ]);
    expect(vista).toContain("else 'otros'");
    expect(vista).toContain('group by tema, rubro');
    expect(vista).toContain('count(*)');
    expect(vista).toContain('(array_agg(necesidad_libre order by created_at desc))[1:5]');
  });
});
