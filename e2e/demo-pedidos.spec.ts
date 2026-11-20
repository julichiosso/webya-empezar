import { expect, test, type Page } from '@playwright/test';
import { BARRA_DEMOS } from '../src/content/demos/hub';
import { APP, CARRITO, COMANDA, ENVIADO, PANEL, VISTAS } from '../src/content/demos/pedidos/ui';

/** Entra a la demo y pasa el aviso "Esto es una demo" (se abre solo la primera vez). */
async function entrar(page: Page, ruta: string) {
  await page.goto(ruta);
  await page.getByRole('button', { name: BARRA_DEMOS.aviso.cerrar }).click();
}

/**
 * Demo del sistema de pedidos: el pedido que arma el cliente entra al panel del dueño en su franja y
 * se puede ver la comanda. En escritorio las dos caras están juntas; en celular se cambia abajo.
 */
const escritorio = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;

async function pedir(page: Page) {
  await entrar(page, '/demos/pedidos');
  await page
    .getByRole('button', { name: /Muzzarella/ })
    .first()
    .click();
  await page.getByRole('button', { name: /Agregar al carrito/ }).click();
  await page.getByRole('button', { name: /Ver el carrito/ }).click();
  await expect(page.getByText(/Demora estimada/)).toBeVisible();
  await page.getByRole('textbox', { name: CARRITO.nombre }).fill('Ana');
  await page.getByRole('textbox', { name: CARRITO.apellido }).fill('Pérez');
  await page.getByRole('button', { name: CARRITO.confirmar }).click();
  const dialogo = page.getByRole('dialog', { name: ENVIADO.titulo });
  await expect(dialogo).toContainText('soy Ana Pérez');
  await dialogo.getByRole('button', { name: ENVIADO.enviar }).click();
  await page.getByRole('button', { name: ENVIADO.verPanel }).click();
}

test('el pedido del cliente entra al panel y sale la comanda', async ({ page }) => {
  await pedir(page);
  const fila = page
    .locator('li')
    .filter({ hasText: PANEL.nuevo })
    .filter({ has: page.getByRole('button', { name: PANEL.verComanda }) })
    .last();
  await expect(fila).toContainText('Ana Pérez');
  await expect(fila).toContainText(PANEL.estadoPedido.confirmado);
  await fila.getByRole('button', { name: PANEL.verComanda }).click();
  const comanda = page.getByRole('dialog', { name: COMANDA.aria });
  await expect(comanda).toContainText('Ana Pérez');
  await expect(comanda).toContainText(/Comanda #\d+/);
  await page.keyboard.press('Escape');
  await expect(comanda).toBeHidden();
});

test('cerrar el local desde el panel se ve en la app del cliente', async ({ page }) => {
  await entrar(page, '/demos/pedidos');
  if (!escritorio(page)) await page.getByRole('button', { name: VISTAS.duenio }).click();
  await page.getByRole('switch', { name: PANEL.localAbierto }).click();
  if (!escritorio(page)) await page.getByRole('button', { name: VISTAS.cliente }).click();
  await expect(page.getByText(APP.cerrado).filter({ visible: true })).toBeVisible();
});

test('/demo/gastronomia lleva a la demo nueva', async ({ page }) => {
  await page.goto('/demo/gastronomia');
  await expect(page).toHaveURL(/\/demos\/pedidos$/);
});

test('la demo avisa que es una demo y qué más hace el sistema real', async ({ page }) => {
  await page.goto('/demos/pedidos');
  const aviso = page.getByRole('region', { name: BARRA_DEMOS.aviso.titulo });
  await expect(aviso).toContainText(BARRA_DEMOS.aviso.ademas);
  await page.getByRole('button', { name: BARRA_DEMOS.aviso.cerrar }).click();
  await expect(aviso).toBeHidden();
  await page.getByRole('button', { name: BARRA_DEMOS.infoAria }).click();
  await expect(aviso).toBeVisible();
});

test('desde /demos se elige qué sistema probar', async ({ page }) => {
  await page.goto('/demos');
  await page
    .getByRole('link', { name: /Turnos con seña/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/demos\/turnos$/);
});
