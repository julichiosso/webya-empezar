import { expect, test, type Response } from '@playwright/test';
import { gzipSync } from 'node:zlib';
import { FUENTE_PRECARGADA } from '../src/brand/tipografia/fuente';
import { TITULO_NEGOCIO, TITULO_RUBRO, wizard } from './helpers';

// Presupuestos de la ruta. Se prueba una vez (desktop) con un viewport de celular fijo.
test.use({ viewport: { width: 390, height: 700 }, hasTouch: true, isMobile: true });
test.beforeEach(({ viewport }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop' || !viewport, 'solo desktop (viewport propio)');
});

/** JS inicial máximo, gzip. El framework (React + runtime de Next) ya ocupa ~135 KB. */
const PRESUPUESTO_JS_INICIAL_KB = 150;
const PRESUPUESTO_CLS = 0.05;

async function gzipKb(responses: Response[]) {
  let bytes = 0;
  for (const r of responses) bytes += gzipSync(await r.body(), { level: 9 }).length;
  return bytes / 1024;
}

test('JS inicial bajo presupuesto y wizard diferido hasta el primer gesto', async ({
  page,
}, testInfo) => {
  const scripts: Response[] = [];
  page.on('response', (r) => {
    if (r.request().resourceType() === 'script') scripts.push(r);
  });

  await page.goto('/empezar', { waitUntil: 'networkidle' });
  const inicialKb = await gzipKb(scripts);
  testInfo.annotations.push({
    type: 'medición',
    description: `JS inicial: ${inicialKb.toFixed(1)} KB gzip (${scripts.length} scripts)`,
  });
  expect(inicialKb).toBeLessThan(PRESUPUESTO_JS_INICIAL_KB);

  // Sin gesto, la pantalla 1 ya está (HTML del servidor) pero el wizard no se descargó.
  await expect(wizard(page).getByRole('heading', { name: TITULO_RUBRO })).toBeVisible();
  const antes = scripts.length;

  // Primer gesto: tocar un rubro descarga el wizard y avanza.
  await wizard(page).locator('[data-rubro="comercio"]').tap();
  await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  expect(scripts.length).toBeGreaterThan(antes);
  const totalKb = await gzipKb(scripts);
  testInfo.annotations.push({
    type: 'medición',
    description: `JS con wizard: ${totalKb.toFixed(1)} KB gzip`,
  });
});

test('CLS menor a 0,05 recorriendo toda la página y pasando por el wizard', async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((lista) => {
      for (const e of lista.getEntries() as unknown as {
        value: number;
        hadRecentInput: boolean;
      }[]) {
        if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/empezar', { waitUntil: 'networkidle' });

  // Baja por toda la página en pasos (dispara el wizard, el revelado de secciones, etc.).
  const alto = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < alto; y += 350) {
    await page.mouse.wheel(0, 350);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(500);
  const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
  testInfo.annotations.push({ type: 'medición', description: `CLS: ${cls.toFixed(4)}` });
  expect(cls).toBeLessThan(PRESUPUESTO_CLS);
});

test('la fuente se precarga y el preload apunta al archivo que usa el @font-face', async ({
  page,
  request,
}) => {
  await page.goto('/empezar');
  const preload = page.locator('link[rel="preload"][as="font"]');
  await expect(preload).toHaveCount(1);
  const href = await preload.getAttribute('href');
  expect(href).toBe(FUENTE_PRECARGADA);
  // Si Google cambia el archivo, cambia su nombre: el preload quedaría apuntando a nada.
  const html = await (await request.get('/empezar')).text();
  expect(html).toContain(`src:url(${FUENTE_PRECARGADA})`);
  expect((await request.get(FUENTE_PRECARGADA)).status()).toBe(200);
});
