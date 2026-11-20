import { expect, test } from '@playwright/test';

/** Consola limpia: ni errores ni advertencias (hidratación, CSP, imágenes) en ninguna página. */
for (const ruta of [
  '/',
  '/turnero',
  '/pedidos',
  '/tienda',
  '/web',
  '/proyectos',
  '/proyectos/micios',
  '/proyectos/canina',
  '/nosotros',
  '/zona',
  '/armar',
  '/privacidad',
  '/demos',
  '/demos/pedidos',
  '/demos/turnos',
  '/demos/web',
  '/demos/tienda',
  '/protectoras',
  '/demos/protectora',
]) {
  test(`${ruta}: consola sin errores ni advertencias`, async ({ page }) => {
    const mensajes: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') mensajes.push(`${m.type()}: ${m.text()}`);
    });
    page.on('pageerror', (e) => mensajes.push(`pageerror: ${e.message}`));
    await page.goto(ruta, { waitUntil: 'networkidle' });
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += 800) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForLoadState('networkidle');
    expect(mensajes).toEqual([]);
  });
}
