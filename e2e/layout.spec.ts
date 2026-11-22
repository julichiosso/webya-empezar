import { expect, test } from '@playwright/test';

/**
 * Layout de las páginas del sistema editorial en todos los viewports del config (celulares, tablet y
 * escritorios de 1440 y 1920): nada desborda, un solo h1 y el header con sus píldoras ("Menú" siempre;
 * "Escribinos" desde la tablet). "Armá tu sistema" vive en el menú, en la barra del celular y en la página.
 */
const RUTAS = [
  '/',
  '/turnero',
  '/pedidos',
  '/tienda',
  '/web',
  '/proyectos',
  '/nosotros',
  '/zona',
  '/privacidad',
];

for (const ruta of RUTAS) {
  test(`${ruta}: sin scroll horizontal, un h1 y las píldoras del header`, async ({ page }) => {
    await page.goto(ruta, { waitUntil: 'networkidle' });
    // Recorre la página para que entren todas las secciones (reveals y carriles).
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += 700) await page.evaluate((v) => window.scrollTo(0, v), y);

    const { scrollW, vw } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      vw: document.documentElement.clientWidth,
    }));
    expect(scrollW, 'ancho de página').toBeLessThanOrEqual(vw);
    await expect(page.locator('h1')).toHaveCount(1);

    const banner = page.getByRole('banner');
    const menu = banner.getByRole('button', { name: 'Abrir el menú' });
    await expect(menu).toBeVisible();
    expect((await menu.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    const escribinos = banner.getByRole('link', { name: /^Escribinos/ });
    if (vw >= 768) await expect(escribinos).toBeVisible();
    else await expect(escribinos).toBeHidden();
  });
}

test('la home entra en la primera pantalla: el lema, la bajada, el buscador, el sello y los clientes', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const vh = page.viewportSize()!.height;
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'Creá. Digitalizá. Crecé.',
  );
  const hero = page.locator('#hero');
  const visibles = [
    hero.getByText(/^Turnos, pedidos y tiendas online/),
    hero.getByRole('link', { name: '¿Qué necesita tu negocio?' }),
    hero.getByRole('link', { name: /^Escribinos por/ }),
    // En pantallas de menos de 600 px de alto (iPhone SE de 2016) la franja asoma al scrollear.
    ...(vh >= 600 ? [hero.getByRole('link', { name: /^Micio/ }).first()] : []),
  ];
  for (const el of visibles) {
    const caja = (await el.boundingBox())!;
    expect(caja.y + caja.height, (await el.textContent()) ?? '').toBeLessThanOrEqual(vh + 1);
  }
});

test('la home muestra dónde atendemos y lleva al mapa de zonas', async ({ page }) => {
  await page.goto('/');
  const zona = page.getByRole('link', { name: /Atención en San Francisco y San Jorge/ });
  await expect(zona).toHaveCount(1);
  await expect(zona).toBeVisible();
  await zona.click();
  await expect(page).toHaveURL(/\/zona$/);
  await expect(page.getByRole('img', { name: /Mapa de la zona/ })).toBeVisible();
});

test('menú en tarjetas: se abre, atrapa el foco, Escape lo cierra y lleva a la página', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const boton = page.getByRole('button', { name: 'Abrir el menú' });
  await boton.click();
  const menu = page.getByRole('dialog', { name: 'Menú' });
  await expect(menu).toBeVisible();
  // El foco entra al primer link del sitio; la píldora pasa a "Cerrar".
  await expect(menu.getByRole('navigation').getByRole('link').first()).toBeFocused();
  await expect(page.getByRole('button', { name: 'Cerrar el menú' })).toBeVisible();
  // Shift+Tab desde el primero da la vuelta adentro del menú.
  await page.keyboard.press('Shift+Tab');
  await expect(menu.locator(':focus')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(page.getByRole('button', { name: 'Abrir el menú' })).toBeFocused();
  await page.getByRole('button', { name: 'Abrir el menú' }).click();
  await menu.getByRole('link', { name: 'Quiénes somos', exact: true }).click();
  await expect(page).toHaveURL(/\/nosotros$/);
});
