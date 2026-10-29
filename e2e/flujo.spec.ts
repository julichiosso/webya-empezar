import { expect, test } from '@playwright/test';
import { completarDatos, irAlPaso, leerLeads, negocioUnico, wizard } from './helpers';

test('recorrido completo hasta la confirmación y el lead queda guardado con UTM', async ({
  page,
}, testInfo) => {
  const negocio = negocioUnico(testInfo.project.name);
  const respuestas: number[] = [];
  page.on('response', (r) => {
    if (r.url().endsWith('/api/leads')) respuestas.push(r.status());
  });

  await irAlPaso(page, 3, '?utm_source=instagram&utm_medium=bio&utm_campaign=lanzamiento');

  await completarDatos(page, negocio);
  await wizard(page).getByRole('button', { name: 'Enviar' }).click();

  await expect(wizard(page).getByRole('heading', { name: /¡Listo, Ana!/ })).toBeVisible();
  expect(respuestas).toEqual([201]);
  await expect(wizard(page).getByRole('list', { name: /lo que vamos a armar/i })).toContainText(
    'Turnos y reservas',
  );
  const wa = wizard(page).getByRole('link', { name: /hablar por whatsapp/i });
  await expect(wa).toHaveAttribute('href', /^https:\/\/wa\.me\/5491100000000\?text=/);
  await expect(wizard(page).getByText(/menos de 24 hs/i)).toBeVisible();

  const lead = (await leerLeads()).find((l) => l.nombre_negocio === negocio);
  expect(lead).toBeDefined();
  expect(lead).toMatchObject({
    nombre: 'Ana Pérez',
    email: 'ana@luna.com',
    whatsapp: '+5491123456789',
    rubro: 'peluqueria_estetica',
    rubro_otro: null,
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

test('recargar en el medio del flujo conserva lo elegido', async ({ page }) => {
  await irAlPaso(page, 2);
  await wizard(page)
    .locator('label', { hasText: /recibir turnos/i })
    .click();
  await page.reload();
  await expect(wizard(page).getByRole('heading', { name: '¿Qué querés lograr?' })).toBeVisible();
  await expect(wizard(page).getByRole('checkbox', { name: /recibir turnos/i })).toBeChecked();
});

test('el honeypot completo no guarda nada', async ({ request }, testInfo) => {
  const negocio = negocioUnico(`bot-${testInfo.project.name}`);
  const res = await request.post('/api/leads', {
    data: {
      nombreNegocio: negocio,
      nombre: 'Bot Spam',
      whatsapp: '1123456789',
      rubro: 'comercio',
      objetivos: ['vender_online'],
      website: 'http://spam.example',
    },
  });
  expect(res.status()).toBe(201);
  expect((await leerLeads()).some((l) => l.nombre_negocio === negocio)).toBe(false);
});

test('un envío inválido a la API responde 400 con errores por campo', async ({ request }) => {
  const res = await request.post('/api/leads', { data: { nombre: 'x' } });
  expect(res.status()).toBe(400);
  const body = (await res.json()) as { error: { code: string; fields: Record<string, string> } };
  expect(body.error.code).toBe('VALIDATION_ERROR');
  expect(Object.keys(body.error.fields).length).toBeGreaterThan(0);
});
