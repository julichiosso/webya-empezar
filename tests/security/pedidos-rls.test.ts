// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ESTADOS_PEDIDO, MEDIOS_PAGO, MODALIDADES } from '@/domain/pedidos/types';
import { TRANSICIONES } from '@/domain/pedidos/estados';
import { PROPINAS } from '@/domain/pedidos/totales';
import { ORIGENES } from '@/config/origenes';

// Verificación estática de las migraciones de pedidos y de la columna demo de leads: corre siempre.
const dir = resolve(process.cwd(), 'supabase/migrations');
const archivo = (sufijo: string) => {
  const f = readdirSync(dir).find((n) => n.endsWith(sufijo));
  if (!f) throw new Error(`Falta la migración *${sufijo}`);
  return readFileSync(resolve(dir, f), 'utf8')
    .replace(/--.*$/gm, '')
    .toLowerCase()
    .replace(/\s+/g, ' ');
};
const pedidos = archivo('_pedidos.sql');
const leadsDemo = archivo('_leads_demo_origen.sql');

const TABLAS = [
  'tenants',
  'locales',
  'menu_categorias',
  'menu_productos',
  'menu_modificadores',
  'pedidos',
  'pedido_items',
  'pedido_eventos',
];

describe('migración de pedidos (multi-tenant)', () => {
  it.each(TABLAS)('crea %s', (t) => {
    expect(pedidos).toContain(`create table public.${t} (`);
  });

  it.each(TABLAS.filter((t) => t !== 'tenants'))('%s tiene tenant_id obligatorio', (t) => {
    const def = pedidos.slice(pedidos.indexOf(`create table public.${t} (`)).split(');')[0] ?? '';
    expect(def).toContain('tenant_id uuid not null references public.tenants (id)');
  });

  it('RLS activada y forzada, política restrictiva que niega y permisos revocados en TODAS', () => {
    const lista = pedidos.match(/foreach t in array array\[([^\]]+)\]/)?.[1] ?? '';
    for (const t of TABLAS) expect(lista).toContain(`'${t}'`);
    expect(pedidos).toContain('alter table public.%i enable row level security');
    expect(pedidos).toContain('alter table public.%i force row level security');
    expect(pedidos).toMatch(
      /as restrictive for all to anon, authenticated using \(false\) with check \(false\)/,
    );
    expect(pedidos).toContain('revoke all on table public.%i from anon, authenticated');
    expect(pedidos).not.toMatch(/grant\s+[^;]*\s+to\s+(anon|authenticated|public)/);
  });

  it('dinero en centavos: bigint, nunca numeric/float/money', () => {
    for (const col of [
      'precio',
      'precio_unitario',
      'subtotal',
      'propina',
      'envio',
      'total',
      'costo_envio',
    ]) {
      expect(pedidos).toMatch(new RegExp(`\\b${col} bigint not null`));
    }
    expect(pedidos).not.toMatch(/\b(numeric|decimal|real|double precision|money|float)\b/);
    expect(pedidos).toContain('check (total = subtotal + propina + envio)');
  });

  it('número de pedido único por tenant y función atómica sin acceso público', () => {
    expect(pedidos).toContain('unique (tenant_id, numero)');
    expect(pedidos).toContain('set ultimo_numero_pedido = ultimo_numero_pedido + 1');
    expect(pedidos).toContain(
      'revoke all on function public.siguiente_numero_pedido(uuid) from public, anon, authenticated',
    );
  });

  it('los checks de la base coinciden con el dominio (estados, modalidades, pagos, propinas)', () => {
    const lista = (xs: readonly (string | number)[]) =>
      xs.map((x) => (typeof x === 'number' ? String(x) : `'${x}'`)).join(', ');
    expect(pedidos).toContain(`check (estado in (${lista(ESTADOS_PEDIDO)}))`);
    expect(pedidos).toContain(`check (modalidad in (${lista(MODALIDADES)}))`);
    expect(pedidos).toContain(`check (medio_pago in (${lista(MEDIOS_PAGO)}))`);
    expect(pedidos).toContain(`check (propina_porcentaje in (${lista(PROPINAS)}))`);
  });

  it('la máquina de estados de la base tiene exactamente las transiciones del dominio', () => {
    const cuerpo = pedidos.slice(pedidos.indexOf('pedido_transicion_valida(desde text'));
    const pares = [...cuerpo.matchAll(/\('([a-z_]+)', '([a-z_]+)'\)/g)]
      .slice(0, 50)
      .map((m) => `${m[1]}>${m[2]}`);
    const delDominio = Object.entries(TRANSICIONES).flatMap(([d, hs]) =>
      hs.map((h) => `${d}>${h}`),
    );
    expect(new Set(pares.slice(0, delDominio.length))).toEqual(new Set(delDominio));
    expect(pedidos).toContain('before update of estado on public.pedidos');
  });
});

describe('migración leads: demo y origen', () => {
  it('agrega demo jsonb acotada a { paleta, cocina } de texto corto', () => {
    expect(leadsDemo).toContain('add column demo jsonb');
    expect(leadsDemo).toContain("demo - 'paleta' - 'cocina' = '{}'::jsonb");
    expect(leadsDemo).toContain("char_length(demo ->> 'paleta') between 1 and 20");
  });

  it('el origen queda cerrado a la misma lista que valida la API', () => {
    const lista = ORIGENES.map((o) => `'${o}'`).join(', ');
    expect(leadsDemo).toContain(`check (origen in (${lista}))`);
  });
});
