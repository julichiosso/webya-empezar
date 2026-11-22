import { expect, test, type Page } from '@playwright/test';
import { PROTECTORAS } from '../src/content/protectoras';

/** Sin el aviso "Esto es una demo" que se abre solo la primera vez. */
async function abrir(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('webya:demo-aviso:protectora', '1'));
  await page.goto('/demos/protectora', { waitUntil: 'networkidle' });
}

/** En el celular se cambia de vista; en la compu las dos están a la vista (no hay selector). */
async function vista(page: Page, nombre: 'Vista pública' | 'Vista administración') {
  const b = page.getByRole('button', { name: nombre, exact: true });
  if (await b.isVisible()) await b.click();
}

test.describe('demo protectora', () => {
  test('adoptar: ficha, solicitud con consentimiento y aviso en la administración', async ({
    page,
  }) => {
    await abrir(page);
    await page.getByRole('button', { name: /^Luna/ }).click();
    await page.getByRole('button', { name: 'Quiero adoptar' }).click();
    await page.getByRole('textbox', { name: 'Tu nombre' }).fill('Ana');
    await page.getByRole('textbox', { name: 'Tu celular' }).fill('3406 123456');
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await expect(page.getByText('Para enviar, aceptá el uso de tus datos.')).toBeVisible();
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await expect(page.getByText('¡Solicitud enviada!')).toBeVisible();

    await vista(page, 'Vista administración');
    await expect(
      page.getByRole('status').filter({ hasText: 'Ana quiere adoptar a Luna' }),
    ).toBeVisible();
    await expect(page.getByText('Ana · Luna')).toBeVisible();
    await page.getByRole('button', { name: 'Pasar a entrevista' }).first().click();
  });

  test('hacerse socio da el carnet digital', async ({ page }) => {
    await abrir(page);
    await page.getByRole('button', { name: 'Hacete socio' }).click();
    await page.getByRole('textbox', { name: 'Tu nombre' }).fill('Bruno');
    await page.getByRole('button', { name: 'Pagar la primera cuota' }).click();
    const carnet = page.getByRole('status', { name: 'Carnet de socio' });
    await expect(carnet).toContainText('Bruno');
    await expect(carnet).toContainText('Al día');
  });

  test('donar mueve la barra de la campaña y anotarse descuenta un lugar', async ({ page }) => {
    await abrir(page);
    await page.getByRole('button', { name: 'Donar', exact: true }).click();
    const barra = page.getByRole('progressbar');
    const antes = Number(await barra.getAttribute('aria-valuenow'));
    await page.getByRole('button', { name: /^Donar \$/ }).click();
    await expect(page.getByText('Gracias. Tu aporte ya suma.')).toBeVisible();
    expect(Number(await barra.getAttribute('aria-valuenow'))).toBeGreaterThan(antes);

    await page.getByRole('button', { name: 'Sumate' }).click();
    await page.getByRole('button', { name: 'Anotarme: Paseos' }).click();
    await expect(page.getByRole('button', { name: 'Anotado: Paseos' })).toBeDisabled();
  });

  test('administración: cargar un animal lo publica en la vitrina; recordatorio sin destinatario', async ({
    page,
  }) => {
    await abrir(page);
    await vista(page, 'Vista administración');
    await page.getByRole('button', { name: 'Cargar animal' }).click();
    await page.getByRole('button', { name: 'Sacar foto' }).click();
    await page.getByRole('textbox', { name: 'Nombre' }).fill('Coco');
    await page.getByRole('button', { name: 'Publicar en la vitrina' }).click();
    await expect(page.getByText('Coco ya está en la vitrina pública.')).toBeVisible();

    await page.getByRole('button', { name: 'Socios', exact: true }).click();
    const recordar = page.getByRole('link', { name: 'Recordar por WhatsApp' }).first();
    expect(await recordar.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\?text=Hola%20Jorge/);

    await vista(page, 'Vista pública');
    await expect(page.getByRole('button', { name: /^Coco/ })).toBeVisible();
  });

  test('compartir ficha: imagen lista para redes que se descarga', async ({ page }) => {
    await abrir(page);
    await page.getByRole('button', { name: /^Luna/ }).click();
    await page.getByRole('button', { name: 'Compartir ficha' }).click();
    const dialogo = page.getByRole('dialog', { name: 'Imagen para redes' });
    await expect(dialogo.getByRole('img', { name: 'Busca familia: Luna' })).toBeVisible();
    const descarga = page.waitForEvent('download');
    await dialogo.getByRole('button', { name: 'Descargar imagen' }).click();
    expect((await descarga).suggestedFilename()).toBe('luna-busca-familia.png');
    await page.keyboard.press('Escape');
    await expect(dialogo).toHaveCount(0);
  });

  test('termina en Quiero este sistema, con rubro y módulos elegidos en el configurador', async ({
    page,
  }) => {
    await abrir(page);
    await page.getByRole('link', { name: 'Quiero este sistema' }).last().click();
    await page.locator('#armar [data-hidratado]').waitFor({ state: 'attached' });
    await expect(page.getByRole('switch', { name: /Socios y cuotas/ })).toBeChecked();
    await expect(
      page.getByRole('radio', { name: 'Protectora o entidad sin fines de lucro' }),
    ).toBeChecked();
  });
});

test('/protectoras: titular, demo, módulos con su estado honesto y Service en JSON-LD', async ({
  page,
}) => {
  await page.goto('/protectoras', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    PROTECTORAS.hero.titulo.join(' '),
  );
  await expect(
    page
      .getByRole('main')
      .getByRole('link', { name: /^Ver demo/ })
      .first(),
  ).toHaveAttribute('href', PROTECTORAS.demo);
  await expect(page.getByText('A medida').first()).toBeVisible();
  await expect(page.getByText('Base lista').first()).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(ld).toContain('"Service"');
  expect(ld).toContain('areaServed');
});

test('el buscador lleva a protectoras y a su demo', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const caja = page.getByRole('combobox');
  await caja.fill('tengo una protectora de perros');
  await expect(page.getByRole('option').first()).toContainText('Sistema para protectoras');
  await expect(page.getByRole('option', { name: /Ver demo para protectoras/ })).toBeVisible();
});
