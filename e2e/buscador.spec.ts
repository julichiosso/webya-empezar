import { expect, test } from '@playwright/test';
import { BUSCADOR } from '../src/content/buscador';

test('el buscador sugiere mientras se escribe y con Enter lleva a la página', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const caja = page.getByRole('combobox', { name: BUSCADOR.etiqueta });
  await caja.fill('turnos para mi peluquería');
  const lista = page.getByRole('listbox');
  await expect(lista.getByRole('option').first()).toContainText('Turnos con seña');
  await caja.press('Enter');
  await expect(page).toHaveURL(/\/turnero$/);
});

test('flechas para elegir y Escape para cerrar', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'teclado: escritorio');
  await page.goto('/', { waitUntil: 'networkidle' });
  const caja = page.getByRole('combobox', { name: BUSCADOR.etiqueta });
  await caja.fill('pizzeria');
  await caja.press('ArrowDown');
  await expect(page.getByRole('option').nth(1)).toHaveAttribute('aria-selected', 'true');
  await caja.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
});

test('lo que se escribe nunca se ejecuta y siempre se puede mandar por WhatsApp', async ({
  page,
}) => {
  let dialogo = false;
  page.on('dialog', async (d) => {
    dialogo = true;
    await d.dismiss();
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  const caja = page.getByRole('combobox', { name: BUSCADOR.etiqueta });
  await caja.fill('<img src=x onerror=alert(1)>');
  const ultima = page.getByRole('option').last();
  await expect(ultima).toContainText('por WhatsApp');
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  expect(dialogo).toBe(false);
});
