import { expect, test } from '@playwright/test';
import { HERO } from '../src/content/empezar/hero';
import { PASO_LISTO } from '../src/content/empezar/pasos';
import {
  abrirWizard,
  completarNegocio,
  guardarWhatsapp,
  irAlPaso,
  leerLeads,
  MODULOS_PELUQUERIA,
  negocioUnico,
  pasarNecesidad,
  TITULO_FINAL,
  TITULO_FINAL_PARCIAL,
  TITULO_PASO_2,
  TITULO_WHATSAPP,
  tocar,
  wizard,
} from './helpers';

test('recorrido completo: el WhatsApp guarda el lead parcial y completar lo pasa a nuevo', async ({
  page,
}, testInfo) => {
  const negocio = negocioUnico(testInfo.project.name);
  const respuestas: string[] = [];
  page.on('response', (r) => {
    if (r.url().includes('/api/leads')) respuestas.push(`${r.request().method()} ${r.status()}`);
  });

  await irAlPaso(
    page,
    'completar',
    '?utm_source=instagram&utm_medium=bio&utm_campaign=lanzamiento',
  );
  expect(respuestas).toEqual(['POST 201']);
  await completarNegocio(page, negocio);

  await expect(wizard(page).getByRole('heading', { name: TITULO_FINAL })).toBeVisible();
  expect(respuestas).toEqual(['POST 201', 'PATCH 200']);
  const resumen = wizard(page).getByRole('list', { name: /las piezas de tu negocio/i });
  await expect(resumen).toContainText('Turnos y reservas');
  await expect(resumen).toContainText('Tienda y catálogo');
  const wa = wizard(page).getByRole('link', { name: /hablar por whatsapp/i });
  await expect(wa).toHaveAttribute('href', /^https:\/\/wa\.me\/5491100000000\?text=/);
  await expect(wizard(page).getByText(PASO_LISTO.contacto)).toBeVisible();
  await expect(wizard(page).getByText(/lo armamos nosotros/i)).toBeVisible();

  const lead = (await leerLeads()).find((l) => l.nombre_negocio === negocio);
  expect(lead).toBeDefined();
  expect(lead).toMatchObject({
    nombre: 'Ana Pérez',
    email: 'ana@luna.com',
    whatsapp: '+5491123456789',
    rubro: 'peluqueria_estetica',
    rubro_otro: null,
    modulos: MODULOS_PELUQUERIA,
    objetivos: ['recibir_turnos', 'mostrar_trabajos'],
    mensaje: 'Quiero turnos online',
    origen: 'instagram',
    utm_source: 'instagram',
    utm_medium: 'bio',
    utm_campaign: 'lanzamiento',
    estado: 'nuevo',
  });
  expect(lead?.ip_hash).toMatch(/^[0-9a-f]{32,}$/);
  expect(lead?.ip_hash).not.toMatch(/127\.0\.0\.1|::1/);
  expect(lead?.user_agent).toBeTruthy();
});

test('"Otra cosa" y "Ahora no": queda el lead parcial con el pedido a medida', async ({ page }) => {
  const pedido = `Controlar el stock de mis dos locales ${Date.now()}`;
  await page.goto('/empezar');
  await abrirWizard(page);
  await tocar(page, /^Otra cosa/);
  await wizard(page)
    .getByLabel(/contanos qué necesitás/i)
    .fill(pedido);
  await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
  await tocar(page, /comercio/i);
  await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_PASO_2 })).toBeVisible();
  await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_WHATSAPP })).toBeVisible();
  await guardarWhatsapp(page);
  await wizard(page)
    .getByRole('button', { name: /ahora no/i })
    .click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_FINAL_PARCIAL })).toBeVisible();
  await expect(wizard(page).getByText(/leemos lo que nos contaste/i)).toBeVisible();

  const lead = (await leerLeads()).find(
    (l) => (l as unknown as { necesidad_libre: string | null }).necesidad_libre === pedido,
  );
  expect(lead).toMatchObject({ estado: 'parcial', rubro: 'comercio', whatsapp: '+5491123456789' });
});

