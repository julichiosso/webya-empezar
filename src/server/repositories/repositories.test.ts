// @vitest-environment node
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileLeadRepository } from './file';
import { MemoryLeadRepository } from './memory';
import type { LeadRepository, NuevoLead } from './types';

const base: NuevoLead = {
  nombre: 'Ana',
  email: null,
  whatsapp: '+5491123456789',
  nombre_negocio: 'Luna',
  rubro: 'comercio',
  rubro_otro: null,
  objetivos: ['vender_online'],
  mensaje: null,
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  ip_hash: 'hash-a',
  user_agent: null,
};

let dir: string;
beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'webya-leads-'));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

// Las dos implementaciones deben comportarse igual: es lo que las hace intercambiables.
const implementaciones: [string, (ahora: () => Date) => LeadRepository][] = [
  ['memoria', (ahora) => new MemoryLeadRepository(ahora)],
  [
    'archivo',
    (ahora) => new FileLeadRepository(relative(process.cwd(), join(dir, 'leads.json')), ahora),
  ],
];

describe.each(implementaciones)('LeadRepository (%s)', (_nombre, crear) => {
  it('crea leads con id, fecha, estado "nuevo" y origen "instagram"', async () => {
    const repo = crear(() => new Date('2026-10-28T12:00:00Z'));
    const { id } = await repo.crear(base);
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    const { id: otro } = await repo.crear(base);
    expect(otro).not.toBe(id);
  });

  it('cuenta los leads recientes por ip_hash dentro de la ventana', async () => {
    let t = new Date('2026-10-28T12:00:00Z');
    const repo = crear(() => t);
    await repo.crear(base);
    t = new Date('2026-10-28T12:05:00Z');
    await repo.crear(base);
    await repo.crear({ ...base, ip_hash: 'hash-b' });

    const desde = new Date('2026-10-28T12:02:00Z');
    expect(await repo.contarRecientesPorIp('hash-a', desde)).toBe(1);
    expect(await repo.contarRecientesPorIp('hash-a', new Date('2026-10-28T11:00:00Z'))).toBe(2);
    expect(await repo.contarRecientesPorIp('hash-b', desde)).toBe(1);
    expect(await repo.contarRecientesPorIp('otro', desde)).toBe(0);
  });
});

describe('FileLeadRepository', () => {
  it('persiste en un JSON legible con todos los campos', async () => {
    const ruta = join(dir, 'datos', 'leads.json');
    const repo = new FileLeadRepository(relative(process.cwd(), ruta));
    const { id } = await repo.crear({ ...base, utm_source: 'instagram' });
    const guardado = JSON.parse(await readFile(ruta, 'utf8')) as Record<string, unknown>[];
    expect(guardado).toHaveLength(1);
    expect(guardado[0]).toMatchObject({
      id,
      estado: 'nuevo',
      origen: 'instagram',
      utm_source: 'instagram',
      objetivos: ['vender_online'],
    });
  });

  it('no pierde leads con escrituras simultáneas', async () => {
    const ruta = join(dir, 'leads.json');
    const repo = new FileLeadRepository(relative(process.cwd(), ruta));
    await Promise.all(
      Array.from({ length: 20 }, (_, i) => repo.crear({ ...base, nombre: `n${i}` })),
    );
    const guardado = JSON.parse(await readFile(ruta, 'utf8')) as unknown[];
    expect(guardado).toHaveLength(20);
  });
});
