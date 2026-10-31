// @vitest-environment node
import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileLeadRepository } from './file';
import { MemoryLeadRepository } from './memory';
import {
  TTL_TOKEN_MS,
  type DatosCompletar,
  type LeadRepository,
  type NuevoLead,
  type NuevoLeadParcial,
} from './types';

const base: NuevoLead = {
  nombre: 'Ana',
  email: null,
  whatsapp: '+5491123456789',
  nombre_negocio: 'Luna',
  rubro: 'comercio',
  rubro_otro: null,
  modulos: ['catalogo'],
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

const parcial: NuevoLeadParcial = {
  whatsapp: '+5491123456789',
  nombre_negocio: null,
  necesidades: ['vender'],
  necesidad_libre: 'Controlar el stock',
  rubro: 'comercio',
  rubro_otro: null,
  modulos: [],
  objetivos: [],
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  ip_hash: 'hash-a',
  user_agent: null,
  token_hash: 'f'.repeat(64),
};

const datos: DatosCompletar = {
  nombre_negocio: 'Luna',
  nombre: null,
  email: 'ana@luna.com',
  mensaje: null,
};

describe.each(implementaciones)('LeadRepository parcial (%s)', (_nombre, crear) => {
  const T0 = new Date('2026-10-30T12:00:00Z');
  const despues = (ms: number) => new Date(T0.getTime() + ms);

  it('crea el parcial con estado "parcial" y lo cuenta en el rate limit', async () => {
    const repo = crear(() => T0);
    const { id } = await repo.crearParcial(parcial);
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(await repo.contarRecientesPorIp('hash-a', despues(-1000))).toBe(1);
  });

  it('completa con el hash correcto y dentro del plazo, una sola vez', async () => {
    const repo = crear(() => T0);
    const { id } = await repo.crearParcial(parcial);
    expect(await repo.completar(id, 'e'.repeat(64), datos, despues(1000))).toBe('no_encontrado');
    expect(await repo.completar(id, parcial.token_hash, datos, despues(1000))).toBe('ok');
    expect(await repo.completar(id, parcial.token_hash, datos, despues(2000))).toBe(
      'no_encontrado',
    );
  });

  it('no completa vencido, con otro id, sin rubro ni un lead que no es parcial', async () => {
    const repo = crear(() => T0);
    const { id } = await repo.crearParcial(parcial);
    expect(await repo.completar(id, parcial.token_hash, datos, despues(TTL_TOKEN_MS + 1))).toBe(
      'no_encontrado',
    );
    expect(await repo.completar(randomUUID(), parcial.token_hash, datos, despues(1000))).toBe(
      'no_encontrado',
    );
    const sinRubro = await repo.crearParcial({ ...parcial, rubro: null });
    expect(await repo.completar(sinRubro.id, parcial.token_hash, datos, despues(1000))).toBe(
      'no_encontrado',
    );
    const completo = await repo.crear(base);
    expect(await repo.completar(completo.id, parcial.token_hash, datos, despues(1000))).toBe(
      'no_encontrado',
    );
  });
});

describe('FileLeadRepository', () => {
  it('guarda el parcial y lo completa en el JSON', async () => {
    const ruta = join(dir, 'leads.json');
    const t0 = new Date('2026-10-30T12:00:00Z');
    const repo = new FileLeadRepository(relative(process.cwd(), ruta), () => t0);
    const { id } = await repo.crearParcial(parcial);
    let guardado = JSON.parse(await readFile(ruta, 'utf8')) as Record<string, unknown>[];
    expect(guardado[0]).toMatchObject({
      id,
      estado: 'parcial',
      nombre: null,
      nombre_negocio: null,
      necesidades: ['vender'],
      necesidad_libre: 'Controlar el stock',
      token_hash: parcial.token_hash,
      completado_at: null,
    });
    const fin = new Date('2026-10-30T13:00:00Z');
    expect(await repo.completar(id, parcial.token_hash, datos, fin)).toBe('ok');
    guardado = JSON.parse(await readFile(ruta, 'utf8')) as Record<string, unknown>[];
    expect(guardado[0]).toMatchObject({
      estado: 'nuevo',
      nombre_negocio: 'Luna',
      email: 'ana@luna.com',
      token_hash: null,
      completado_at: fin.toISOString(),
      necesidades: ['vender'],
    });
  });

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
