import { expect, test, type Page } from '@playwright/test';
import { abrirWizard, tocar, wizard } from './helpers';

/** Junta errores y advertencias de la consola (incluye los de hidratación) y excepciones de la página. */
function vigilarConsola(page: Page) {
  const problemas: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problemas.push(`${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => problemas.push(`pageerror: ${e.message}`));
  return problemas;
}

test('sin errores ni advertencias de consola al cargar, abrir el wizard e interactuar', async ({
  page,
}) => {
  const problemas = vigilarConsola(page);
  await page.goto('/empezar', { waitUntil: 'networkidle' });
  await page
    .getByRole('group', { name: /armá tu negocio/i })
    .getByRole('button', { name: /turnos y reservas/i })
    .click();
  await abrirWizard(page);
  await tocar(page, /gastronomía/i);
  await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
  await expect(wizard(page).getByRole('heading', { name: '¿Qué querés activar?' })).toBeVisible();
  expect(problemas).toEqual([]);
});

test('hidratar con estado guardado en sessionStorage no genera diferencias servidor/cliente', async ({
  page,
}) => {
  const problemas = vigilarConsola(page);
  await page.addInitScript(() => {
    sessionStorage.setItem(
      'webya:empezar:v1',
      JSON.stringify({
        paso: 2,
        rubro: 'comercio',
        rubroOtro: '',
        objetivos: [],
        datos: { nombreNegocio: '', nombre: '', whatsapp: '', email: '', mensaje: '' },
        enviado: false,
      }),
    );
    sessionStorage.setItem('webya:empezar:modulos:v1', JSON.stringify({ carta_qr: true }));
  });
  await page.goto('/empezar', { waitUntil: 'networkidle' });
  await abrirWizard(page);
  await expect(wizard(page).getByRole('heading', { name: '¿Qué querés activar?' })).toBeVisible();
  await expect(
    page
      .getByRole('group', { name: /armá tu negocio/i })
      .getByRole('button', { name: /carta con qr/i }),
  ).toHaveAttribute('aria-pressed', 'true');
  expect(problemas).toEqual([]);
});

test('en una sesión limpia el hero arranca con los 4 módulos apagados', async ({ page }) => {
  await page.goto('/empezar', { waitUntil: 'networkidle' });
  const botones = page.getByRole('group', { name: /armá tu negocio/i }).getByRole('button');
  await expect(botones).toHaveCount(4);
  for (const b of await botones.all()) await expect(b).toHaveAttribute('aria-pressed', 'false');
});
