import { expect, test, type Page } from '@playwright/test';

/** El número que fija playwright.config para el build de E2E. */
const NUMERO = '5491100000000';

const armar = (page: Page) => page.locator('#armar');

/** Se espera a que el configurador ya responda (y haya leído ?tipo=). */
async function abrir(page: Page, ruta: string) {
  await page.goto(ruta, { waitUntil: 'networkidle' });
  await page.locator('#armar [data-hidratado]').waitFor({ state: 'attached' });
}
const botonEnviar = (page: Page) =>
  armar(page)
    .getByRole('link', { name: 'Enviarnos mi pedido por WhatsApp' })
    .filter({ visible: true });

function textoDe(href: string) {
  const u = new URL(href);
  expect(u.host).toBe('wa.me');
  expect(u.pathname).toBe(`/${NUMERO}`);
  return u.searchParams.get('text') ?? '';
}

test('tres toques: tipo, rubro y el WhatsApp sale con el pedido escrito, sin requests', async ({
  page,
}) => {
  await abrir(page, '/armar');
  const pedidos: string[] = [];
  // Requests de datos (fetch/xhr/navegación).
  page.on('request', (r) => {
    if (['fetch', 'xhr', 'document'].includes(r.resourceType())) pedidos.push(r.url());
  });

  await armar(page).getByText('Turnero con seña', { exact: true }).click();
  await armar(page).getByText('Peluquería o estética', { exact: true }).click();

  const href = await botonEnviar(page).getAttribute('href');
  const texto = textoDe(href!);
  expect(texto).toContain('Quiero armar: Turnero con seña.');
  expect(texto).toContain('Rubro: Peluquería o estética.');
  expect(texto).toContain('- Seña del 50% al reservar');
  await expect(botonEnviar(page)).toHaveAttribute('target', '_blank');
  // Estado 100 % en el cliente: elegir no dispara ninguna request.
  expect(pedidos).toEqual([]);

  // El resumen en vivo muestra lo elegido.
  await expect(armar(page).getByRole('complementary')).toContainText('Turnero con seña');
});

test('?tipo= preselecciona el sistema y los módulos se pueden sacar', async ({ page }) => {
  await abrir(page, '/armar?tipo=pedidos');
  await expect(armar(page).getByRole('radio', { name: /Pedidos online/ })).toBeChecked();
  await expect(armar(page).getByRole('progressbar').first()).toHaveAttribute('aria-valuenow', '2');

  const franjas = armar(page).getByRole('switch', { name: /Pedidos por franja de 15 minutos/ });
  await expect(franjas).toBeChecked();
  await armar(page)
    .locator('form')
    .getByText('Pedidos por franja de 15 minutos', { exact: true })
    .click();
  await expect(franjas).not.toBeChecked();
  const texto = textoDe((await botonEnviar(page).getAttribute('href'))!);
  expect(texto).not.toContain('franja');
});

test('sin tipo elegido el botón no se envía y lleva al primer paso', async ({ page }) => {
  await abrir(page, '/armar');
  const deshabilitado = armar(page)
    .getByRole('button', { name: 'Enviarnos mi pedido por WhatsApp' })
    .filter({ visible: true });
  await expect(deshabilitado).toHaveAttribute('aria-disabled', 'true');
  // aria-disabled: Playwright no lo considera accionable, pero la persona sí puede tocarlo.
  await deshabilitado.click({ force: true });
  await expect(armar(page).getByRole('radio').first()).toBeFocused();
});

test('se usa con teclado: flechas para elegir y espacio para los módulos', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop', 'teclado: escritorio');
  await abrir(page, '/armar');
  const primero = armar(page).getByRole('radio').first();
  await primero.focus();
  await page.keyboard.press('Space');
  await expect(primero).toBeChecked();
  await page.keyboard.press('ArrowRight');
  await expect(armar(page).getByRole('radio', { name: /Pedidos online/ })).toBeChecked();
});

test('desde una página de producto, "Armá tu sistema" llega con el servicio elegido', async ({
  page,
}) => {
  await page.goto('/turnero', { waitUntil: 'networkidle' });
  await page.getByRole('main').getByRole('link', { name: 'Armá tu sistema' }).first().click();
  await expect(page).toHaveURL(/\/armar\?tipo=turnero$/);
  await page.locator('#armar [data-hidratado]').waitFor({ state: 'attached' });
  await expect(armar(page).getByRole('radio', { name: /Turnero con seña/ })).toBeChecked();
});

test('las rutas viejas redirigen a las nuevas', async ({ page }) => {
  await page.goto('/pizzerias');
  await expect(page).toHaveURL(/\/pedidos$/);
  await page.goto('/tiendas');
  await expect(page).toHaveURL(/\/tienda$/);
});

test('/empezar (link viejo de Instagram) lleva a la home', async ({ page }) => {
  await page.goto('/empezar');
  await expect(page).toHaveURL(/\/$/);
});
