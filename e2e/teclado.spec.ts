import { expect, test } from '@playwright/test';
import { leerLeads, negocioUnico, wizard } from './helpers';

// El teclado es independiente del viewport: se prueba una vez, en desktop.
test.beforeEach(({ viewport }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop' || !viewport, 'solo desktop');
});

test('el flujo completo se puede hacer solo con teclado', async ({ page }) => {
  const negocio = negocioUnico('teclado');
  await page.goto('/empezar');
  const w = wizard(page);
  await expect(w.getByRole('heading', { name: '¿Qué rubro sos?' })).toBeVisible();

  // Paso 1: las flechas mueven la selección del grupo de radios; Enter avanza.
  await w.getByRole('radio', { name: /peluquería/i }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(w.getByRole('radio', { name: /gastronomía/i })).toBeChecked();
  await page.keyboard.press('ArrowLeft');
  await expect(w.getByRole('radio', { name: /peluquería/i })).toBeChecked();
  await page.keyboard.press('Enter');

  // Paso 2: el foco pasa al título; Tab llega al primer chip; Espacio marca; Enter avanza.
  await expect(w.getByRole('heading', { name: '¿Qué querés lograr?' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(w.getByRole('checkbox').first()).toBeFocused();
  await page.keyboard.press('Space');
  await expect(w.getByRole('checkbox').first()).toBeChecked();
  await page.keyboard.press('Enter');

  // Paso 3: arranca con el foco en el primer campo y se completa tabulando.
  await expect(w.getByRole('heading', { name: 'Contanos de tu negocio' })).toBeVisible();
  await expect(w.getByLabel('Nombre de tu negocio')).toBeFocused();
  await page.keyboard.type(negocio);
  await page.keyboard.press('Tab');
  await page.keyboard.type('Ana Pérez');
  await page.keyboard.press('Tab');
  await page.keyboard.type('1123456789');
  await page.keyboard.press('Enter'); // Enter dentro de un campo envía el formulario

  await expect(w.getByRole('heading', { name: /¡Listo, Ana!/ })).toBeVisible();
  expect((await leerLeads()).some((l) => l.nombre_negocio === negocio)).toBe(true);
});

test('el foco es siempre visible', async ({ page }) => {
  await page.goto('/empezar');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement as HTMLElement);
    return { estilo: s.outlineStyle, ancho: parseFloat(s.outlineWidth) };
  });
  expect(outline.estilo).not.toBe('none');
  expect(outline.ancho).toBeGreaterThanOrEqual(2);
});
