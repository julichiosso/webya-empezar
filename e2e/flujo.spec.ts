import { expect, test } from '@playwright/test';
import {
  abrirWizard,
  completarDatos,
  elegirRubro,
  enviarNegocio,
  irAlPaso,
  leerLeads,
  MODULOS_PELUQUERIA,
  negocioUnico,
  TITULO_A_MEDIDA,
  TITULO_GRACIAS,
  TITULO_NEGOCIO,
  TITULO_RESULTADO,
  TITULO_RESULTADO_A_MEDIDA,
  TITULO_RUBRO,
  wizard,
} from './helpers';

test('recorrido completo: rubro → formulario (lead parcial) → vista previa → CTA → completar', async ({
  page,
}, testInfo) => {
  const negocio = negocioUnico(testInfo.project.name);
  const respuestas: string[] = [];
  page.on('response', (r) => {
    if (r.url().includes('/api/leads')) respuestas.push(`${r.request().method()} ${r.status()}`);
  });

  await page.goto('/empezar?utm_source=instagram&utm_medium=bio&utm_campaign=lanzamiento');
  await abrirWizard(page);
  await elegirRubro(page);
  await enviarNegocio(page, { negocio, ciudad: 'San Jorge' });
  await expect(wizard(page).getByRole('heading', { name: TITULO_RESULTADO })).toBeVisible();
  expect(respuestas).toEqual(['POST 201']);

  // El lead parcial ya quedó guardado con todo lo de la pantalla 2.
  const parcial = (await leerLeads()).find((l) => l.nombre_negocio === negocio);
  expect(parcial).toMatchObject({
    estado: 'parcial',
    whatsapp: '+5491123456789',
    rubro: 'peluqueria_estetica',
    ciudad: 'San Jorge',
    modulos: MODULOS_PELUQUERIA,
    utm_source: 'instagram',
    utm_medium: 'bio',
    utm_campaign: 'lanzamiento',
  });
  expect(parcial?.ip_hash).toMatch(/^[0-9a-f]{32,}$/);

  // CTA único: WhatsApp con rubro, nombre y módulos.
  // En celular el CTA va en la barra fija (fuera del flujo); en escritorio, en la pantalla.
  const cta = page.getByRole('link', { name: /quiero esto para mi negocio/i });
  await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\/5491100000000\?text=/);
  const texto = decodeURIComponent((await cta.getAttribute('href')) ?? '');
  expect(texto).toContain(negocio);
  expect(texto).toContain('Peluquería y estética');
  expect(texto).toContain('Turnos y reservas');

  // Secundario: completar con el token (PATCH) → gracias.
  await wizard(page)
    .getByRole('button', { name: /dejar más datos/i })
    .click();
  await completarDatos(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_GRACIAS })).toBeVisible();
  expect(respuestas).toEqual(['POST 201', 'PATCH 200']);
  const lead = (await leerLeads()).find((l) => l.nombre_negocio === negocio);
  expect(lead).toMatchObject({
    estado: 'nuevo',
    nombre: 'Ana Pérez',
    email: 'ana@luna.com',
    mensaje: 'Quiero turnos online',
  });
});

test('"Otro": pedido a medida → formulario → "Lo armamos a medida", sin vista previa', async ({
  page,
}) => {
  const pedido = `Controlar el stock de mis dos locales ${Date.now()}`;
  await page.goto('/empezar');
  await abrirWizard(page);
  await elegirRubro(page, 'otro');
  await expect(wizard(page).getByRole('heading', { name: TITULO_A_MEDIDA })).toBeVisible();
  await wizard(page)
    .getByLabel(/qué necesita tu negocio/i)
    .fill(pedido);
  await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
  await enviarNegocio(page, { negocio: 'Depósito Sur', boton: /^enviar$/i });
  await expect(
    wizard(page).getByRole('heading', { name: TITULO_RESULTADO_A_MEDIDA }),
  ).toBeVisible();
  await expect(wizard(page).getByTestId('negocio-preview')).toHaveCount(0);

  const lead = (await leerLeads()).find((l) => l.necesidad_libre === pedido);
  expect(lead).toMatchObject({ estado: 'parcial', rubro: 'otro', modulos: [] });
});

