import { expect, test, type Page } from '@playwright/test';
import { BOT, CTA_PELU, PANEL_PELU, VISTAS_PELU } from '../src/content/demos/peluqueria/ui';

const esLg = (w: number | undefined) => (w ?? 0) >= 1024;
const decirle = async (page: Page, texto: string) => {
  await page.getByLabel(BOT.campo).fill(texto);
  await page.getByRole('button', { name: BOT.enviar }).click();
};

test('le pido un turno con mis palabras y cae en la agenda', async ({ page }) => {
  await page.goto('/demo/peluqueria');
  await decirle(page, 'corte el viernes a la tarde');
  const opciones = page.getByRole('log').getByRole('button');
  const hora = await opciones.first().textContent();
  await opciones.first().click();
  await decirle(page, 'Fede');
  await expect(page.getByRole('log')).toContainText('Listo, Fede');

  if (!esLg(page.viewportSize()?.width)) {
    await page.getByRole('button', { name: VISTAS_PELU.duenio }).click();
  }
  const fila = page.locator('[data-del-bot]');
  await expect(fila).toContainText('Fede');
  await expect(fila).toContainText(hora!);
});

test('no entiende: lo dice y sigue ofreciendo opciones', async ({ page }) => {
  await page.goto('/demo/peluqueria');
  await decirle(page, 'xyzzy');
  await expect(page.getByRole('log')).toContainText(BOT.avisos.no_entendi);
  await expect(page.getByRole('log').getByRole('button')).not.toHaveCount(0);
});

test('un horario tomado ya no se ofrece', async ({ page }) => {
  await page.goto('/demo/peluqueria');
  await decirle(page, 'corte el martes a la mañana');
  const primero = await page.getByRole('log').getByRole('button').first().textContent();
  await page.getByRole('log').getByRole('button').first().click();
  await decirle(page, 'Ana');
  await page.getByRole('button', { name: BOT.reiniciar }).click();
  await decirle(page, 'corte el martes a la mañana');
  await expect(page.getByRole('log').getByRole('button').first()).not.toHaveText(primero!);
});

test('las estadísticas se ven, con la tabla y sus valores escritos', async ({ page }) => {
  await page.goto('/demo/peluqueria');
  if (!esLg(page.viewportSize()?.width)) {
    await page.getByRole('button', { name: VISTAS_PELU.duenio }).click();
  }
  await page.getByRole('button', { name: PANEL_PELU.pestanas.estadisticas }).click();
  await expect(page.getByRole('heading', { name: PANEL_PELU.calor.titulo })).toBeVisible();
  await expect(page.getByRole('table').getByRole('cell')).toHaveCount(10);
  await expect(page.getByRole('table')).toContainText('%');
  await expect(page.getByText(PANEL_PELU.aclaracion)).toBeVisible();
});

test('quiero esto: lleva al wizard con el rubro y el nombre cargados', async ({ page }) => {
  await page.goto('/demo/peluqueria');
  await page.getByLabel('El nombre de tu peluquería').fill('Barbería Sur');
  const ancho = page.viewportSize()?.width;
  await page.getByRole('link', { name: esLg(ancho) ? CTA_PELU.texto : CTA_PELU.ariaCorto }).click();
  await expect(page).toHaveURL(/\/empezar#wizard/);
  await expect(page.locator('#wizard input').first()).toHaveValue('Barbería Sur');
});
