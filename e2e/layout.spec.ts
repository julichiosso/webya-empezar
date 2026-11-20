import { expect, test } from '@playwright/test';

/**
 * Layout de las páginas del sistema editorial en todos los viewports del config (celulares, tablet y
 * escritorios de 1440 y 1920): nada desborda, un solo h1 y "Armá tu sistema" siempre a mano (en el
 * header en escritorio, en la barra de abajo en el celular).
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
  test(`${ruta}: sin scroll horizontal, un h1 y el CTA del header visible`, async ({ page }) => {
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

    const cta = page
      .getByRole('link', { name: 'Armá tu sistema', exact: true })
      .filter({ visible: true })
      .first();
    await expect(cta).toBeVisible();
    const caja = await cta.boundingBox();
    expect(caja!.height).toBeGreaterThanOrEqual(44);
  });
}

test('la home entra en la primera pantalla: el lema, las dos acciones y el buscador', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const vh = page.viewportSize()!.height;
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'Creá. Digitalizá. Crecé.',
  );
  // En escritorio están en el hero; en el celular, en la barra fija de abajo. Siempre a la vista.
  for (const nombre of ['Armá tu sistema', 'Escribinos']) {
    const cajas = await page
      .getByRole('link', { name: new RegExp(`^${nombre}`) })
      .evaluateAll((els) =>
        els.map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0),
      );
    expect(
      cajas.some((r) => r.top >= 0 && r.bottom <= vh),
      nombre,
    ).toBe(true);
  }
  const hero = page.locator('#titulo-hero').locator('xpath=ancestor::section');
  const buscador = await hero.getByRole('combobox').boundingBox();
  expect(buscador!.y, 'buscador').toBeLessThan(vh);
});

test('la home muestra dónde atendemos con el mapa de zonas, que lleva a /zona', async ({
  page,
}) => {
  await page.goto('/');
  const zona = page.getByRole('link', { name: /¿Sos de San Jorge, San Francisco o la zona\?/ });
  await expect(zona).toHaveCount(1);
  await expect(zona.getByRole('img', { name: /Mapa chico de las dos zonas/ })).toBeVisible();
  await zona.click();
  await expect(page).toHaveURL(/\/zona$/);
  await expect(page.getByRole('img', { name: /Mapa de la zona/ })).toBeVisible();
});

test('menú del celular: se abre, lleva a la página y se cierra con Escape', async ({
  page,
}, info) => {
  test.skip(info.project.name === 'desktop', 'el menú es del celular y la tablet');
  await page.goto('/', { waitUntil: 'networkidle' });
  const boton = page.getByRole('button', { name: 'Abrir el menú' });
  test.skip(!(await boton.isVisible()), 'en este ancho el menú está en el header');
  await boton.click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Abrir el menú' })).toBeVisible();
  await page.getByRole('button', { name: 'Abrir el menú' }).click();
  await page.getByRole('banner').getByRole('link', { name: 'Quiénes somos' }).click();
  await expect(page).toHaveURL(/\/nosotros$/);
});
