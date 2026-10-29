// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MENSAJES_API_LEAD, MENSAJES_LEAD } from '@/content/leads';
import type { NotificationService } from '../notifications';
import { crearBurstLimiter } from '../rate-limit';
import { MemoryLeadRepository } from '../repositories/memory';
import { TTL_TOKEN_MS } from '../repositories/types';
import { handleCompletarLead, handleCreateLead, type HandlerDeps } from './handler';
import { hashToken } from './token';

const IP = '203.0.113.7';
const SALT = 'sal-de-test-suficientemente-larga';
const T0 = new Date('2026-10-30T12:00:00Z');

const parcial = {
  parcial: true,
  whatsapp: '011 15 2345 6789',
  necesidades: ['vender', 'otra'],
  necesidadLibre: 'Llevar el stock de dos locales',
  rubro: 'comercio',
  modulos: ['catalogo'],
  website: '',
  utm_source: 'instagram',
};

const completar = {
  nombreNegocio: 'Luna Deco',
  nombre: 'Ana Pérez',
  email: 'ana@luna.com',
  mensaje: 'Escribime a la tarde',
};

function peticion(
  body: unknown,
  {
    metodo = 'POST',
    ruta = '/api/leads',
    ip = IP,
  }: { metodo?: string; ruta?: string; ip?: string } = {},
) {
  return new Request(`http://localhost${ruta}`, {
    method: metodo,
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, 'user-agent': 'test' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

let ahora: Date;
let repo: MemoryLeadRepository;
let notifier: NotificationService & {
  nuevoLead: ReturnType<typeof vi.fn>;
  nuevoLeadParcial: ReturnType<typeof vi.fn>;
};
let deps: HandlerDeps;

beforeEach(() => {
  ahora = T0;
  repo = new MemoryLeadRepository(() => ahora);
  notifier = {
    nuevoLead: vi.fn().mockResolvedValue(undefined),
    nuevoLeadParcial: vi.fn().mockResolvedValue(undefined),
  };
  deps = {
    repo,
    notifier,
    env: { IP_HASH_SALT: SALT, RATE_LIMIT_MAX: 3, RATE_LIMIT_WINDOW_SECONDS: 600 },
    burst: crearBurstLimiter(20, 60_000),
    ahora: () => ahora,
  };
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

async function crearParcial(body: unknown = parcial) {
  const res = await handleCreateLead(peticion(body), deps);
  return { res, body: (await res.json()) as { ok: boolean; id: string; token: string } };
}

function patch(id: string, body: unknown, ip = IP) {
  return handleCompletarLead(
    peticion(body, { metodo: 'PATCH', ruta: `/api/leads/${id}`, ip }),
    id,
    deps,
  );
}

describe('POST /api/leads con parcial: true', () => {
  it('guarda el lead parcial y devuelve id y token; en la base queda solo el hash', async () => {
    const { res, body } = await crearParcial();
    expect(res.status).toBe(201);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(body.ok).toBe(true);
    expect(body.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(body.token).toMatch(/^[A-Za-z0-9_-]{43}$/);

    const lead = repo.leads[0]!;
    expect(lead).toMatchObject({
      id: body.id,
      estado: 'parcial',
      whatsapp: '+5491123456789',
      necesidades: ['vender', 'otra'],
      necesidad_libre: 'Llevar el stock de dos locales',
      rubro: 'comercio',
      modulos: ['catalogo'],
      nombre: null,
      nombre_negocio: null,
      utm_source: 'instagram',
      completado_at: null,
    });
    expect(lead.token_hash).toBe(hashToken(body.token));
    expect(JSON.stringify(lead)).not.toContain(body.token);
    expect(JSON.stringify(lead)).not.toContain(IP);
  });

  it('alcanza con el WhatsApp', async () => {
    const { res } = await crearParcial({ parcial: true, whatsapp: '11 2345 6789' });
    expect(res.status).toBe(201);
    expect(repo.leads[0]).toMatchObject({
      necesidades: [],
      necesidad_libre: null,
      rubro: null,
      modulos: [],
    });
  });

  it('sanea el texto libre (HTML, control) conservando saltos de línea', async () => {
    await crearParcial({
      ...parcial,
      necesidadLibre: '<b>Facturar</b>\u0007 y\n\n\n\ncobrar <script>x</script>',
    });
    expect(repo.leads[0]?.necesidad_libre).toBe('Facturar y\n\ncobrar x');
  });

  it('valida: "otra" sin texto, texto largo o WhatsApp inválido → 400 con el campo', async () => {
    const casos: [Record<string, unknown>, string, string][] = [
      [{ necesidadLibre: '' }, 'necesidadLibre', MENSAJES_LEAD.necesidadLibreVacia],
      [{ necesidadLibre: 'x'.repeat(501) }, 'necesidadLibre', MENSAJES_LEAD.hastaCaracteres(500)],
      [{ whatsapp: '12345' }, 'whatsapp', MENSAJES_LEAD.whatsappInvalido],
      [{ necesidades: ['volar'] }, 'necesidades', MENSAJES_LEAD.necesidadInexistente],
    ];
    for (const [cambio, campo, mensaje] of casos) {
      const res = await handleCreateLead(peticion({ ...parcial, ...cambio }), deps);
      expect(res.status, campo).toBe(400);
      const body = (await res.json()) as { error: { fields: Record<string, string> } };
      expect(body.error.fields[campo]).toBe(mensaje);
    }
    expect(repo.leads).toHaveLength(0);
  });

  it('avisa del lead parcial con el WhatsApp, las necesidades y el texto libre', async () => {
    const { body } = await crearParcial();
    expect(notifier.nuevoLeadParcial).toHaveBeenCalledOnce();
    expect(notifier.nuevoLeadParcial.mock.calls[0]?.[0]).toEqual({
      id: body.id,
      whatsapp: '+5491123456789',
      necesidades: ['vender', 'otra'],
      necesidad_libre: 'Llevar el stock de dos locales',
      rubro: 'comercio',
      rubro_otro: null,
      modulos: ['catalogo'],
    });
    expect(notifier.nuevoLead).not.toHaveBeenCalled();
  });

  it('si el aviso falla igual responde 201', async () => {
    notifier.nuevoLeadParcial.mockRejectedValueOnce(new Error('caído'));
    expect((await crearParcial()).res.status).toBe(201);
  });

  it('honeypot: responde como éxito (con id y token falsos) pero no guarda ni avisa', async () => {
    const { res, body } = await crearParcial({ ...parcial, website: 'http://spam.example' });
    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(repo.leads).toHaveLength(0);
    expect(notifier.nuevoLeadParcial).not.toHaveBeenCalled();
  });

  it('rate limit por IP: el parcial cuenta igual que un lead completo', async () => {
    for (let i = 0; i < 3; i++) expect((await crearParcial()).res.status).toBe(201);
    const res = await handleCreateLead(peticion(parcial), deps);
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBe('600');
    expect(repo.leads).toHaveLength(3);
  });

  it('frena ráfagas de intentos inválidos', async () => {
    deps = { ...deps, burst: crearBurstLimiter(2, 60_000) };
    const estados: number[] = [];
    for (let i = 0; i < 4; i++) {
      estados.push((await handleCreateLead(peticion({ ...parcial, whatsapp: '1' }), deps)).status);
    }
    expect(estados).toEqual([400, 400, 429, 429]);
  });
});

describe('PATCH /api/leads/[id]', () => {
  it('completa el lead con el token: pasa a "nuevo" y borra el hash', async () => {
    const { body } = await crearParcial();
    ahora = new Date(T0.getTime() + 60_000);
    const res = await patch(body.id, { token: body.token, ...completar });
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toEqual({ ok: true });
    expect(repo.leads[0]).toMatchObject({
      estado: 'nuevo',
      nombre_negocio: 'Luna Deco',
      nombre: 'Ana Pérez',
      email: 'ana@luna.com',
      mensaje: 'Escribime a la tarde',
      token_hash: null,
      completado_at: ahora.toISOString(),
      // Lo del parcial se conserva.
      whatsapp: '+5491123456789',
      necesidades: ['vender', 'otra'],
    });
  });

  it('nombre, mail y mensaje son opcionales (quedan en null)', async () => {
    const { body } = await crearParcial();
    const res = await patch(body.id, { token: body.token, nombreNegocio: 'Luna', nombre: '' });
    expect(res.status).toBe(200);
    expect(repo.leads[0]).toMatchObject({ nombre: null, email: null, mensaje: null });
  });

  it('sin nombre del negocio: 400 con el campo', async () => {
    const { body } = await crearParcial();
    const res = await patch(body.id, { token: body.token, nombreNegocio: '' });
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: { code: string; fields: Record<string, string> } };
    expect(json.error.code).toBe('VALIDATION_ERROR');
    expect(json.error.fields.nombreNegocio).toBe(MENSAJES_LEAD.nombreNegocioCorto);
    expect(repo.leads[0]?.estado).toBe('parcial');
  });

  async function esNoEncontrado(res: Response) {
    expect(res.status).toBe(404);
    const json = (await res.json()) as { error: { code: string; message: string } };
    expect(json.error).toEqual({ code: 'NOT_FOUND', message: MENSAJES_API_LEAD.NOT_FOUND });
  }

  it('token equivocado → 404 genérico', async () => {
    const { body } = await crearParcial();
    await esNoEncontrado(await patch(body.id, { token: 'b'.repeat(43), ...completar }));
    expect(repo.leads[0]?.estado).toBe('parcial');
  });

  it('id inexistente, id que no es uuid o token con forma inválida → el mismo 404', async () => {
    const { body } = await crearParcial();
    await esNoEncontrado(
      await patch('00000000-0000-4000-8000-000000000000', { token: body.token, ...completar }),
    );
    await esNoEncontrado(await patch('no-es-un-uuid', { token: body.token, ...completar }));
    await esNoEncontrado(await patch(body.id, { token: 'corto', ...completar }));
  });

  it('token vencido (más de TTL_TOKEN_MS) → 404', async () => {
    const { body } = await crearParcial();
    ahora = new Date(T0.getTime() + TTL_TOKEN_MS + 1000);
    await esNoEncontrado(await patch(body.id, { token: body.token, ...completar }));
    expect(repo.leads[0]?.estado).toBe('parcial');
  });

  it('un token sirve una sola vez: la segunda vez → 404 y no pisa los datos', async () => {
    const { body } = await crearParcial();
    expect((await patch(body.id, { token: body.token, ...completar })).status).toBe(200);
    await esNoEncontrado(await patch(body.id, { token: body.token, nombreNegocio: 'Otro' }));
    expect(repo.leads[0]?.nombre_negocio).toBe('Luna Deco');
  });

  it('un lead parcial sin rubro no se puede completar (lo exige la base) → 404', async () => {
    const { body } = await crearParcial({ parcial: true, whatsapp: '11 2345 6789' });
    await esNoEncontrado(await patch(body.id, { token: body.token, ...completar }));
  });

  it('honeypot: responde ok pero no toca el lead', async () => {
    const { body } = await crearParcial();
    const res = await patch(body.id, { token: body.token, ...completar, website: 'spam' });
    expect(res.status).toBe(200);
    expect(repo.leads[0]?.estado).toBe('parcial');
  });

  it('sanea antes de validar', async () => {
    const { body } = await crearParcial();
    await patch(body.id, {
      token: body.token,
      nombreNegocio: '  <b>Luna</b>  Deco ',
      mensaje: '<i>Hola</i>\n\n\n\nchau',
    });
    expect(repo.leads[0]).toMatchObject({ nombre_negocio: 'Luna Deco', mensaje: 'Hola\n\nchau' });
  });

  it('frena ráfagas (también a quien prueba ids)', async () => {
    deps = { ...deps, burst: crearBurstLimiter(2, 60_000) };
    const estados: number[] = [];
    for (let i = 0; i < 4; i++) {
      estados.push((await patch('no-es-un-uuid', { token: 'x', nombreNegocio: 'x' })).status);
    }
    expect(estados).toEqual([404, 404, 429, 429]);
  });

  it('rechaza cuerpos que no son JSON, otro content-type o demasiado grandes', async () => {
    const { body } = await crearParcial();
    expect((await patch(body.id, '{no')).status).toBe(400);
    const textoPlano = new Request('http://localhost/api/leads/x', {
      method: 'PATCH',
      headers: { 'content-type': 'text/plain' },
      body: 'x',
    });
    expect((await handleCompletarLead(textoPlano, body.id, deps)).status).toBe(415);
    expect(
      (await patch(body.id, { token: body.token, nombreNegocio: 'L', mensaje: 'x'.repeat(20_000) }))
        .status,
    ).toBe(413);
  });

  it('falla del repositorio → 500 genérico, sin detalles', async () => {
    const { body } = await crearParcial();
    const roto = Object.assign(new MemoryLeadRepository(), {
      completar: async () => {
        throw new Error('db.supabase.co password=hunter2');
      },
    });
    const res = await handleCompletarLead(
      peticion({ token: body.token, ...completar }, { metodo: 'PATCH' }),
      body.id,
      { ...deps, repo: roto },
    );
    expect(res.status).toBe(500);
    expect(await res.text()).not.toMatch(/supabase|hunter2/);
  });
});
