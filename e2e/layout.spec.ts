import { expect, test, type Page } from '@playwright/test';
import { STICKY_CTA } from '../src/content/empezar/cta-final';
import { HERO } from '../src/content/empezar/hero';
import { CLIENTES } from '../src/content/clientes';
import { OBJECIONES } from '../src/content/por-que-webya';
import { abrirWizard, irAlPaso, TITULO_NEGOCIO, TITULO_RUBRO, wizard } from './helpers';

// Layout responsive de la página nueva. Los chequeos de escritorio (lg ≥ 1024 px) se saltean en
// celular y tablet.
const ANCHO_LG = 1024;
const esLg = (page: Page) => (page.viewportSize()?.width ?? 0) >= ANCHO_LG;
const sobra = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** Recorre la página para que las secciones diferidas (content-visibility) se dibujen. */
async function recorrer(page: Page) {
  const alto = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < alto; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(60);
  }
}

test('sin scroll horizontal: página completa, formulario y vista previa', async ({ page }) => {
  await page.goto('/empezar');
  await abrirWizard(page);
  expect(await sobra(page)).toBeLessThanOrEqual(0);
  await recorrer(page);
  expect(await sobra(page)).toBeLessThanOrEqual(0);
  await irAlPaso(page, 'negocio');
  expect(await sobra(page)).toBeLessThanOrEqual(0);
  // El flujo queda guardado en la sesión: se parte de cero para llegar a la vista previa.
  await page.evaluate(() => window.sessionStorage.clear());
  await irAlPaso(page, 'resultado');
  expect(await sobra(page)).toBeLessThanOrEqual(0);
});

test('/sistema y /marca sin scroll horizontal', async ({ page }) => {
  for (const ruta of ['/sistema', '/marca']) {
    await page.goto(ruta);
    expect(await sobra(page), ruta).toBeLessThanOrEqual(0);
  }
});

test('el CTA "Crear mi sistema" está en el header desde el primer cuadro', async ({ page }) => {
  await page.goto('/empezar');
  const cta = page.getByRole('banner').getByRole('link', { name: 'Crear mi sistema' });
  await expect(cta).toBeVisible();
  const caja = (await cta.boundingBox())!;
  expect(caja.y + caja.height).toBeLessThanOrEqual(page.viewportSize()!.height);
});

test('el h1 y el wizard existen en el DOM y el titular está arriba del flujo', async ({ page }) => {
  await page.goto('/empezar');
  await expect(page.getByRole('heading', { level: 1, name: HERO.titulo })).toBeVisible();
  const h1 = (await page.locator('h1').boundingBox())!;
  const flujo = (await wizard(page).boundingBox())!;
  expect(h1.y + h1.height).toBeLessThanOrEqual(flujo.y);
  const main = (await page.locator('main').boundingBox())!;
  expect(main.width).toBeLessThanOrEqual(1200);
});

test('rubros flotantes: solo palabras, sin íconos, y casi invisibles sobre las secciones con texto', async ({
  page,
}) => {
  await page.goto('/empezar');
  const capa = page.locator('[data-plena]');
  await expect(capa).toHaveAttribute('aria-hidden', 'true');
  await expect(capa.locator('svg, img')).toHaveCount(0);
  await expect(capa).toHaveAttribute('data-plena', 'si');
  await page.locator('#ya-lo-usan').scrollIntoViewIfNeeded();
  await expect(capa).toHaveAttribute('data-plena', 'no');
  await expect
    .poll(async () => Number(await capa.evaluate((e) => getComputedStyle(e).opacity)))
    .toBeLessThanOrEqual(0.25);
});

test('Ya crearon con WebYa: un índice por rubro con capturas grandes y enlaces seguros', async ({
  page,
}) => {
  await page.goto('/empezar');
  const seccion = page.locator('#ya-lo-usan');
  await seccion.scrollIntoViewIfNeeded();
  await recorrer(page);
  await expect(seccion.locator('li')).toHaveCount(CLIENTES.length);
  const marcos = seccion.locator('a[tabindex="-1"]');
  await expect(marcos).toHaveCount(CLIENTES.length);
  const medidas = await marcos.evaluateAll((els) =>
    els.map((e) => {
      const r = e.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    }),
  );
  // Mismo alto para todas y a partir de 320 px de ancho en escritorio.
  expect(new Set(medidas.map((m) => m.h)).size).toBe(1);
  if (esLg(page)) for (const m of medidas) expect(m.w).toBeGreaterThanOrEqual(320);
  for (const enlace of await seccion.locator('a[href^="https://"]').all()) {
    await expect(enlace).toHaveAttribute('target', '_blank');
    await expect(enlace).toHaveAttribute('rel', 'noopener noreferrer');
  }
  expect(await seccion.locator('img').count()).toBe(CLIENTES.length);
});

