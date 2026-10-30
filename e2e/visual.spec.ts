import { expect, test, type Page } from '@playwright/test';
import {
  abrirWizard,
  completarNegocio,
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

test('paso 1 — qué necesitás, con "Otra cosa" abierta', async ({ page }) => {
  await irAlPaso(page, 'necesidad');
  await tocar(page, /^Cobrar/);
  await tocar(page, /^Otra cosa/);
  await wizard(page)
    .getByLabel(/contanos qué necesitás/i)
    .fill('Controlar el stock de mis dos locales');
  await expect(wizard(page)).toHaveScreenshot('01-necesidad.png');
});

test('paso 2 — rubro (con vista previa)', async ({ page }) => {
  await irAlPaso(page, 'rubro');
  await tocar(page, /comercio/i);
  await expect(wizard(page)).toHaveScreenshot('01b-rubro.png');
});

test('paso 3 — qué querés activar (con estados)', async ({ page }) => {
  await irAlPaso(page, 'modulos');
  await tocar(page, /recibir turnos online/i);
  await expect(wizard(page)).toHaveScreenshot('02-modulos.png');
});

test('paso 4 — solo WhatsApp', async ({ page }) => {
  await irAlPaso(page, 'whatsapp');
  await wizard(page).getByLabel('Tu WhatsApp').fill('1123456789');
  await expect(wizard(page)).toHaveScreenshot('03-whatsapp.png');
});

test('paso 5 — completar, con errores', async ({ page }) => {
  await irAlPaso(page, 'completar');
  await wizard(page).getByRole('button', { name: 'Enviar mis datos' }).click();
  await expect(wizard(page).locator('[aria-invalid="true"]').first()).toBeVisible();
  await expect(wizard(page)).toHaveScreenshot('03b-errores.png');
});

test('confirmación', async ({ page }) => {
  await irAlPaso(page, 'completar');
  await completarNegocio(page, negocioUnico('visual'));
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

// --- Demo de Gastronomía y video explicativo ---------------------------------------------------

const esEscritorio = (ancho: number | undefined) => (ancho ?? 0) >= 1024;

async function demoLista(page: Page) {
  await page.goto('/demo/gastronomia');
  await page.waitForFunction(() => {
    const b = document.querySelector('[data-testid="demo-cliente"] button');
    return !!b && Object.keys(b).some((k) => k.startsWith('__react'));
  });
}

test('demo — carta', async ({ page }) => {
  await demoLista(page);
  await expect(page.getByTestId('demo-cliente')).toHaveScreenshot('10-demo-carta.png');
});

test('demo — detalle de un plato', async ({ page }) => {
  await demoLista(page);
  await page
    .getByTestId('demo-cliente')
    .getByRole('button', { name: /^muzzarella/i })
    .click();
  await expect(page.getByRole('dialog', { name: 'Muzzarella' })).toHaveScreenshot(
    '11-demo-plato.png',
  );
});

test('demo — panel del dueño con pedidos', async ({ page, viewport }) => {
  await demoLista(page);
  if (!esEscritorio(viewport?.width)) {
    await page
      .getByRole('group', { name: 'Qué querés ver' })
      .getByRole('button', { name: /dueño/i })
      .click();
  }
  const panel = page.getByTestId('panel-duenio');
  await panel.getByRole('button', { name: 'Simular un pedido' }).click();
  await panel.getByRole('button', { name: 'Simular un pedido' }).click();
  await panel.getByRole('button', { name: 'Empezar a preparar el pedido #1' }).click();
  // Los contadores cambian cada segundo: se tapan para que la captura sea estable.
  await expect(panel).toHaveScreenshot('12-demo-panel.png', {
    mask: [panel.locator('header .tabular')],
  });
});

test('video explicativo — última escena', async ({ page }) => {
  await page.goto('/empezar');
  await page.getByRole('button', { name: /mirá cómo funciona/i }).click();
  const video = page.getByRole('dialog', { name: 'Cómo funciona WebYa' });
  await video.getByRole('button', { name: 'Pausar' }).click();
  await video.getByRole('button', { name: /^Capítulo 9:/ }).click();
  await video.getByRole('button', { name: 'Pausar' }).click();
  await expect(video).toHaveScreenshot('13-video-cta.png', {
    mask: [video.locator('.mg-progreso')],
  });
});
