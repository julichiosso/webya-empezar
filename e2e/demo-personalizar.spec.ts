import { expect, test, type Page } from '@playwright/test';
import { abrirDemo, carta } from './demo-helpers';

// Demo de Gastronomía: personalización, compartir y el CTA hasta el lead.
const esEscritorio = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;

/** En celular los campos de personalización están plegados: se abren. */
async function abrirPersonalizar(page: Page) {
  if (!esEscritorio(page)) {
    await page.getByRole('button', { name: 'Personalizá tu demo' }).click();
  }
}

test('personalizar nombre, cocina y paleta repinta la demo; la URL compartida la reproduce', async ({
  page,
}) => {
  await abrirDemo(page);
  await abrirPersonalizar(page);
  await page.getByRole('textbox', { name: 'Nombre de tu local' }).fill('Lo de Tito');
  await page.getByText('Parrilla', { exact: true }).click();
  await page.getByText('Pileta', { exact: true }).click();

  await expect(carta(page).getByRole('heading', { name: 'Lo de Tito' })).toBeVisible();
  await expect(carta(page).getByRole('button', { name: /bife de chorizo/i })).toBeVisible();
  // La paleta se aplica por variables CSS en el contenedor de la demo.
  const acento = () =>
    page.evaluate(() =>
      getComputedStyle(document.querySelector('[data-testid="demo-cliente"]')!).getPropertyValue(
        '--accent',
      ),
    );
  expect((await acento()).trim()).toBe('#38bdf8');

  // Otra persona abre el link compartido (contexto limpio): ve lo mismo.
  const otra = await page.context().browser()!.newPage({ viewport: page.viewportSize()! });
  // Contexto nuevo (sin baseURL): la URL va absoluta, como llega por WhatsApp o el QR.
  await otra.goto(
    new URL('/demo/gastronomia?local=Lo%20de%20Tito&paleta=pileta&cocina=parrilla', page.url())
      .href,
  );
  await expect(
    otra.getByTestId('demo-cliente').getByRole('heading', { name: 'Lo de Tito' }),
  ).toBeVisible();
  await otra.close();
});

test('escritorio: "Probalo en tu celular" muestra el QR', async ({ page }) => {
  test.skip(!esEscritorio(page), 'el QR es para escritorio');
  await abrirDemo(page);
  await page.getByRole('button', { name: 'Probalo en tu celular' }).click();
  await expect(page.getByRole('img', { name: /código qr/i })).toBeVisible();
});

test('"Quiero esto para mi local" lleva al configurador con pedidos elegido', async ({ page }) => {
  await abrirDemo(page);
  await abrirPersonalizar(page);
  await page
    .getByRole('link', { name: /quiero esto para mi local|lo quiero para mi local/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/pizzerias#armar$/);
  await expect(
    page.locator('#armar').getByRole('radio', { name: /Sistema de pedidos/ }),
  ).toBeChecked();
});
