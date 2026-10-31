import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import {
  abrirWizard,
  completarDatos,
  elegirRubro,
  irAlPaso,
  negocioUnico,
  TITULO_GRACIAS,
  wizard,
} from './helpers';

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
  await abrirWizard(page);
  await auditar(page);
});

test('"Otro" con el error del pedido a medida sin violaciones', async ({ page }) => {
  await irAlPaso(page, 'rubro');
  await elegirRubro(page, 'otro');
  await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
  await expect(wizard(page).getByText(/aunque sea en pocas palabras/i)).toBeVisible();
  await auditar(page);
});

test('formulario con errores visibles sin violaciones', async ({ page }) => {
  await irAlPaso(page, 'negocio');
  await wizard(page).getByRole('button', { name: /ver cómo me queda/i }).click();
  await expect(wizard(page).locator('[aria-invalid="true"]').first()).toBeVisible();
  await auditar(page);
});

test('vista previa ("Así te queda") sin violaciones', async ({ page }) => {
  await irAlPaso(page, 'resultado');
  await auditar(page);
});

test('completar con errores visibles sin violaciones', async ({ page }) => {
  await irAlPaso(page, 'completar');
  await wizard(page).getByLabel('Nombre de tu negocio').fill('');
  await wizard(page).getByRole('button', { name: 'Enviar mis datos' }).click();
  await expect(wizard(page).locator('[aria-invalid="true"]').first()).toBeVisible();
  await auditar(page);
});

test('gracias sin violaciones', async ({ page }) => {
  await irAlPaso(page, 'completar', '', negocioUnico('a11y'));
  await completarDatos(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_GRACIAS })).toBeVisible();
  await auditar(page);
});

test('/marca (3 paletas aplicadas) sin violaciones', async ({ page }) => {
  await page.goto('/marca');
  await expect(page.getByRole('heading', { name: 'Paletas de marca' })).toBeVisible();
  await auditar(page);
});

test('/sistema (tokens, componentes en sus estados e ilustraciones) sin violaciones', async ({
  page,
}) => {
  await page.goto('/sistema');
  await expect(page.getByRole('heading', { level: 1, name: 'Sistema de diseño' })).toBeVisible();
  await auditar(page);
});

test('lo clickeable mide al menos 48px de alto', async ({ page }) => {
  await page.goto('/empezar');
  await abrirWizard(page);
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
