import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

// Ayudas compartidas por las pruebas de la demo de Gastronomía.
export const URL_DEMO = '/demo/gastronomia';
export const AVISO = 'Demo con datos de ejemplo. No se cobra ni se envía nada.';

export const carta = (page: Page) => page.getByTestId('demo-cliente');
export const plato = (page: Page, nombre: RegExp) =>
  carta(page).getByRole('button', { name: nombre });

/** Espera la hidratación: hasta entonces los botones de la carta no responden. */
export async function abrirDemo(page: Page) {
  await page.goto(URL_DEMO);
  await page.waitForFunction(() => {
    const b = document.querySelector('[data-testid="demo-cliente"] button');
    return !!b && Object.keys(b).some((k) => k.startsWith('__react'));
  });
}

export async function auditar(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== 'running'),
  );
  const r = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
  ).toEqual([]);
}

/** Pide una muzzarella mediana para la mesa 4 a nombre de "Julián". */
export async function pedirMuzzarella(page: Page) {
  await plato(page, /^muzzarella/i).click();
  const hoja = page.getByRole('dialog', { name: 'Muzzarella' });
  await hoja.getByText('Mediana (6 porciones)').click();
  await hoja.getByRole('button', { name: /agregar/i }).click();
  await expect(hoja).toBeHidden();
  await carta(page)
    .getByRole('button', { name: /ver mi pedido/i })
    .click();
  await page
    .getByRole('dialog', { name: 'Tu pedido' })
    .getByRole('button', { name: 'Seguir' })
    .click();
  const datos = page.getByRole('dialog', { name: '¿Cómo lo querés?' });
  await datos.getByRole('textbox', { name: /tu nombre/i }).fill('Julián');
  await datos.getByRole('button', { name: /confirmar/i }).click();
  await expect(datos).toBeHidden();
}
