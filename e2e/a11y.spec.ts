import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { completarDatos, irAlPaso, negocioUnico, wizard } from './helpers';

// Sin animaciones: axe calcula el contraste sobre el estado final, no a mitad de un fade.
test.use({ reducedMotion: 'reduce' });

async function auditar(page: Page) {
  // Motion sigue animando opacity con reduced-motion: se espera al estado final para medir contraste.
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running'),
  );
  await page.waitForTimeout(400);
  const r = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
  ).toEqual([]);
}

test('página completa sin violaciones WCAG AA', async ({ page }) => {
  await page.goto('/empezar');
  await auditar(page);
});

test('paso 2 sin violaciones', async ({ page }) => {
  await irAlPaso(page, 2);
  await auditar(page);
});

test('paso 3 con errores visibles sin violaciones', async ({ page }) => {
  await irAlPaso(page, 3);
  await wizard(page).getByRole('button', { name: 'Enviar' }).click();
  await expect(wizard(page).locator('[aria-invalid="true"]').first()).toBeVisible();
  await auditar(page);
});

test('confirmación sin violaciones', async ({ page }) => {
  await irAlPaso(page, 3);
  await completarDatos(page, negocioUnico('a11y'));
  await wizard(page).getByRole('button', { name: 'Enviar' }).click();
  await expect(wizard(page).getByRole('heading', { name: /¡Listo/ })).toBeVisible();
  await auditar(page);
});

test('lo clickeable mide al menos 48px de alto', async ({ page }) => {
  await page.goto('/empezar');
  const chicos = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('main button, main a[href], summary')]
      .filter((el) => el.offsetParent !== null && !el.classList.contains('invisible'))
      .map((el) => ({
        el: el.textContent?.trim().slice(0, 30),
        h: el.getBoundingClientRect().height,
      }))
      .filter((x) => x.h > 0 && x.h < 47.5),
  );
  expect(chicos).toEqual([]);
});