test('las objeciones están junto a su sección', async ({ page }) => {
  await page.goto('/empezar');
  await recorrer(page);
  for (const o of OBJECIONES)
    await expect(page.locator('dt', { hasText: o.pregunta }).first()).toBeVisible();
});

test('la intro del telón está apagada por defecto', async ({ page }) => {
  await page.goto('/empezar');
  await expect(page.locator('[data-telon]')).toHaveCount(0);
});

test.describe('escritorio (lg y más)', () => {
  test.beforeEach(({ page }) => {
    test.skip(!esLg(page), 'solo escritorio');
  });

  test('flujo en 2 paneles: pantalla a la izquierda y vista previa a la derecha', async ({
    page,
  }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    const panel = page.getByTestId('negocio-preview-panel');
    await expect(panel).toBeVisible();
    const paso = (await wizard(page).getByRole('heading', { name: TITULO_RUBRO }).boundingBox())!;
    const prev = (await panel.boundingBox())!;
    expect(paso.x + paso.width).toBeLessThan(prev.x);
  });

  test('Gastronomía: la carta real se arma con el nombre mientras se escribe', async ({ page }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    await wizard(page).locator('[data-rubro="gastronomia"]').click();
    await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
    const carta = page.getByTestId('negocio-preview-panel').getByTestId('vista-previa-carta');
    await expect(carta).toBeVisible();
    await wizard(page).getByLabel('Nombre de tu negocio').fill('Lo de Tito');
    await expect(carta).toContainText('Lo de Tito');
    await expect(carta).toContainText('platos y precios de ejemplo');
    // Sin pedir WhatsApp todavía.
    await expect(wizard(page).getByLabel('Tu WhatsApp')).toHaveCount(0);
  });
});

test.describe('debajo de lg (celular y tablet)', () => {
  test.beforeEach(({ page }) => {
    test.skip(esLg(page), 'solo debajo de lg');
  });

  test('la barra fija aparece pasando el flujo y se va al volver a él', async ({ page }) => {
    await page.goto('/empezar');
    const barra = page.getByRole('region', { name: STICKY_CTA.aria });
    await expect(barra).toHaveAttribute('data-visible', 'false');
    await page.locator('#ya-lo-usan').scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await expect(barra).toHaveAttribute('data-visible', 'true');
    await expect(barra.getByRole('link', { name: STICKY_CTA.cta })).toHaveAttribute(
      'href',
      '#wizard',
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(barra).toHaveAttribute('data-visible', 'false');
  });

  test('Gastronomía: la carta real aparece dentro de la pantalla 2, debajo del nombre', async ({
    page,
  }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    await wizard(page).locator('[data-rubro="gastronomia"]').click();
    await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
    await wizard(page).getByLabel('Nombre de tu negocio').fill('Lo de Tito');
    const carta = page.getByTestId('vista-previa-carta').first();
    await expect(carta).toContainText('Lo de Tito');
    await expect(page.getByTestId('negocio-preview-panel')).toBeHidden();
  });

  test('pantalla 3: el CTA va en una barra fija abajo, sin la barra general encima', async ({
    page,
  }) => {
    await irAlPaso(page, 'resultado');
    const barra = page.getByTestId('barra-cta');
    await expect(barra).toHaveAttribute('data-visible', 'true');
    const cta = barra.getByRole('link', { name: /quiero esto para mi negocio/i });
    await expect(cta).toBeVisible();
    const caja = (await cta.boundingBox())!;
    expect(caja.y + caja.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    expect(caja.height).toBeGreaterThanOrEqual(47.5);
    await expect(page.getByRole('region', { name: STICKY_CTA.aria })).toHaveAttribute(
      'data-visible',
      'false',
    );
  });
});
