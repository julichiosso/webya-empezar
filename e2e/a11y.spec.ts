import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Sin animaciones: axe mide el contraste sobre el estado final, no a mitad de un fundido.
test.use({ reducedMotion: 'reduce' });

async function auditar(page: Page) {
  // content-visibility:auto deja sin pintar las secciones fuera de pantalla y les reserva un alto
  // estimado: mientras axe recorre la página el layout se corre y toma el fondo de otra sección
  // (falsos positivos de contraste). Se audita con todo pintado; los colores reales no cambian.
  await page.addStyleTag({ content: '.e-seccion{content-visibility:visible!important}' });
  await page.waitForTimeout(300);
  const r = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
  ).toEqual([]);
}

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
]) {
  test(`${ruta} sin violaciones WCAG AA`, async ({ page }) => {
    await page.goto(ruta, { waitUntil: 'networkidle' });
    await auditar(page);
  });
}

test('configurador con todo elegido sin violaciones', async ({ page }) => {
  await page.goto('/armar', { waitUntil: 'networkidle' });
  const armar = page.locator('#armar');
  await armar.locator('[data-hidratado]').waitFor({ state: 'attached' });
  await armar.getByText('Pedidos online', { exact: true }).click();
  await armar.getByText('Otro', { exact: true }).click();
  await armar.getByRole('textbox', { name: 'Tu rubro' }).fill('Heladería');
  await auditar(page);
});

test('menú del celular abierto sin violaciones', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop', 'el menú es del celular y la tablet');
  await page.goto('/', { waitUntil: 'networkidle' });
  const boton = page.getByRole('button', { name: 'Abrir el menú' });
  test.skip(!(await boton.isVisible()), 'en este ancho el menú está en el header');
  await boton.click();
  await auditar(page);
});
