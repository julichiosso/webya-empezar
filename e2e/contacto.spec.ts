import { expect, test } from '@playwright/test';
import { CONTACTO_RAPIDO } from '../src/content/home';
import { leerLeads } from './helpers';

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'desktop', 'Flujo con el servidor: un proyecto alcanza');
});

/** Un número distinto por corrida: el mismo número reenviado actualiza su lead. */
const numero = () => `3406${String(Math.floor(100_000 + Math.random() * 899_999))}`;

test('"te escribimos nosotros": el número queda guardado como lead y avisa que llegó', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const form = page.locator('form').filter({ hasText: CONTACTO_RAPIDO.titulo });
  const n = numero();
  await form.getByRole('textbox', { name: CONTACTO_RAPIDO.whatsapp }).fill(n);
  await form.getByRole('textbox', { name: CONTACTO_RAPIDO.negocio }).fill('Agronomía Prueba');
  await form.getByRole('textbox', { name: CONTACTO_RAPIDO.mensaje }).fill('Turnos de descarga');
  await form.getByRole('button', { name: CONTACTO_RAPIDO.enviar }).click();
  await expect(page.getByRole('status').filter({ hasText: CONTACTO_RAPIDO.listo })).toBeVisible();

  const lead = (await leerLeads()).find((l) => l.whatsapp === `+549${n}`) as
    { nombre_negocio: string | null; necesidad_libre: string | null } | undefined;
  expect(lead?.nombre_negocio).toBe('Agronomía Prueba');
  expect(lead?.necesidad_libre).toBe('Turnos de descarga');
});

test('un número inválido no se envía y dice cómo corregirlo', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const form = page.locator('form').filter({ hasText: CONTACTO_RAPIDO.titulo });
  await form.getByRole('textbox', { name: CONTACTO_RAPIDO.whatsapp }).fill('123');
  await form.getByRole('button', { name: CONTACTO_RAPIDO.enviar }).click();
  await expect(form.getByRole('textbox', { name: CONTACTO_RAPIDO.whatsapp })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});
