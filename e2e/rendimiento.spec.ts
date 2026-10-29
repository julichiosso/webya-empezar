import { expect, test, type Response } from '@playwright/test';
import { gzipSync } from 'node:zlib';
import { wizard } from './helpers';

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

  // Sin gesto, el wizard no se descargó: sigue el esqueleto.
  await expect(wizard(page)).toHaveAttribute('aria-busy', 'true');
  const antes = scripts.length;

  // Primer gesto: baja hacia el wizard y carga.
  await page.mouse.wheel(0, 300);
  await expect(wizard(page).getByRole('heading', { name: '¿Qué vas a crear?' })).toBeVisible();
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