test('Gastronomía: la demo completa se abre con el nombre y la paleta elegidos', async ({
  page,
}) => {
  await page.goto('/empezar');
  await abrirWizard(page);
  await elegirRubro(page, 'gastronomia');
  await enviarNegocio(page, { negocio: 'Lo de Tito' });
  await expect(wizard(page).getByRole('heading', { name: TITULO_RESULTADO })).toBeVisible();
  await wizard(page)
    .getByRole('button', { name: 'Colores Pileta' })
    .click();
  await expect(
    wizard(page).locator('[data-testid="preview-negocio"][data-paleta="pileta"]').first(),
  ).toBeAttached();
  await wizard(page)
    .getByRole('link', { name: /probá la demo completa/i })
    .click();
  await expect(page).toHaveURL(/\/demo\/gastronomia\?local=Lo\+de\+Tito&paleta=pileta/);
  // La demo arranca con ese nombre (lo lee de la URL).
  await expect(page.getByText('Lo de Tito').first()).toBeVisible();
});

test('pantalla 3: celular/computadora y piezas cambian la vista previa', async ({ page }) => {
  await irAlPaso(page, 'resultado');
  const ver = wizard(page).getByRole('group', { name: 'Ver en' });
  await ver.getByRole('button', { name: 'Computadora' }).click();
  await expect(
    wizard(page).locator('[data-testid="preview-negocio"][data-dispositivo="escritorio"]').first(),
  ).toBeAttached();
  const turnos = wizard(page).getByRole('button', { name: /turnos y reservas/i });
  await expect(turnos).toHaveAttribute('aria-pressed', 'true');
  await turnos.click();
  await expect(turnos).toHaveAttribute('aria-pressed', 'false');
});

test('orden B: nombre → vista previa → WhatsApp al tocar el CTA (y ahí se guarda el lead)', async ({
  page,
}, testInfo) => {
  const negocio = negocioUnico(`b-${testInfo.project.name}`);
  await page.goto('/empezar?orden=b');
  await abrirWizard(page);
  await elegirRubro(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  await expect(wizard(page).getByLabel('Tu WhatsApp')).toHaveCount(0);
  await wizard(page).getByLabel('Nombre de tu negocio').fill(negocio);
  await wizard(page)
    .getByRole('button', { name: /ver cómo me queda/i })
    .click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_RESULTADO })).toBeVisible();
  expect((await leerLeads()).some((l) => l.nombre_negocio === negocio)).toBe(false);

  await page.getByRole('button', { name: /quiero esto para mi negocio/i }).click();
  await wizard(page).getByLabel('Tu WhatsApp').fill('1123456789');
  await wizard(page).getByRole('button', { name: 'Guardar y seguir' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_RESULTADO })).toBeVisible();
  await expect(page.getByRole('link', { name: /quiero esto para mi negocio/i })).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\//,
  );
  expect((await leerLeads()).find((l) => l.nombre_negocio === negocio)).toMatchObject({
    estado: 'parcial',
    rubro: 'peluqueria_estetica',
  });
});

test('recargar en el medio del flujo conserva lo cargado', async ({ page }) => {
  await irAlPaso(page, 'negocio');
  await wizard(page).getByLabel('Nombre de tu negocio').fill('Luna Peluquería');
  await page.reload();
  await abrirWizard(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  await expect(wizard(page).getByLabel('Nombre de tu negocio')).toHaveValue('Luna Peluquería');
  await wizard(page).getByRole('button', { name: 'Atrás' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_RUBRO })).toBeVisible();
  await expect(wizard(page).locator('[data-rubro="peluqueria_estetica"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
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
