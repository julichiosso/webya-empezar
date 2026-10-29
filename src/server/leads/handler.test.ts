// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { crearBurstLimiter } from '../rate-limit';
import { MemoryLeadRepository } from '../repositories/memory';
import type { LeadRepository } from '../repositories/types';
import type { NotificationService } from '../notifications';
import { handleCreateLead, type HandlerDeps } from './handler';

const IP = '203.0.113.7';
const SALT = 'sal-de-test-suficientemente-larga';

const valido = {
  nombreNegocio: 'Peluquería Luna',
  nombre: 'Ana Pérez',
  whatsapp: '011 15 2345 6789',
  email: 'ana@luna.com',
  mensaje: 'Quiero turnos online',
  rubro: 'peluqueria_estetica',
  modulos: ['turnos', 'catalogo'],
  objetivos: ['recibir_turnos', 'mostrar_trabajos'],
  website: '',
  utm_source: 'instagram',
  utm_medium: 'bio',
  utm_campaign: 'lanzamiento',
};

function peticion(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/leads', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': IP,
      'user-agent': 'Mozilla/5.0 (iPhone) Instagram 300.0',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

let repo: MemoryLeadRepository;
let notifier: NotificationService & { nuevoLead: ReturnType<typeof vi.fn> };
let deps: HandlerDeps;

beforeEach(() => {
  repo = new MemoryLeadRepository();
  notifier = { nuevoLead: vi.fn().mockResolvedValue(undefined) };
  deps = {
    repo,
    notifier,
    env: { IP_HASH_SALT: SALT, RATE_LIMIT_MAX: 3, RATE_LIMIT_WINDOW_SECONDS: 600 },
    burst: crearBurstLimiter(20, 60_000),
  };
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

describe('POST /api/leads — envío válido', () => {
  it('guarda el lead con todos sus campos, UTM y teléfono normalizado', async () => {
    const res = await handleCreateLead(peticion(valido), deps);
    expect(res.status).toBe(201);
    const body = (await res.json()) as { ok: boolean; id: string };
    expect(body.ok).toBe(true);

    expect(repo.leads).toHaveLength(1);
    const lead = repo.leads[0]!;
    expect(lead).toMatchObject({
      id: body.id,
      nombre: 'Ana Pérez',
      nombre_negocio: 'Peluquería Luna',
      whatsapp: '+5491123456789',
      email: 'ana@luna.com',
      mensaje: 'Quiero turnos online',
      rubro: 'peluqueria_estetica',
      rubro_otro: null,
      modulos: ['turnos', 'catalogo'],
      objetivos: ['recibir_turnos', 'mostrar_trabajos'],
      origen: 'instagram',
      estado: 'nuevo',
      utm_source: 'instagram',
      utm_medium: 'bio',
      utm_campaign: 'lanzamiento',
      user_agent: 'Mozilla/5.0 (iPhone) Instagram 300.0',
    });
    expect(lead.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('no guarda la IP en claro: solo un hash', async () => {
    await handleCreateLead(peticion(valido), deps);
    const lead = repo.leads[0]!;
    expect(lead.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(lead)).not.toContain(IP);
  });

  it('guarda el origen de la lista cerrada; sin origen, el de siempre', async () => {
    const desdeDemo = {
      ...valido,
      rubro: 'gastronomia',
      objetivos: [],
      modulos: ['carta_qr'],
      origen: 'demo_gastronomia',
      demo: { paleta: 'pileta', cocina: 'parrilla' },
    };
    expect((await handleCreateLead(peticion(desdeDemo), deps)).status).toBe(201);
    expect(repo.leads[0]?.origen).toBe('demo_gastronomia');
    expect((await handleCreateLead(peticion(valido), deps)).status).toBe(201);
    expect(repo.leads[1]?.origen).toBe('instagram');
  });

  it('rechaza un origen fuera de la lista o una demo inventada', async () => {
    const r1 = await handleCreateLead(peticion({ ...valido, origen: 'facebook' }), deps);
    expect(r1.status).toBe(400);
    const r2 = await handleCreateLead(
      peticion({ ...valido, demo: { paleta: 'arcoiris', cocina: 'parrilla' } }),
      deps,
    );
    expect(r2.status).toBe(400);
    const r3 = await handleCreateLead(
      peticion({ ...valido, demo: { paleta: 'brasa', cocina: 'cafe', extra: 'x' } }),
      deps,
    );
    expect(r3.status).toBe(400);
    expect(repo.leads).toHaveLength(0);
  });

  it('guarda el lead aunque no haya objetivos (son opcionales)', async () => {
    const res = await handleCreateLead(peticion({ ...valido, objetivos: [] }), deps);
    expect(res.status).toBe(201);
    expect(repo.leads[0]?.objetivos).toEqual([]);
  });

  it('guarda null en lo opcional vacío y rubro_otro cuando el rubro es "otro"', async () => {
    const res = await handleCreateLead(
      peticion({
        ...valido,
        rubro: 'otro',
        rubroOtro: 'Floristería',
        objetivos: ['que_me_contacten'],
        email: '',
        mensaje: '',
        utm_source: undefined,
        utm_medium: undefined,
        utm_campaign: undefined,
      }),
      deps,
    );
    expect(res.status).toBe(201);
    expect(repo.leads[0]).toMatchObject({
      rubro: 'otro',
      rubro_otro: 'Floristería',
      email: null,
      mensaje: null,
      utm_source: null,
    });
  });

  it('sanitiza el texto (etiquetas HTML, espacios) antes de guardar', async () => {
    await handleCreateLead(
      peticion({
        ...valido,
        nombre: '  Ana <b>Pérez</b>  ',
        mensaje: '<script>x</script>Hola\n\n\n\nchau',
      }),
      deps,
    );
    expect(repo.leads[0]).toMatchObject({ nombre: 'Ana Pérez', mensaje: 'xHola\n\nchau' });
  });

  it('avisa del lead nuevo, y si el aviso falla igual responde 201', async () => {
    await handleCreateLead(peticion(valido), deps);
    expect(notifier.nuevoLead).toHaveBeenCalledOnce();
    expect(notifier.nuevoLead.mock.calls[0]?.[0]).toMatchObject({
      nombre_negocio: 'Peluquería Luna',
    });

    notifier.nuevoLead.mockRejectedValueOnce(new Error('slack caído'));
    const res = await handleCreateLead(
      peticion(valido, { 'x-forwarded-for': '198.51.100.9' }),
      deps,
    );
    expect(res.status).toBe(201);
  });

  it('no se cachea', async () => {
    const res = await handleCreateLead(peticion(valido), deps);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });
});

describe('POST /api/leads — campos inválidos', () => {
  it.each([
    ['nombre vacío', { nombre: '' }, 'nombre'],
    ['negocio vacío', { nombreNegocio: '' }, 'nombreNegocio'],
    ['WhatsApp inválido', { whatsapp: '12345' }, 'whatsapp'],
    ['WhatsApp de otro país', { whatsapp: '+1 415 555 2671' }, 'whatsapp'],
    ['email mal formado', { email: 'ana@' }, 'email'],
    ['mensaje demasiado largo', { mensaje: 'x'.repeat(1001) }, 'mensaje'],
    ['rubro inexistente', { rubro: 'astronauta' }, 'rubro'],
    ['sin módulos', { modulos: [] }, 'modulos'],
    ['módulo inexistente', { modulos: ['hackeo'] }, 'modulos'],
    ['objetivo de otro rubro', { objetivos: ['cobrar_cuotas'] }, 'objetivos'],
    ['"otro" sin descripción', { rubro: 'otro', objetivos: ['que_me_contacten'] }, 'rubroOtro'],
  ])('rechaza con 400: %s', async (_caso, cambio, campo) => {
    const res = await handleCreateLead(peticion({ ...valido, ...cambio }), deps);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string; fields: Record<string, string> } };
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.fields[campo]).toBeTruthy();
    expect(repo.leads).toHaveLength(0);
    expect(notifier.nuevoLead).not.toHaveBeenCalled();
  });

  it('rechaza un cuerpo que no es JSON (400), que no es un objeto (400) o con otro content-type (415)', async () => {
    expect((await handleCreateLead(peticion('{no es json'), deps)).status).toBe(400);
    expect((await handleCreateLead(peticion('[1,2]'), deps)).status).toBe(400);
    expect(
      (await handleCreateLead(peticion('x=1', { 'content-type': 'text/plain' }), deps)).status,
    ).toBe(415);
  });

  it('rechaza cuerpos demasiado grandes con 413', async () => {
    const res = await handleCreateLead(peticion({ ...valido, mensaje: 'x'.repeat(40_000) }), deps);
    expect(res.status).toBe(413);
  });

  it('ignora campos extra (no se guardan)', async () => {
    await handleCreateLead(peticion({ ...valido, estado: 'cliente', id: 'forzado' }), deps);
    expect(repo.leads[0]?.estado).toBe('nuevo');
    expect(repo.leads[0]?.id).not.toBe('forzado');
  });
});

describe('POST /api/leads — honeypot', () => {
  it('con el campo oculto completo responde como éxito pero no guarda ni avisa', async () => {
    const res = await handleCreateLead(
      peticion({ ...valido, website: 'http://spam.example' }),
      deps,
    );
    expect(res.status).toBe(201);
    expect(((await res.json()) as { ok: boolean }).ok).toBe(true);
    expect(repo.leads).toHaveLength(0);
    expect(notifier.nuevoLead).not.toHaveBeenCalled();
  });
});

describe('POST /api/leads — rate limit', () => {
  it('bloquea con 429 y Retry-After al superar el máximo de leads por IP en la ventana', async () => {
    for (let i = 0; i < 3; i++) {
      expect((await handleCreateLead(peticion(valido), deps)).status).toBe(201);
    }
    const res = await handleCreateLead(peticion(valido), deps);
    expect(res.status).toBe(429);
    expect(res.headers.get('retry-after')).toBe('600');
    expect(((await res.json()) as { error: { code: string } }).error.code).toBe('RATE_LIMITED');
    expect(repo.leads).toHaveLength(3);
  });

  it('el límite es por IP: otra IP puede enviar', async () => {
    for (let i = 0; i < 3; i++) await handleCreateLead(peticion(valido), deps);
    const otra = await handleCreateLead(
      peticion(valido, { 'x-forwarded-for': '198.51.100.20' }),
      deps,
    );
    expect(otra.status).toBe(201);
  });

  it('se libera pasada la ventana', async () => {
    const t0 = new Date('2026-10-28T12:00:00Z');
    repo = new MemoryLeadRepository(() => t0);
    deps = { ...deps, repo, ahora: () => t0 };
    for (let i = 0; i < 3; i++) await handleCreateLead(peticion(valido), deps);
    expect((await handleCreateLead(peticion(valido), deps)).status).toBe(429);

    deps = { ...deps, ahora: () => new Date(t0.getTime() + 601_000) };
    expect((await handleCreateLead(peticion(valido), deps)).status).toBe(201);
  });

  it('frena ráfagas de intentos inválidos en memoria', async () => {
    deps = { ...deps, burst: crearBurstLimiter(3, 60_000) };
    const invalido = { ...valido, nombre: '' };
    const estados: number[] = [];
    for (let i = 0; i < 5; i++)
      estados.push((await handleCreateLead(peticion(invalido), deps)).status);
    expect(estados).toEqual([400, 400, 400, 429, 429]);
  });
});

describe('POST /api/leads — falla del repositorio', () => {
  it('responde 500 genérico, sin exponer el error interno', async () => {
    const roto: LeadRepository = {
      contarRecientesPorIp: async () => 0,
      crear: async () => {
        throw new Error('connection to db.supabase.co:5432 refused (password=hunter2)');
      },
    };
    const res = await handleCreateLead(peticion(valido), { ...deps, repo: roto });
    expect(res.status).toBe(500);
    const texto = await res.text();
    expect(JSON.parse(texto).error.code).toBe('INTERNAL_ERROR');
    expect(texto).not.toMatch(/supabase|hunter2|password|5432|stack/i);
    expect(notifier.nuevoLead).not.toHaveBeenCalled();
  });

  it('también es 500 genérico si falla la consulta del rate limit', async () => {
    const roto: LeadRepository = {
      contarRecientesPorIp: async () => {
        throw new Error('boom interno');
      },
      crear: async () => ({ id: 'x' }),
    };
    const res = await handleCreateLead(peticion(valido), { ...deps, repo: roto });
    expect(res.status).toBe(500);
    expect(await res.text()).not.toContain('boom');
  });
});
