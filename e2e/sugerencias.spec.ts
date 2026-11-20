import { expect, test } from '@playwright/test';
import { SUGERENCIAS, SUGERENCIAS_UI } from '../src/content/sugerencias';

const QUE_ARMAMOS = SUGERENCIAS.find((s) => s.id === 'inicio-que-armamos')!;

test.describe('sugerencias del celular', () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(info.project.name !== 'iphone-15', 'son del celular: alcanza con un viewport');
    // Los tests no las ven salvo este, que las prueba a propósito.
    await page.addInitScript(() => sessionStorage.setItem('webya:sugerencias-e2e', '1'));
  });

  test('aparece según la sección que se mira, se cierra y no vuelve', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#que-armamos').scrollIntoViewIfNeeded();
    const aviso = page.getByRole('complementary', { name: SUGERENCIAS_UI.etiqueta });
    await expect(aviso).toContainText(QUE_ARMAMOS.texto, { timeout: 8000 });
    await expect(aviso).toHaveCount(1);

    // No tapa la barra de atajos: queda por encima.
    const caja = (await aviso.boundingBox())!;
    const barra = (await page.getByRole('navigation', { name: 'Atajos' }).boundingBox())!;
    expect(caja.y + caja.height).toBeLessThanOrEqual(barra.y);

    await aviso.getByRole('button', { name: SUGERENCIAS_UI.cerrar }).click();
    await expect(aviso).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('#que-armamos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    await expect(page.getByText(QUE_ARMAMOS.texto)).toHaveCount(0);
  });

  test('mientras se escribe no aparece nada y la barra de atajos se corre', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('combobox').focus();
    await expect(page.locator('html')).toHaveAttribute('data-teclado', '');
    await page.getByRole('combobox').blur();
    await expect(page.locator('html')).not.toHaveAttribute('data-teclado');
  });
});
