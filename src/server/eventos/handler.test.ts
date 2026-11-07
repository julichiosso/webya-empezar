// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { crearBurstLimiter } from '../rate-limit';
import { handleEvento, type EventosDeps, type FilaEvento } from './handler';

const valido = { nombre: 'rubro_elegido', sesion: 'abc12345', ruta: '/empezar', props: { rubro: 'comercio' } };

function pedido(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/eventos', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.7', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

let guardados: FilaEvento[];
let deps: EventosDeps;

beforeEach(() => {
  guardados = [];
  deps = {
    repo: { guardar: async (e) => void guardados.push(e) },
    burst: crearBurstLimiter(5, 60_000),
    salt: 'sal-de-test-suficientemente-larga',
  };
});

describe('POST /api/eventos', () => {
  it('guarda un evento de la lista cerrada', async () => {
    const r = await handleEvento(pedido(valido), deps);
    expect(r.status).toBe(204);
    expect(guardados).toEqual([valido]);
  });

  it.each([
    ['nombre fuera de la lista', { ...valido, nombre: 'inventado' }],
    ['sesión con forma rara', { ...valido, sesion: '<script>' }],
    ['ruta con query', { ...valido, ruta: '/ver?d=abc' }],
    ['ruta con hash', { ...valido, ruta: '/ver#abc' }],
    ['demasiadas props', { ...valido, props: Object.fromEntries(Array.from({ length: 9 }, (_, i) => [`k${i}`, 1])) }],
    ['prop con un objeto', { ...valido, props: { a: { b: 1 } } }],
    ['texto largo en una prop', { ...valido, props: { a: 'x'.repeat(81) } }],
  ])('rechaza: %s', async (_, cuerpo) => {
    const r = await handleEvento(pedido(cuerpo), deps);
    expect(r.status).toBe(400);
    expect(guardados).toEqual([]);
  });

  it('rechaza otro content-type, pedidos de otro sitio y cuerpos grandes', async () => {
    expect((await handleEvento(pedido(valido, { 'content-type': 'text/plain' }), deps)).status).toBe(415);
    expect((await handleEvento(pedido(valido, { 'sec-fetch-site': 'cross-site' }), deps)).status).toBe(403);
    expect((await handleEvento(pedido('x'.repeat(3000)), deps)).status).toBe(413);
    expect((await handleEvento(pedido('{no es json'), deps)).status).toBe(400);
  });

  it('corta las ráfagas por IP', async () => {
    for (let i = 0; i < 5; i++) await handleEvento(pedido(valido), deps);
    expect((await handleEvento(pedido(valido), deps)).status).toBe(429);
  });

  it('si la base falla, a la persona no le pasa nada', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deps.repo = { guardar: () => Promise.reject(new Error('sin tabla')) };
    expect((await handleEvento(pedido(valido), deps)).status).toBe(204);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
