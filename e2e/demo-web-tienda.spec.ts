import { expect, test, type Page } from '@playwright/test';
import { DEMO_TIENDA_UI } from '../src/content/demos/tienda/datos';
import { DEMO_WEB_UI, RUBROS_WEB } from '../src/content/demos/web/datos';

/** La parte visible de la demo (escritorio o celular: cada una se monta una vez). */
const visible = (page: Page) => page.getByRole('main');

async function cerrarAviso(page: Page) {
  const ir = page.getByRole('button', { name: 'Ir a la demo' });
  if (await ir.isVisible().catch(() => false)) await ir.click();
}

test('demo web: cambiar de rubro cambia la página y WhatsApp avisa qué haría', async ({ page }) => {
  await page.goto('/demos/web', { waitUntil: 'networkidle' });
  await cerrarAviso(page);
  const gastronomia = RUBROS_WEB.find((r) => r.id === 'gastronomia')!;
  await visible(page)
    .getByRole('radio', { name: gastronomia.etiqueta })
    .filter({ visible: true })
    .click();
  await expect(
    visible(page).getByRole('heading', { name: gastronomia.hero.titulo }).filter({ visible: true }),
  ).toBeVisible();
  await visible(page)
    .getByRole('button', { name: DEMO_WEB_UI.whatsapp })
    .filter({ visible: true })
    .first()
    .click();
  await expect(page.getByRole('status').filter({ visible: true })).toContainText('WhatsApp');
});

test('demo tienda: el nombre y los productos aparecen al instante y "Quiero esta tienda" lleva el resumen', async ({
  page,
}) => {
  await page.goto('/demos/tienda', { waitUntil: 'networkidle' });
  await cerrarAviso(page);
  const nombre = visible(page)
    .getByRole('textbox', { name: DEMO_TIENDA_UI.nombre })
    .filter({ visible: true });
  await nombre.fill('Tienda Prueba');
  const cta = visible(page)
    .getByRole('link', { name: /Quiero esta tienda/ })
    .filter({ visible: true });
  const href = (await cta.getAttribute('href'))!;
  const texto = new URL(href).searchParams.get('text') ?? '';
  expect(texto).toContain('Negocio: Tienda Prueba');
  expect(texto).not.toContain('Julián');
  await expect(cta).toHaveAttribute('target', '_blank');

  // En el celular la tienda está en la otra cara; en escritorio, al lado.
  const ver = page.getByRole('button', { name: DEMO_TIENDA_UI.movil.ver });
  if (await ver.isVisible()) await ver.click();
  await expect(
    visible(page).getByRole('heading', { name: 'Tienda Prueba' }).filter({ visible: true }),
  ).toBeVisible();
});
