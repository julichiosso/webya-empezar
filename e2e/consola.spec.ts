import { expect, test, type Page } from '@playwright/test';
import { abrirWizard, elegirRubro, TITULO_NEGOCIO, TITULO_RUBRO, wizard } from './helpers';

/** Junta errores y advertencias de la consola (incluye los de hidratación) y excepciones de la página. */
function vigilarConsola(page: Page) {
  const problemas: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problemas.push(`${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => problemas.push(`pageerror: ${e.message}`));
  return problemas;
}

test('sin errores ni advertencias de consola al cargar, tocar un rubro y avanzar', async ({
  page,
}) => {
  const problemas = vigilarConsola(page);
  await page.goto('/empezar', { waitUntil: 'networkidle' });
  await abrirWizard(page);
  await elegirRubro(page, 'gastronomia');
  await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  expect(problemas).toEqual([]);
});

test('hidratar con estado guardado en sessionStorage no genera diferencias servidor/cliente', async ({
  page,
}) => {
  const problemas = vigilarConsola(page);
  await page.addInitScript(() => {
    sessionStorage.setItem(
      'webya:empezar:v3',
      JSON.stringify({ paso: 'negocio', rubro: 'comercio', datos: { nombreNegocio: 'Luna' } }),
    );
  });
  await page.goto('/empezar', { waitUntil: 'networkidle' });
  await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  await expect(wizard(page).getByLabel('Nombre de tu negocio')).toHaveValue('Luna');
  expect(problemas).toEqual([]);
});

test('tocar un rubro antes de que llegue el wizard igual avanza (sin perder el toque)', async ({
  page,
}) => {
  const problemas = vigilarConsola(page);
  // Lo que se pide después de cargar (el chunk del wizard) llega tarde: el toque pasa sobre el
  // HTML del servidor.
  let cargada = false;
  page.on('load', () => (cargada = true));
  await page.route(/_next\/static\/chunks\/.*\.js/, async (route) => {
    if (cargada) await new Promise((r) => setTimeout(r, 800));
    await route.continue();
  });
  await page.goto('/empezar', { waitUntil: 'load' });
  await expect(wizard(page).getByRole('heading', { name: TITULO_RUBRO })).toBeVisible();
  await elegirRubro(page, 'comercio');
  await expect(wizard(page).locator('[data-rubro="comercio"]')).toHaveAttribute('data-cargando');
  await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  expect(problemas).toEqual([]);
});
