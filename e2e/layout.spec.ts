import { expect, test } from '@playwright/test';

/**
 * Layout de las páginas del sistema editorial en todos los viewports del config (celulares, tablet y
 * escritorios de 1440 y 1920): nada desborda, un solo h1 y el CTA del header siempre a la vista.
 */
const RUTAS = ['/', '/turnero', '/pizzerias', '/tiendas', '/privacidad'];

for (const ruta of RUTAS) {
  test(`${ruta}: sin scroll horizontal, un h1 y el CTA del header visible`, async ({ page }) => {
    await page.goto(ruta, { waitUntil: 'networkidle' });
    // Recorre la página para que entren todas las secciones (reveals y carriles).
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += 700) await page.evaluate((v) => window.scrollTo(0, v), y);

    const { scrollW, vw } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      vw: document.documentElement.clientWidth,
    }));
    expect(scrollW, 'ancho de página').toBeLessThanOrEqual(vw);
    await expect(page.locator('h1')).toHaveCount(1);

    const cta = page.getByRole('banner').getByRole('link', { name: 'Armá tu sistema' });
    await expect(cta).toBeVisible();
    const caja = await cta.boundingBox();
    expect(caja!.height).toBeGreaterThanOrEqual(44);
  });
}

test('zona de atención visible en el hero y en el pie', async ({ page }) => {
  await page.goto('/');
  const zona = 'Atención en San Jorge y zona · San Francisco y alrededores';
  await expect(
    page.locator('#titulo-hero').locator('xpath=ancestor::section').getByText(zona),
  ).toBeVisible();
  await expect(page.getByRole('contentinfo').getByText(zona)).toBeAttached();
});
