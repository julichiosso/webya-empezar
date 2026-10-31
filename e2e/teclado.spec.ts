import { expect, test } from '@playwright/test';
import { NAV } from '../src/content/empezar/nav';
import {
  leerLeads,
  negocioUnico,
  TITULO_NEGOCIO,
  TITULO_RESULTADO,
  TITULO_RUBRO,
  wizard,
} from './helpers';

// El teclado es independiente del viewport: se prueba una vez, en desktop.
test.beforeEach(({ viewport }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop' || !viewport, 'solo desktop');
});

test('el flujo completo se puede hacer solo con teclado (y el foco no se pierde al cargar)', async ({
  page,
}) => {
  const negocio = negocioUnico('teclado');
  await page.goto('/empezar');
  const w = wizard(page);
  await expect(w.getByRole('heading', { name: TITULO_RUBRO })).toBeVisible();

  // Tab: "Saltar al contenido" → logo → CTA de la nav → la primera tarjeta de rubro.
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: NAV.saltar })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: NAV.inicio })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation').getByRole('link', { name: NAV.cta })).toBeFocused();
  await page.keyboard.press('Tab');
  const primera = w.locator('[data-rubro="peluqueria_estetica"]');
  await expect(primera).toBeFocused();
  // El foco dispara la descarga del wizard: al reemplazarse el HTML, sigue en la misma tarjeta.
  await page.waitForTimeout(800);
  await expect(primera).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(w.locator('[data-rubro="gastronomia"]')).toBeFocused();
  await page.keyboard.press('Shift+Tab');

  // Enter elige el rubro y avanza: el foco va al primer campo.
  await page.keyboard.press('Enter');
  await expect(w.getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  await expect(w.getByLabel('Nombre de tu negocio')).toBeFocused();
  await page.keyboard.type(negocio);
  await page.keyboard.press('Tab');
  await expect(w.getByLabel('Tu WhatsApp')).toBeFocused();
  await page.keyboard.type('1123456789');
  await page.keyboard.press('Enter'); // Enter dentro de un campo envía el formulario

  // Pantalla 3: el foco va al título; Tab llega al CTA.
  const titulo = w.getByRole('heading', { name: TITULO_RESULTADO });
  await expect(titulo).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(w.getByRole('link', { name: /quiero esto para mi negocio/i })).toBeFocused();
  expect((await leerLeads()).some((l) => l.nombre_negocio === negocio)).toBe(true);
});

test('el foco es siempre visible', async ({ page }) => {
  await page.goto('/empezar');
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => {
      const s = getComputedStyle(document.activeElement as HTMLElement);
      return { estilo: s.outlineStyle, ancho: parseFloat(s.outlineWidth) };
    });
    expect(outline.estilo).not.toBe('none');
    expect(outline.ancho).toBeGreaterThanOrEqual(2);
  }
});
