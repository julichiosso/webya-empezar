import { createHash } from 'node:crypto';
import { expect, test, type APIRequestContext } from '@playwright/test';
import { leerLeads } from './helpers';

/**
 * Lead parcial ("solo WhatsApp primero", docs/plan-sprint.md §6) contra el servidor real con repositorio
 * en archivo. La UI del flujo llega en la Ola 3; acá se fija el contrato de la API.
 */
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'desktop', 'Contrato de API: un solo proyecto alcanza');
});

type LeadArchivo = Awaited<ReturnType<typeof leerLeads>>[number] & {
  estado: string;
  necesidades: string[];
  necesidad_libre: string | null;
  token_hash: string | null;
  completado_at: string | null;
  nombre_negocio: string | null;
};

const unico = () => `Stock de dos locales ${Date.now()}${Math.floor(Math.random() * 1000)}`;

async function crearParcial(request: APIRequestContext, texto: string) {
  const res = await request.post('/api/leads', {
    data: {
      parcial: true,
      whatsapp: '11 2345 6789',
      necesidades: ['vender', 'otra'],
      necesidadLibre: texto,
      rubro: 'comercio',
      modulos: ['catalogo'],
      objetivos: [],
      website: '',
    },
  });
  expect(res.status()).toBe(201);
  return (await res.json()) as { ok: boolean; id: string; token: string };
}

const buscar = async (id: string) =>
  (await leerLeads()).find((l) => l.id === id) as LeadArchivo | undefined;

test('el lead parcial queda guardado aunque la persona no complete nada', async ({ request }) => {
  const texto = unico();
  const { ok, id, token } = await crearParcial(request, texto);
  expect(ok).toBe(true);
  expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);

  const lead = await buscar(id);
  expect(lead?.estado).toBe('parcial');
  expect(lead?.whatsapp).toBe('+5491123456789');
  expect(lead?.necesidades).toEqual(['vender', 'otra']);
  expect(lead?.necesidad_libre).toBe(texto);
  expect(lead?.nombre_negocio).toBeNull();
  // Solo el hash del token: el token en claro nunca se guarda.
  expect(lead?.token_hash).toBe(createHash('sha256').update(token).digest('hex'));
  expect(JSON.stringify(await leerLeads())).not.toContain(token);
});

test('completar con el token pasa el lead a nuevo; el token sirve una sola vez', async ({
  request,
}) => {
  const { id, token } = await crearParcial(request, unico());
  const completar = () =>
    request.patch(`/api/leads/${id}`, {
      data: { token, nombreNegocio: 'Luna Deco', nombre: '', email: '', mensaje: '' },
    });

  expect((await completar()).status()).toBe(200);
  const lead = await buscar(id);
  expect(lead?.estado).toBe('nuevo');
  expect(lead?.nombre_negocio).toBe('Luna Deco');
  expect(lead?.token_hash).toBeNull();
  expect(lead?.completado_at).toBeTruthy();

  expect((await completar()).status()).toBe(404);
});

test('token equivocado o lead inexistente: 404 genérico, sin pistas', async ({ request }) => {
  const { id } = await crearParcial(request, unico());
  const otro = 'A'.repeat(43);
  const r1 = await request.patch(`/api/leads/${id}`, {
    data: { token: otro, nombreNegocio: 'X Y' },
  });
  const r2 = await request.patch('/api/leads/00000000-0000-4000-8000-000000000000', {
    data: { token: otro, nombreNegocio: 'X Y' },
  });
  expect(r1.status()).toBe(404);
  expect(r2.status()).toBe(404);
  expect(await r1.text()).toBe(await r2.text());
  expect((await buscar(id))?.estado).toBe('parcial');
});
