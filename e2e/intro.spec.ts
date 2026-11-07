import { expect, test, type Page } from '@playwright/test';
import { TELON } from '../src/content/telon';
import { CLIENTES } from '../src/content/clientes';

// "El telón", después del hero. Solo corre con la intro compilada:
//   NEXT_PUBLIC_INTRO_LOGO=1 E2E_INTRO=1 pnpm exec playwright test intro.spec.ts
// (el flag se resuelve al compilar, así que necesita su propio build; la suite normal la apaga).
test.skip(!process.env.E2E_INTRO, 'requiere NEXT_PUBLIC_INTRO_LOGO=1 al compilar');

const telon = (page: Page) => page.locator('[data-telon]');
const alto = (page: Page) => page.viewportSize()!.height;
const sobra = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const inicioTelon = (page: Page) =>
  telon(page).evaluate((e) => e.getBoundingClientRect().top + window.scrollY);

test('la primera pantalla es el hero: dice qué es WebYa, sin esperar al telón', async ({
  page,
}) => {
  await page.goto('/empezar');
  await expect(page.locator('h1')).toBeInViewport();
  await expect(page.locator('[data-rubro="gastronomia"]')).toBeInViewport();
  await expect(telon(page)).not.toBeInViewport();
  // Los rótulos salen de content/clientes.
  for (const c of CLIENTES) await expect(page.getByText(c.rotulo)).toBeAttached();
});

test('el recorrido no pasa de 200vh y el enlace para saltar no tapa nada hasta recibir foco', async ({
  page,
}) => {
  await page.goto('/empezar');
  const h = await telon(page).evaluate((e) => e.getBoundingClientRect().height);
  expect(h).toBeLessThanOrEqual(alto(page) * 2 + 1);
  await expect(page.getByRole('link', { name: TELON.saltar })).toHaveCSS('opacity', '0');
});

test('el logo se abre al recorrerlo: empieza chico, crece, y al final se ve la pared', async ({
  page,
}) => {
  await page.goto('/empezar');
  const inicio = await inicioTelon(page);
  const escala = async (f: number) => {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: 'instant' }),
      inicio + alto(page) * f,
    );
    await page.waitForTimeout(150);
    return page.locator('[data-telon] svg').evaluate((e) => {
      const m = new DOMMatrix(getComputedStyle(e).transform);
      return m.a;
    });
  };
  const alEntrar = await escala(0);
  const alMedio = await escala(0.5);
  expect(alEntrar).toBeLessThan(1.1);
  expect(alMedio).toBeGreaterThan(alEntrar + 1);
});

test('sin scroll horizontal en ningún punto, ni antes ni después del telón', async ({ page }) => {
  await page.goto('/empezar');
  const inicio = await inicioTelon(page);
  for (const f of [-0.5, 0, 0.25, 0.5, 0.75, 1, 1.5, 2]) {
    await page.evaluate((y) => window.scrollTo(0, y), inicio + alto(page) * f);
    await page.waitForTimeout(80);
    expect(await sobra(page), `en ${f}`).toBeLessThanOrEqual(0);
  }
});

test('las palabras de fondo se esconden mientras el telón está en pantalla', async ({ page }) => {
  await page.goto('/empezar');
  const capa = page.locator('[data-plena]');
  await expect(capa).toHaveAttribute('data-intro', 'no');
  const inicio = await inicioTelon(page);
  await page.evaluate((y) => window.scrollTo(0, y), inicio + alto(page) * 0.5);
  await expect(capa).toHaveAttribute('data-intro', 'si');
  await page.evaluate((y) => window.scrollTo(0, y), inicio + alto(page) * 2.5);
  await expect(capa).toHaveAttribute('data-intro', 'no');
});

test('"Saltar" funciona con el teclado y lleva a los casos de clientes', async ({ page }) => {
  await page.goto('/empezar');
  const saltar = page.getByRole('link', { name: TELON.saltar });
  await saltar.focus();
  await expect(saltar).toBeFocused();
  await expect(saltar).toHaveCSS('opacity', '1');
  // El foco lleva hasta el telón con scroll suave: se aprieta Enter cuando llegó.
  await expect(telon(page)).toBeInViewport();
  await page.waitForTimeout(700);
  await page.keyboard.press('Enter');
  await expect(page.locator('#crearon-title')).toBeInViewport();
});

test.describe('con movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no hay telón y el hero sigue primero', async ({ page }) => {
    await page.goto('/empezar');
    await expect(telon(page)).toBeHidden();
    await expect(page.locator('h1')).toBeInViewport();
  });
});
