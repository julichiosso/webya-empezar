import { expect, test } from '@playwright/test';
import {
  abrirWizard,
  completarDatos,
  irAlPaso,
  negocioUnico,
  TITULO_FINAL,
  tocar,
  wizard,
} from './helpers';

// Capturas de referencia por paso y por viewport. Sin animaciones para que sean deterministas.
// Se generan con `pnpm test:e2e visual --update-snapshots` y se revisan a ojo antes de commitear.
test.use({ reducedMotion: 'reduce' });

test('hero', async ({ page }) => {
  await page.goto('/empezar');
  // La pista "Tocá para activar" se va sola a los 4 s: se espera para capturar un estado estable.
  await expect(page.getByText('Tocá para activar')).toBeHidden({ timeout: 10_000 });
  await expect(page).toHaveScreenshot('00-hero.png');
});

test('hero con módulos activados', async ({ page }) => {
  await page.goto('/empezar');
  const hero = page.getByRole('group', { name: /armá tu negocio/i });
  await hero.getByRole('button', { name: /turnos y reservas/i }).click();
  await hero.getByRole('button', { name: /pagos online/i }).click();
  // Pasada la pista, queda el resumen "2 módulos activados".
  await expect(hero.getByText('2 módulos activados')).toBeVisible({ timeout: 6000 });
  await expect(hero).toHaveScreenshot('00b-hero-activo.png');
});

test('paso 1 — qué vas a crear (con vista previa)', async ({ page }) => {
  await irAlPaso(page, 1);
  await tocar(page, /comercio/i);
  await expect(wizard(page)).toHaveScreenshot('01-rubro.png');
});

test('paso 2 — qué querés activar', async ({ page }) => {
  await irAlPaso(page, 2);
  await tocar(page, /recibir turnos online/i);
  await expect(wizard(page)).toHaveScreenshot('02-modulos.png');
});

test('paso 3 — datos', async ({ page }) => {
  await irAlPaso(page, 3);
  await completarDatos(page, 'Peluquería Luna');
  await expect(wizard(page)).toHaveScreenshot('03-datos.png');
});

test('paso 3 — errores', async ({ page }) => {
  await irAlPaso(page, 3);
  await wizard(page).getByRole('button', { name: 'Enviar' }).click();
  await expect(wizard(page).locator('[aria-invalid="true"]').first()).toBeVisible();
  await expect(wizard(page)).toHaveScreenshot('03b-errores.png');
});

test('paso 4 — confirmación', async ({ page }) => {
  await irAlPaso(page, 3);
  await completarDatos(page, negocioUnico('visual'));
  await wizard(page).getByRole('button', { name: 'Enviar' }).click();
  await expect(wizard(page).getByRole('heading', { name: TITULO_FINAL })).toBeVisible();
  await expect(wizard(page)).toHaveScreenshot('04-listo.png');
});

test('secciones informativas', async ({ page }) => {
  await page.goto('/empezar');
  // Con el wizard ya cargado (layout definitivo): el esqueleto mide distinto y movería las secciones.
  await abrirWizard(page);
  const seccion = (id: string) => page.locator(`section[aria-labelledby="${id}"]`);
  await expect(seccion('como-title')).toHaveScreenshot('05-como-funciona.png');
  await expect(seccion('incluye-title')).toHaveScreenshot('06-que-incluye.png');
  await expect(seccion('faq-title')).toHaveScreenshot('07-faq.png');
});
