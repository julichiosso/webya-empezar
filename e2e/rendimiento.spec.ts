import { expect, test, type Response } from '@playwright/test';
import { gzipSync } from 'node:zlib';
import { FUENTE_PRECARGADA } from '../src/brand/tipografia/fuente';

// Presupuestos de la home, medidos una vez con viewport de celular.
test.use({ viewport: { width: 390, height: 700 }, hasTouch: true, isMobile: true });
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'desktop', 'solo un proyecto (viewport propio)');
});

/** JS inicial máximo, gzip. React + runtime de Next ya ocupan ~135 KB. */
const PRESUPUESTO_JS_KB = 160;
const PRESUPUESTO_CLS = 0.05;

async function gzipKb(responses: Response[]) {
  let bytes = 0;
  for (const r of responses) bytes += gzipSync(await r.body(), { level: 9 }).length;
  return bytes / 1024;
}

test('JS inicial bajo presupuesto', async ({ page }, info) => {
  const scripts: Response[] = [];
  page.on('response', (r) => {
    if (r.request().resourceType() === 'script') scripts.push(r);
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  const kb = await gzipKb(scripts);
  info.annotations.push({ type: 'medición', description: `JS inicial: ${kb.toFixed(1)} KB gzip` });
  expect(kb).toBeLessThan(PRESUPUESTO_JS_KB);
});

test('la fuente se precarga y existe (si cambia el archivo, actualizar FUENTE_PRECARGADA)', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page.locator(`link[rel="preload"][href="${FUENTE_PRECARGADA}"]`)).toHaveCount(1);
  expect((await request.get(FUENTE_PRECARGADA)).status()).toBe(200);
});

test('CLS bajo presupuesto al cargar y recorrer la home', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const alto = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < alto; y += 600) await page.evaluate((v) => window.scrollTo(0, v), y);
  const cls = await page.evaluate(
    () =>
      new Promise<number>((ok) => {
        let total = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[])
            if (!e.hadRecentInput) total += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => ok(total), 500);
      }),
  );
  expect(cls).toBeLessThan(PRESUPUESTO_CLS);
});
