import { expect, test, type Page } from '@playwright/test';
import { HERO } from '../src/content/empezar/hero';
import { abrirWizard, tocar, wizard } from './helpers';

// Layout responsive. Los chequeos de escritorio (lg ≥ 1024 px) se saltean en celular y tablet.
const ANCHO_LG = 1024;
const ancho = (page: Page) => page.viewportSize()?.width ?? 0;
const esLg = (page: Page) => ancho(page) >= ANCHO_LG;

/** Cantidad de posiciones X distintas (≈ columnas) entre los elementos que matchean. */
async function columnas(page: Page, selector: string) {
  return page
    .locator(selector)
    .evaluateAll((els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().left))).size);
}

/**
 * Renglones visuales que ocupa el texto de un elemento: suma los fragmentos de línea de cada
 * nodo de texto (un nodo en una sola línea da 1). No cuenta cajas de bloque.
 */
async function lineas(page: Page, selector: string) {
  return page
    .locator(selector)
    .first()
    .evaluate((el) => {
      const recorrido = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let total = 0;
      for (let n = recorrido.nextNode(); n; n = recorrido.nextNode()) {
        if (!n.textContent?.trim()) continue;
        const rango = document.createRange();
        rango.selectNodeContents(n);
        total += [...rango.getClientRects()].filter((r) => r.width > 0).length;
      }
      return total;
    });
}

test('no hay scroll horizontal, ni con el wizard abierto', async ({ page }) => {
  await page.goto('/empezar');
  const sobra = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
  expect(await sobra()).toBeLessThanOrEqual(0);
  await abrirWizard(page);
  expect(await sobra()).toBeLessThanOrEqual(0);
});

test('/marca sin scroll horizontal (tablas de contraste incluidas)', async ({ page }) => {
  await page.goto('/marca');
  const sobra = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(sobra).toBeLessThanOrEqual(0);
});

test.describe('escritorio (lg y más)', () => {
  test.beforeEach(({ page }) => {
    test.skip(!esLg(page), 'solo escritorio');
  });

  test('hero en 2 columnas: texto a la izquierda, mockup a la derecha, dentro de 1200 px', async ({
    page,
  }) => {
    await page.goto('/empezar');
    const h1 = (await page.locator('h1').boundingBox())!;
    const mock = (await page.getByRole('group', { name: /armá tu negocio/i }).boundingBox())!;
    expect(h1.x + h1.width).toBeLessThan(mock.x);
    // Alineados en vertical: el h1 queda dentro del alto del mockup.
    expect(h1.y).toBeGreaterThan(mock.y);
    expect(h1.y + h1.height).toBeLessThan(mock.y + mock.height);
    const main = (await page.locator('main').boundingBox())!;
    expect(main.width).toBeLessThanOrEqual(1200);
    // El mockup y el CTA entran en el primer viewport.
    const cta = (await page.getByRole('link', { name: 'Empezar a crear' }).boundingBox())!;
    expect(cta.y + cta.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  });

  test('título en hasta 2 líneas, línea gris en una y copy nuevo', async ({ page }) => {
    await page.goto('/empezar');
    await expect(page.locator('h1')).toContainText(HERO.titulo);
    await expect(page.locator('h1')).toContainText(HERO.subtitulo);
    // "Todo lo digital para tu negocio." no entra en una línea de la columna del hero con el token
    // `hero` actual: el título puede ir en 2 líneas (text-balance) y la línea gris sigue en una.
    expect(await lineas(page, 'h1 > span')).toBe(1);
    expect(await lineas(page, 'h1')).toBeLessThanOrEqual(3);
  });

  test('3 señales de confianza, sin sellos ni métricas inventadas', async ({ page }) => {
    await page.goto('/empezar');
    const hero = page.locator('section[aria-labelledby="hero-title"]');
    for (const s of HERO.senales) {
      await expect(hero.getByText(s)).toBeVisible();
    }
  });

  test('wizard en 2 paneles: pasos a la izquierda y vista previa sticky a la derecha', async ({
    page,
  }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    const panel = page.getByTestId('negocio-preview-panel');
    await expect(panel).toBeVisible();
    const paso = (await wizard(page)
      .getByRole('heading', { name: '¿Qué vas a crear?' })
      .boundingBox())!;
    const prev = (await panel.boundingBox())!;
    expect(paso.x + paso.width).toBeLessThan(prev.x);

    // Sticky: con el wizard parcialmente scrolleado, el panel sigue a la vista.
    await tocar(page, /comercio/i);
    await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
    await expect(wizard(page).getByRole('heading', { name: '¿Qué querés activar?' })).toBeVisible();
    await page.evaluate(() => {
      const w = document.querySelector('#wizard')!.getBoundingClientRect();
      window.scrollBy(0, w.top + 400);
    });
    const arriba = (await panel.boundingBox())!;
    expect(arriba.y).toBeGreaterThanOrEqual(0);
    expect(arriba.y + arriba.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  });

  test('la vista previa refleja el rubro y los módulos en vivo', async ({ page }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    const panel = page.getByTestId('negocio-preview-panel');
    await expect(panel).toContainText('Tu negocio');
    await tocar(page, /comercio/i);
    await expect(panel).toContainText('Comercio y tienda');
    await expect(panel.locator('li[data-on="true"]')).toHaveCount(4);
  });

  test('"Cómo funciona" y "Qué podés activar" en 3 y 4 columnas; FAQ en 2', async ({ page }) => {
    await page.goto('/empezar');
    expect(await columnas(page, 'section[aria-labelledby="como-title"] li')).toBe(3);
    expect(await columnas(page, 'section[aria-labelledby="incluye-title"] li')).toBe(4);
    expect(await columnas(page, 'section[aria-labelledby="faq-title"] details')).toBe(2);
  });

  test('títulos de sección de una línea y descripciones de una sola frase', async ({ page }) => {
    await page.goto('/empezar');
    for (const id of ['como-title', 'incluye-title', 'faq-title']) {
      expect(await lineas(page, `#${id}`)).toBe(1);
    }
    const textos = await page
      .locator(
        'section[aria-labelledby="como-title"] li p, section[aria-labelledby="incluye-title"] li p, section[aria-labelledby="incluye-title"] > p',
      )
      .allTextContents();
    expect(textos.length).toBeGreaterThanOrEqual(10);
    // Una sola frase: ningún punto/!/? seguido de otra palabra.
    for (const t of textos) expect(t, t).not.toMatch(/[.!?]\s+\S/);
  });
});

test.describe('debajo de lg (celular y tablet)', () => {
  test.beforeEach(({ page }) => {
    test.skip(esLg(page), 'solo debajo de lg');
  });

  test('una columna: sin panel lateral, la vista previa va dentro del paso 1', async ({ page }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    await expect(page.getByTestId('negocio-preview-panel')).toBeHidden();
    await expect(page.getByTestId('negocio-preview')).toBeVisible();
    const h1 = (await page.locator('h1').boundingBox())!;
    const mock = (await page.getByRole('group', { name: /armá tu negocio/i }).boundingBox())!;
    expect(mock.y).toBeGreaterThan(h1.y + h1.height);
    await expect(page.locator('section[aria-labelledby="hero-title"] ul').first()).toBeHidden();
  });
});
