import { expect, test, type Page } from '@playwright/test';
import {
  abrirWizard,
  completarDatos,
  elegirRubro,
  irAlPaso,
  negocioUnico,
  TITULO_A_MEDIDA,
  TITULO_GRACIAS,
  wizard,
} from './helpers';

// Capturas de referencia por paso y por viewport. Sin animaciones para que sean deterministas.
// Se generan con `pnpm test:e2e visual --update-snapshots` y se revisan a ojo antes de commitear.
test.use({ reducedMotion: 'reduce' });

test('hero — pantalla 1 (¿qué negocio tenés?)', async ({ page }) => {
  await page.goto('/empezar');
  await abrirWizard(page);
  await expect(page).toHaveScreenshot('00-hero.png');
});

test('"Otro" — pedido a medida', async ({ page }) => {
  await irAlPaso(page, 'rubro');
  await elegirRubro(page, 'otro');
  await expect(wizard(page).getByRole('heading', { name: TITULO_A_MEDIDA })).toBeVisible();
  await wizard(page)
    .getByLabel(/qué necesita tu negocio/i)
    .fill('Controlar el stock de mis dos locales');
  await expect(wizard(page)).toHaveScreenshot('01-a-medida.png');
});

test('pantalla 2 — formulario, con errores', async ({ page }) => {
  await irAlPaso(page, 'negocio');
  await wizard(page)
    .getByRole('button', { name: /ver cómo me queda/i })
    .click();
  await expect(wizard(page).locator('[aria-invalid="true"]').first()).toBeVisible();
  await expect(wizard(page)).toHaveScreenshot('02-negocio-errores.png');
});

test('pantalla 3 — así te queda', async ({ page }) => {
  await irAlPaso(page, 'resultado');
  await expect(wizard(page)).toHaveScreenshot('03-resultado.png');
});

test('completar y gracias', async ({ page }) => {
  await irAlPaso(page, 'completar', '', negocioUnico('visual'));
  await expect(wizard(page)).toHaveScreenshot('04-completar.png');
  await completarDatos(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_GRACIAS })).toBeVisible();
  await expect(wizard(page)).toHaveScreenshot('05-gracias.png');
});

test('secciones informativas', async ({ page }) => {
  await page.goto('/empezar');
  // Con el wizard ya cargado (layout definitivo): el esqueleto mide distinto y movería las secciones.
  await abrirWizard(page);
  // La barra fija del celular aparece o no según qué hay a la vista al capturar: no es parte de
  // estas capturas (tiene su propio E2E en layout.spec).
  await page.addStyleTag({
    content: '[role="region"][data-visible] { display: none !important; }',
  });
  // Las secciones bajo el pliegue llevan content-visibility:auto: se maquetan recién cerca de la
  // pantalla. Se llevan a la vista y se esperan dos cuadros para capturar el alto real, no el reservado.
  const seccion = async (id: string) => {
    const s = page.locator(`section[aria-labelledby="${id}"]`);
    await s.scrollIntoViewIfNeeded();
    await page.evaluate(
      () => new Promise((listo) => requestAnimationFrame(() => requestAnimationFrame(listo))),
    );
    return s;
  };
  await expect(await seccion('incluye-title')).toHaveScreenshot('06-que-incluye.png');
  await expect(await seccion('faq-title')).toHaveScreenshot('07-faq.png');
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
