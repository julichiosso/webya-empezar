import { expect, test, type Page } from '@playwright/test';
import { TELON } from '../src/content/telon';
import { CLIENTES } from '../src/content/clientes';

// Intro "El telón". Solo corre con la intro compilada:
//   NEXT_PUBLIC_INTRO_LOGO=1 E2E_INTRO=1 pnpm exec playwright test intro.spec.ts
// (el flag se resuelve al compilar, así que necesita su propio build; por defecto está apagada).
test.skip(!process.env.E2E_INTRO, 'requiere NEXT_PUBLIC_INTRO_LOGO=1 al compilar');

const telon = (page: Page) => page.locator('[data-telon]');
const alto = (page: Page) => page.viewportSize()!.height;
const sobra = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test('desde el primer cuadro: logo, CTA en el header y h1 + wizard ya en el DOM', async ({
  page,
}) => {
  await page.goto('/empezar');
  await expect(telon(page)).toBeVisible();
  await expect(page.getByRole('banner').getByRole('link', { name: 'Crear mi sistema' })).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('#wizard')).toBeAttached();
  // Los rótulos salen de content/clientes.
  for (const c of CLIENTES) await expect(page.getByText(c.rotulo)).toBeAttached();
});

test('el recorrido total de la intro no pasa de 200vh y el scroll es nativo', async ({ page }) => {
  await page.goto('/empezar');
  const h = await telon(page).evaluate((e) => e.getBoundingClientRect().height);
  expect(h).toBeLessThanOrEqual(alto(page) * 2 + 1);
});

test('al abrirse la intro el hero queda a la vista y las palabras de fondo vuelven', async ({
  page,
}) => {
  await page.goto('/empezar');
  const capa = page.locator('[data-plena]');
  await expect(capa).toHaveAttribute('data-intro', 'si');
  await page.evaluate((y) => window.scrollTo(0, y), alto(page) * 0.5);
  await expect(capa).toHaveAttribute('data-intro', 'si');
  await page.evaluate((y) => window.scrollTo(0, y), alto(page) * 2.2);
  await expect(capa).toHaveAttribute('data-intro', 'no');
  await expect(page.locator('h1')).toBeInViewport();
  expect(await sobra(page)).toBeLessThanOrEqual(0);
});

test('sin scroll horizontal en ningún punto del recorrido y al volver al tope se reconstruye', async ({
  page,
}) => {
  await page.goto('/empezar');
  for (const f of [0, 0.25, 0.5, 0.75, 1, 1.5, 2]) {
    await page.evaluate((y) => window.scrollTo(0, y), alto(page) * f);
    await page.waitForTimeout(80);
    expect(await sobra(page), `en ${f}`).toBeLessThanOrEqual(0);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('[data-plena]')).toHaveAttribute('data-intro', 'si');
  const escala = await page.locator('[data-telon] svg').evaluate((e) => getComputedStyle(e).transform);
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(escala);
});

test('"Saltar" se alcanza con el teclado y lleva al hero', async ({ page }) => {
  await page.goto('/empezar');
  const saltar = page.getByRole('link', { name: TELON.saltar });
  for (let i = 0; i < 10 && !(await saltar.evaluate((e) => e === document.activeElement)); i++)
    await page.keyboard.press('Tab');
  await expect(saltar).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('h1')).toBeInViewport();
});

test.describe('con movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no hay intro: hero directo', async ({ page }) => {
    await page.goto('/empezar');
    await expect(telon(page)).toBeHidden();
    await expect(page.locator('h1')).toBeInViewport();
  });
});
