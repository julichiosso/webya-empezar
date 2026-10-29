import { expect, test } from '@playwright/test';
import { abrirDemo, auditar, AVISO, carta, pedirMuzzarella, plato } from './demo-helpers';

// Demo de Gastronomía, lado del cliente (la carta). Corre en todos los viewports.
test('el cliente hace su primer pedido y ve el seguimiento', async ({ page }) => {
  await abrirDemo(page);
  await expect(page.getByRole('note')).toHaveText(AVISO);
  await pedirMuzzarella(page);
  const titulo = carta(page).getByRole('heading', { name: 'Pedido #1' });
  await expect(titulo).toBeVisible();
  await expect(titulo).toBeFocused();
  await expect(carta(page).getByText('El local recibió tu pedido.')).toBeVisible();
  await expect(carta(page).getByText('Mesa 4 · Julián')).toBeVisible();
});

test('el aviso de demo sigue a la vista al bajar por la carta', async ({ page }) => {
  await abrirDemo(page);
  await page.mouse.wheel(0, 1500);
  await carta(page).evaluate((el) => el.querySelector('div')?.scrollBy(0, 1500));
  await expect(page.getByRole('note')).toBeInViewport();
});

test('teclado: Enter abre el plato, Escape lo cierra y el foco vuelve', async ({ page }) => {
  await abrirDemo(page);
  const muzza = plato(page, /^muzzarella/i);
  await muzza.focus();
  await page.keyboard.press('Enter');
  const hoja = page.getByRole('dialog', { name: 'Muzzarella' });
  await expect(hoja).toBeFocused();
  // El foco no se escapa de la hoja.
  for (let i = 0; i < 15; i++) await page.keyboard.press('Tab');
  expect(await hoja.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(hoja).toBeHidden();
  await expect(muzza).toBeFocused();
});

test('sin scroll horizontal, con la carta y con una hoja abierta', async ({ page }) => {
  await abrirDemo(page);
  const sobra = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
  expect(await sobra()).toBeLessThanOrEqual(0);
  await plato(page, /^muzzarella/i).click();
  expect(await sobra()).toBeLessThanOrEqual(0);
  const cuerpo = page.getByRole('dialog').locator('div.overflow-y-auto');
  expect(await cuerpo.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(0);
});

test('lo clickeable de la demo mide al menos 48px de alto', async ({ page }) => {
  await abrirDemo(page);
  await plato(page, /^muzzarella/i).click();
  const chicos = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('main button, main a[href], main label')]
      .filter((el) => el.offsetParent !== null && el.getBoundingClientRect().height > 0)
      .filter((el) => !el.querySelector('input[type=search]'))
      .map((el) => ({
        el: el.textContent?.trim().slice(0, 30),
        h: el.getBoundingClientRect().height,
      }))
      .filter((x) => x.h < 47.5),
  );
  expect(chicos).toEqual([]);
});

test('en escritorio la carta va en un celular y la hoja se abre adentro', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, 'solo escritorio');
  await abrirDemo(page);
  const marco = (await carta(page).boundingBox())!;
  expect(marco.width).toBeLessThan(420);
  await plato(page, /^muzzarella/i).click();
  const hoja = (await page.getByRole('dialog').boundingBox())!;
  expect(hoja.x).toBeGreaterThanOrEqual(marco.x - 1);
  expect(hoja.x + hoja.width).toBeLessThanOrEqual(marco.x + marco.width + 1);
});

test('arrastrar la hoja hacia abajo la cierra', async ({ page }) => {
  await abrirDemo(page);
  await plato(page, /^muzzarella/i).click();
  const hoja = page.getByRole('dialog', { name: 'Muzzarella' });
  // Se mide la manija cuando la hoja terminó de subir (si no, el "dedo" cae más abajo).
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running'),
  );
  const titulo = (await hoja.getByRole('heading', { name: 'Muzzarella' }).boundingBox())!;
  await page.mouse.move(titulo.x + 4, titulo.y + 4);
  await page.mouse.down();
  await page.mouse.move(titulo.x + 4, titulo.y + 80, { steps: 4 });
  await page.mouse.move(titulo.x + 4, titulo.y + 200, { steps: 4 });
  await page.mouse.up();
  await expect(hoja).toBeHidden();
});

test.describe('accesibilidad y movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('carta, plato y seguimiento sin violaciones WCAG AA', async ({ page }) => {
    await abrirDemo(page);
    await auditar(page);
    await plato(page, /^muzzarella/i).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await auditar(page);
    await page.keyboard.press('Escape');
    await pedirMuzzarella(page);
    await expect(carta(page).getByRole('heading', { name: 'Pedido #1' })).toBeVisible();
    await auditar(page);
  });

  test('la hoja aparece sin animación', async ({ page }) => {
    await abrirDemo(page);
    await plato(page, /^muzzarella/i).click();
    await expect(page.locator('.hoja')).toHaveCSS('animation-name', 'none');
  });
});