test('lo que se activa en el hero llega al wizard y se guarda en el lead', async ({
  page,
}, testInfo) => {
  const negocio = negocioUnico(`hero-${testInfo.project.name}`);
  await page.goto('/empezar');
  const hero = page.getByRole('group', { name: /armá tu negocio/i });

  // Dos módulos activados desde el mockup, todavía sin rubro.
  await hero.getByRole('button', { name: /carta con qr/i }).click();
  await hero.getByRole('button', { name: /pagos online/i }).click();
  await expect(hero.getByRole('button', { name: /carta con qr/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  // CTA → wizard. Comercio no sugiere Carta con QR: tiene que venir marcada por el hero.
  await page.getByRole('main').getByRole('link', { name: HERO.cta }).click();
  await pasarNecesidad(page);
  await tocar(page, /comercio/i);
  await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_PASO_2 })).toBeVisible();
  await expect(wizard(page).getByRole('checkbox', { name: /carta con qr/i })).toBeChecked();
  await expect(wizard(page).getByRole('checkbox', { name: /pagos online/i })).toBeChecked();
  await expect(wizard(page).getByRole('checkbox', { name: /tienda y catálogo/i })).toBeChecked();
  await expect(
    wizard(page).getByRole('checkbox', { name: /turnos y reservas/i }),
  ).not.toBeChecked();

  await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_WHATSAPP })).toBeVisible();
  await guardarWhatsapp(page);
  await completarNegocio(page, negocio);
  await expect(wizard(page).getByRole('heading', { name: TITULO_FINAL })).toBeVisible();

  const lead = (await leerLeads()).find((l) => l.nombre_negocio === negocio);
  expect(lead?.rubro).toBe('comercio');
  expect(lead?.modulos).toEqual(['catalogo', 'carta_qr', 'pagos', 'clientes', 'notificaciones']);
  expect(lead?.objetivos).toEqual([]);
});

test('recargar en el medio del flujo conserva lo elegido, también en el hero', async ({ page }) => {
  await irAlPaso(page, 'modulos');
  await tocar(page, /carta con qr/i);
  await tocar(page, /recibir turnos online/i);
  await page.reload();
  await abrirWizard(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_PASO_2 })).toBeVisible();
  await expect(
    wizard(page).getByRole('checkbox', { name: /recibir turnos online/i }),
  ).toBeChecked();
  await expect(wizard(page).getByRole('checkbox', { name: /carta con qr/i })).toBeChecked();
  await expect(
    page
      .getByRole('group', { name: /armá tu negocio/i })
      .getByRole('button', { name: /carta con qr/i }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('el honeypot completo no guarda nada', async ({ request }, testInfo) => {
  const negocio = negocioUnico(`bot-${testInfo.project.name}`);
  const res = await request.post('/api/leads', {
    data: {
      nombreNegocio: negocio,
      nombre: 'Bot Spam',
      whatsapp: '1123456789',
      rubro: 'comercio',
      modulos: ['catalogo'],
      objetivos: ['vender_online'],
      website: 'http://spam.example',
    },
  });
  expect(res.status()).toBe(201);
  expect((await leerLeads()).some((l) => l.nombre_negocio === negocio)).toBe(false);
});

test('la API rechaza un lead sin módulos o con módulos inexistentes', async ({ request }) => {
  const base = {
    nombreNegocio: 'Negocio de prueba',
    nombre: 'Ana Pérez',
    whatsapp: '1123456789',
    rubro: 'comercio',
    email: '',
    mensaje: '',
    objetivos: [],
  };
  for (const modulos of [[], ['hackeo']]) {
    const res = await request.post('/api/leads', { data: { ...base, modulos } });
    expect(res.status()).toBe(400);
    const body = (await res.json()) as { error: { fields: Record<string, string> } };
    expect(body.error.fields.modulos).toBeTruthy();
  }
});

test('un envío inválido a la API responde 400 con errores por campo', async ({ request }) => {
  const res = await request.post('/api/leads', { data: { nombre: 'x' } });
  expect(res.status()).toBe(400);
  const body = (await res.json()) as { error: { code: string; fields: Record<string, string> } };
  expect(body.error.code).toBe('VALIDATION_ERROR');
  expect(Object.keys(body.error.fields).length).toBeGreaterThan(0);
});
