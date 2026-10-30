import { expect, test, type Page } from '@playwright/test';
import { abrirDemo, carta } from './demo-helpers';
import {
  leerLeads,
  tocar,
  TITULO_PASO_2,
  TITULO_PASO_3,
  TITULO_FINAL,
  wizard,
  abrirWizard,
  pasarNecesidad,
} from './helpers';

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

test('"Quiero esto para mi local" abre el wizard precargado y el lead se guarda con origen demo', async ({
  page,
}, testInfo) => {
  // Único por test y dentro del tope de 40 caracteres del nombre del local.
  const negocio = `Tito ${testInfo.project.name} ${Date.now().toString(36)}`;
  await abrirDemo(page);
  await abrirPersonalizar(page);
  await page.getByRole('textbox', { name: 'Nombre de tu local' }).fill(negocio);
  await page.getByText('Ciruela', { exact: true }).click();
  await page
    .getByRole('link', { name: /quiero esto para mi local|lo quiero para mi local/i })
    .first()
    .click();

  await expect(page).toHaveURL(/\/empezar#wizard$/);
  await expect(wizard(page).getByRole('heading', { name: TITULO_PASO_2 })).toBeVisible();
  await expect(
    wizard(page).getByText(/Trajimos lo que armaste en la demo: Pizzería, paleta Ciruela/),
  ).toBeVisible();
  // Módulos de la demo activados; lo sugerido que no está (turnos), apagado.
  for (const nombre of [/^carta con qr/i, /^pagos online/i, /^avisos automáticos/i]) {
    await expect(wizard(page).getByRole('checkbox', { name: nombre })).toBeChecked();
  }
  await expect(
    wizard(page).getByRole('checkbox', { name: /^turnos y reservas/i }),
  ).not.toBeChecked();

  await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_PASO_3 })).toBeVisible();
  await expect(wizard(page).getByLabel('Nombre de tu negocio')).toHaveValue(negocio);
  await wizard(page).getByLabel('Tu nombre').fill('Ana Pérez');
  await wizard(page).getByLabel('Tu WhatsApp').fill('1123456789');
  await wizard(page).getByRole('button', { name: 'Enviar' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_FINAL })).toBeVisible();

  await expect
    .poll(async () => (await leerLeads()).find((l) => l.nombre_negocio === negocio))
    .toMatchObject({
      origen: 'demo_gastronomia',
      rubro: 'gastronomia',
      modulos: expect.arrayContaining(['carta_qr', 'pagos', 'notificaciones']),
    });
});

test('en /empezar, elegir Gastronomía muestra la entrada a la demo', async ({ page }) => {
  await page.goto('/empezar');
  await abrirWizard(page);
  // El rubro es el paso 2 del flujo nuevo: primero se pasa el de "¿Qué necesitás?".
  await pasarNecesidad(page);
  await tocar(page, /gastronomía/i);
  const entrada = wizard(page).getByRole('link', { name: /mirá cómo quedaría/i });
  await expect(entrada).toBeVisible();
  await expect(entrada).toHaveAttribute('href', '/demo/gastronomia');
});
