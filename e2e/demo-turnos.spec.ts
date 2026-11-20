import { expect, test, type Page } from '@playwright/test';
import { BARRA_DEMOS } from '../src/content/demos/hub';
import {
  CHECKOUT,
  COBRO,
  DATOS,
  MI_RESERVA,
  PANEL_TURNOS,
  VISTAS_TURNOS,
} from '../src/content/demos/turnos/ui';

/**
 * Demo de turnos con seña: el cliente reserva y paga la seña (simulada), el turno entra solo a la
 * agenda del dueño con la etiqueta "Nueva", y el dueño cobra al terminar.
 */
const escritorio = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;

async function reservarYPagar(page: Page, resultado: string) {
  await page.goto('/demos/turnos');
  await page.getByRole('button', { name: BARRA_DEMOS.aviso.cerrar }).click();
  await page.getByRole('button', { name: /^Corte Lavado/ }).click();
  await page.getByRole('button', { name: /Cualquiera/ }).click();
  await page.getByRole('button', { name: 'Reservar', exact: true }).first().click();
  await page.getByRole('textbox', { name: DATOS.nombre }).fill('Ana Pérez');
  await page.getByRole('textbox', { name: DATOS.whatsapp }).fill('11 2345 6789');
  await page.getByRole('textbox', { name: DATOS.correo }).fill('ana@gmail.com');
  await page.getByRole('button', { name: /Pagar seña/ }).click();
  await page.getByRole('button', { name: resultado }).click();
}

test('reservar y pagar la seña: entra a la agenda y el dueño cobra', async ({ page }) => {
  await reservarYPagar(page, CHECKOUT.aprobado);
  await expect(
    page.getByText(MI_RESERVA.confirmado('Ana')).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: MI_RESERVA.verPanel }).click();
  if (!escritorio(page))
    await expect(page.getByRole('button', { name: VISTAS_TURNOS.duenio })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  const fila = page.getByRole('button', { name: /Ana Pérez/ }).filter({ visible: true });
  await expect(fila).toContainText(PANEL_TURNOS.nueva);
  await page
    .getByRole('button', { name: PANEL_TURNOS.termine })
    .filter({ visible: true })
    .first()
    .click();
  await page
    .getByRole('button', { name: /Listo, cobré/ })
    .filter({ visible: true })
    .click();
  await expect(page.getByText(/· atendido/).filter({ visible: true })).toBeVisible();
});

test('si el pago no sale, el horario queda guardado con su contador', async ({ page }) => {
  await reservarYPagar(page, CHECKOUT.rechazado);
  await expect(page.getByText(MI_RESERVA.pendiente).filter({ visible: true })).toBeVisible();
  await expect(
    page.getByText(/Horario guardado por \d\d:\d\d/).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: MI_RESERVA.soltar }).filter({ visible: true }).click();
  await expect(
    page.getByRole('heading', { name: MI_RESERVA.cancelado }).filter({ visible: true }),
  ).toBeVisible();
});

test('el cobro deja anotar lo que pagó y con qué medio', async ({ page }) => {
  await page.goto('/demos/turnos');
  await page.getByRole('button', { name: BARRA_DEMOS.aviso.cerrar }).click();
  if (!escritorio(page)) await page.getByRole('button', { name: VISTAS_TURNOS.duenio }).click();
  await page
    .getByRole('button', { name: PANEL_TURNOS.termine })
    .filter({ visible: true })
    .first()
    .click();
  const hoja = page.getByRole('dialog').filter({ visible: true });
  await expect(hoja).toContainText(COBRO.cuanto);
  await hoja.getByRole('button', { name: COBRO.medios.transferencia }).click();
  await hoja.getByRole('button', { name: /Listo, cobré/ }).click();
  await expect(page.getByText(/· atendido/).filter({ visible: true })).toBeVisible();
});

test('/demo/peluqueria lleva a la demo de turnos', async ({ page }) => {
  await page.goto('/demo/peluqueria');
  await expect(page).toHaveURL(/\/demos\/turnos$/);
});
