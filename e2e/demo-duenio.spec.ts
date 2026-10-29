import { expect, test, type Page } from '@playwright/test';
import { abrirDemo, auditar, carta, pedirMuzzarella } from './demo-helpers';

// Demo de Gastronomía: panel del dueño y sincronización cliente ↔ dueño.
const esEscritorio = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;
const panel = (page: Page) => page.getByTestId('panel-duenio');
const columna = (page: Page, nombre: string) =>
  panel(page).getByRole('region', { name: new RegExp(`^${nombre}`) });
const selector = (page: Page) => page.getByRole('group', { name: 'Qué querés ver' });

/** En celular cambia de cara con el selector; en escritorio no hace falta (se ven las dos). */
async function verComo(page: Page, cara: 'cliente' | 'dueño') {
  if (esEscritorio(page)) return;
  await selector(page)
    .getByRole('button', { name: new RegExp(`ver como ${cara}`, 'i') })
    .click();
}

test('el pedido del cliente llega al panel y el avance vuelve al cliente', async ({ page }) => {
  await abrirDemo(page);
  await pedirMuzzarella(page);

  // En celular, el selector avisa que hay un pedido nuevo para el dueño.
  if (!esEscritorio(page)) {
    await expect(selector(page).getByRole('button', { name: /1 pedido nuevo/ })).toBeVisible();
  }
  await verComo(page, 'dueño');
  const tarjeta = columna(page, 'Nuevos').getByRole('article', { name: '#1' });
  await expect(tarjeta).toBeVisible();
  await expect(tarjeta).toContainText('Mesa 4 · Julián');
  await tarjeta.getByRole('button', { name: 'Empezar a preparar el pedido #1' }).click();
  await expect(columna(page, 'Preparando').getByRole('article', { name: '#1' })).toBeVisible();

  await verComo(page, 'cliente');
  await expect(carta(page).getByText('Lo están preparando.')).toBeVisible();
});

test('en escritorio se ven las dos caras a la vez: carta a la izquierda, panel a la derecha', async ({
  page,
}) => {
  test.skip(!esEscritorio(page), 'solo escritorio');
  await abrirDemo(page);
  await expect(selector(page)).toBeHidden();
  const c = (await carta(page).boundingBox())!;
  const p = (await panel(page).boundingBox())!;
  expect(c.x + c.width).toBeLessThan(p.x);
});

test('en celular se ve una cara a la vez', async ({ page }) => {
  test.skip(esEscritorio(page), 'solo debajo de lg');
  await abrirDemo(page);
  await expect(carta(page)).toBeVisible();
  await expect(panel(page)).toHaveCount(0);
  await verComo(page, 'dueño');
  await expect(panel(page)).toBeVisible();
  await expect(carta(page)).toBeHidden();
  await expect(selector(page).getByRole('button', { name: /ver como dueño/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('dos pestañas: lo que pide una aparece en el panel de la otra (BroadcastChannel)', async ({
  page,
  context,
}) => {
  await abrirDemo(page);
  const duenio = await context.newPage();
  await abrirDemo(duenio);
  await verComo(duenio, 'dueño');
  await expect(panel(duenio).getByText('Acá encaja tu primer pedido.')).toBeVisible();

  await pedirMuzzarella(page);
  const tarjeta = columna(duenio, 'Nuevos').getByRole('article', { name: '#1' });
  await expect(tarjeta).toBeVisible();
  await tarjeta.getByRole('button', { name: 'Empezar a preparar el pedido #1' }).click();
  // Y el avance vuelve a la pestaña del cliente.
  await expect(carta(page).getByText('Lo están preparando.')).toBeVisible();
});

test('al recargar, los pedidos siguen ahí (localStorage)', async ({ page }) => {
  await abrirDemo(page);
  await pedirMuzzarella(page);
  await page.reload();
  await abrirDemo(page);
  await expect(carta(page).getByRole('heading', { name: 'Pedido #1' })).toBeVisible();
  await verComo(page, 'dueño');
  await expect(columna(page, 'Nuevos').getByRole('article', { name: '#1' })).toBeVisible();
});

test('simular, filtrar, comanda y borrar', async ({ page }) => {
  await abrirDemo(page);
  await verComo(page, 'dueño');
  const simular = panel(page).getByRole('button', { name: 'Simular un pedido' });
  await simular.click();
  await simular.click();
  await simular.click();
  await expect(panel(page).getByRole('article')).toHaveCount(3);
  await panel(page).getByText('Delivery', { exact: true }).click();
  await expect(panel(page).getByRole('article')).toHaveCount(1);
  await panel(page).getByText('Todos', { exact: true }).click();

  await panel(page).getByRole('button', { name: 'Ver la comanda del pedido #1' }).click();
  const comanda = page.getByRole('dialog', { name: 'Comanda #1' });
  await expect(comanda).toBeVisible();
  await expect(comanda.getByRole('button', { name: /imprimir/i })).toBeVisible();
  await page.keyboard.press('Escape');

  await panel(page).getByRole('button', { name: 'Borrar los pedidos de la demo' }).click();
  await expect(panel(page).getByText('Acá encaja tu primer pedido.')).toBeVisible();
});

test.describe('accesibilidad y movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('panel con pedidos sin violaciones WCAG AA; las tarjetas entran sin animación', async ({
    page,
  }) => {
    await abrirDemo(page);
    await verComo(page, 'dueño');
    await panel(page).getByRole('button', { name: 'Simular un pedido' }).click();
    await panel(page).getByRole('button', { name: 'Simular un pedido' }).click();
    await expect(page.locator('.pedido-entra').first()).toHaveCSS('animation-name', 'none');
    await auditar(page);
  });
});
