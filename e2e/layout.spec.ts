import { expect, test, type Page } from '@playwright/test';
import { FOOTER } from '../src/content/empezar/footer';
import { STICKY_CTA } from '../src/content/empezar/cta-final';
import { HERO } from '../src/content/empezar/hero';
import {
  abrirWizard,
  elegirRubro,
  enviarNegocio,
  irAlPaso,
  TITULO_NEGOCIO,
  TITULO_RESULTADO,
  TITULO_RUBRO,
  wizard,
} from './helpers';

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

test('no hay scroll horizontal, ni en el formulario ni en la vista previa', async ({ page }) => {
  const sobra = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
  await irAlPaso(page, 'negocio');
  expect(await sobra()).toBeLessThanOrEqual(0);
  await enviarNegocio(page);
  await expect(wizard(page).getByRole('heading', { name: TITULO_RESULTADO })).toBeVisible();
  expect(await sobra()).toBeLessThanOrEqual(0);
});

test('/marca sin scroll horizontal (tablas de contraste incluidas)', async ({ page }) => {
  await page.goto('/marca');
  const sobra = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(sobra).toBeLessThanOrEqual(0);
});

test('tema: oscuro por defecto, el interruptor del pie pasa a claro y se recuerda al recargar', async ({
  page,
}) => {
  await page.goto('/empezar');
  const html = page.locator('html');
  await expect(html).not.toHaveAttribute('data-theme', 'light');
  const interruptor = page
    .getByRole('contentinfo')
    .getByRole('button', { name: FOOTER.tema.etiqueta });
  await expect(interruptor).toHaveAttribute('aria-pressed', 'false');
  await interruptor.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload();
  // El script en línea lo aplica antes de hidratar: el atributo ya está y el botón queda presionado.
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(interruptor).toHaveAttribute('aria-pressed', 'true');

  // El claro es solo de /empezar: la demo y /marca siguen en oscuro con el claro guardado.
  for (const ruta of ['/demo/gastronomia', '/marca']) {
    await page.goto(ruta);
    await expect(html).not.toHaveAttribute('data-theme', 'light');
  }
});

test.describe('escritorio (lg y más)', () => {
  test.beforeEach(({ page }) => {
    test.skip(!esLg(page), 'solo escritorio');
  });

  test('hero: el titular arriba y la pantalla 1 entera en el primer viewport, dentro de 1200 px', async ({
    page,
  }) => {
    await page.goto('/empezar');
    const h1 = (await page.locator('h1').boundingBox())!;
    const flujo = (await wizard(page).boundingBox())!;
    expect(h1.y + h1.height).toBeLessThanOrEqual(flujo.y);
    const main = (await page.locator('main').boundingBox())!;
    expect(main.width).toBeLessThanOrEqual(1200);
    const ultima = (await wizard(page).locator('[data-rubro]').last().boundingBox())!;
    expect(ultima.y + ultima.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  });

  test('título en hasta 3 líneas, línea gris en una y copy del hero', async ({ page }) => {
    await page.goto('/empezar');
    await expect(page.locator('h1')).toContainText(HERO.titulo);
    await expect(page.locator('h1')).toContainText(HERO.subtitulo);
    expect(await lineas(page, 'h1 > span')).toBe(1);
    expect(await lineas(page, 'h1')).toBeLessThanOrEqual(3);
  });

  test('flujo en 2 paneles: pantalla a la izquierda y vista previa sticky a la derecha', async ({
    page,
  }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    const panel = page.getByTestId('negocio-preview-panel');
    await expect(panel).toBeVisible();
    const paso = (await wizard(page).getByRole('heading', { name: TITULO_RUBRO }).boundingBox())!;
    const prev = (await panel.boundingBox())!;
    expect(paso.x + paso.width).toBeLessThan(prev.x);

    // Sticky: con el flujo parcialmente scrolleado, el panel sigue a la vista.
    await elegirRubro(page, 'comercio');
    await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
    await page.evaluate(() => {
      const w = document.querySelector('#wizard')!.getBoundingClientRect();
      window.scrollBy(0, w.top + 200);
    });
    const arriba = (await panel.boundingBox())!;
    expect(arriba.y).toBeGreaterThanOrEqual(0);
  });

  test('la vista previa refleja el rubro y sus módulos en vivo', async ({ page }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    const panel = page.getByTestId('negocio-preview-panel');
    await expect(panel).toContainText('Tu negocio');
    await elegirRubro(page, 'comercio');
    await expect(panel).toContainText('Comercio y tienda');
    await expect(panel.locator('li[data-on="true"]')).toHaveCount(4);
  });

  test('"Qué podés activar" en 4 columnas; FAQ en 2', async ({ page }) => {
    await page.goto('/empezar');
    expect(await columnas(page, 'section[aria-labelledby="incluye-title"] > ul > li')).toBe(4);
    expect(await columnas(page, 'section[aria-labelledby="faq-title"] details')).toBe(2);
  });

  test('títulos de sección de una línea y descripciones de una sola frase', async ({ page }) => {
    await page.goto('/empezar');
    for (const id of ['incluye-title', 'faq-title']) {
      expect(await lineas(page, `#${id}`)).toBe(1);
    }
    const textos = await page
      .locator(
        'section[aria-labelledby="incluye-title"] li p:not([data-todo]), section[aria-labelledby="incluye-title"] > p',
      )
      .allTextContents();
    expect(textos.length).toBeGreaterThanOrEqual(5);
    // Una sola frase: ningún punto/!/? seguido de otra palabra. Los TODO visibles (data-todo) no cuentan.
    for (const t of textos) expect(t, t).not.toMatch(/[.!?]\s+\S/);
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
    // Entre secciones (sin hero, flujo, cierre ni pie a la vista): aparece.
    await page.locator('section[aria-labelledby="incluye-title"]').scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await expect(barra).toHaveAttribute('data-visible', 'true');
    await expect(barra.getByRole('link', { name: STICKY_CTA.cta })).toHaveAttribute(
      'href',
      '#wizard',
    );
    // En el flujo ya hay a dónde tocar: se esconde.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(barra).toHaveAttribute('data-visible', 'false');
  });

  test('una columna: la pantalla 1 entera sin scroll y la vista previa dentro de la pantalla 3', async ({
    page,
  }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    const ultima = (await wizard(page).locator('[data-rubro]').last().boundingBox())!;
    expect(ultima.y + ultima.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    await expect(page.getByTestId('negocio-preview-panel')).toBeHidden();
    await irAlPaso(page, 'resultado');
    await expect(page.getByTestId('negocio-preview-panel')).toBeHidden();
    await expect(page.getByTestId('negocio-preview')).toBeVisible();
  });
});
