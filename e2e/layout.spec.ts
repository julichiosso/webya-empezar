import { expect, test, type Page } from '@playwright/test';
import { FOOTER } from '../src/content/empezar/footer';
import { STICKY_CTA } from '../src/content/empezar/cta-final';
import { HERO } from '../src/content/empezar/hero';
import { getPlantilla } from '../src/content/rubros';
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

/**
 * Renglones de un titular que encastra (TituloEncastre): cada palabra es una pieza inline-block, así
 * que se cuentan las alturas distintas de las piezas (no los fragmentos de cada nodo de texto).
 * Con `offsetTop` (posición de layout): no lo mueve el transform de la entrada que encastra.
 */
async function renglonesDePiezas(page: Page, selector: string) {
  return page
    .locator(selector)
    .first()
    .evaluate(
      (el) =>
        new Set(
          [...el.querySelectorAll<HTMLElement>('[data-pieza]')].map((p) =>
            Math.round(p.offsetTop / 8),
          ),
        ).size,
    );
}

test('las cotas del plano quedan en los márgenes: nunca cruzan un texto', async ({ page }) => {
  await page.goto('/empezar');
  const cruces = await page.evaluate(() => {
    const seCruzan = (a: DOMRect, b: DOMRect) =>
      a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const salida: string[] = [];
    for (const svg of document.querySelectorAll('svg[data-plano="cotas"]')) {
      const seccion = svg.closest('section') ?? svg.parentElement!;
      const textos = [...seccion.querySelectorAll('h1, h2, h3, p, li, a, button, label')].map((t) =>
        t.getBoundingClientRect(),
      );
      // Cada trazo visible de las capas de cotas y registro (las ocultas miden 0).
      for (const trazo of svg.querySelectorAll('[data-plano-capa] path, [data-plano-capa] rect')) {
        const caja = trazo.getBoundingClientRect();
        if (caja.width === 0 && caja.height === 0) continue;
        if (textos.some((t) => t.width > 0 && seCruzan(caja, t)))
          salida.push(`${seccion.getAttribute('aria-labelledby')}: ${JSON.stringify(caja)}`);
      }
    }
    return salida;
  });
  expect(cruces).toEqual([]);
});

test('"Mirá lo que creás": elegir un rubro cambia la vista previa (con mouse y con flechas)', async ({
  page,
}) => {
  await page.goto('/empezar');
  const seccion = page.locator('#mira-lo-que-creas');
  const visibles = () =>
    seccion
      .locator('[data-vista]')
      .evaluateAll((els) =>
        els.filter((e) => getComputedStyle(e).display !== 'none').map((e) => e.dataset.vista),
      );
  // Por defecto, el primer rubro; una sola vista a la vez y es la vista previa real (no una captura).
  expect(await visibles()).toEqual(['peluqueria_estetica']);
  const vista = seccion
    .locator('[data-vista="peluqueria_estetica"]')
    .getByTestId('preview-negocio');
  await expect(vista).toBeVisible();
  await expect(vista).toHaveAttribute('data-rubro', 'peluqueria_estetica');

  await seccion.locator('input[value="gastronomia"]').check();
  expect(await visibles()).toEqual(['gastronomia']);
  // Grupo de radios nativo: las flechas pasan al siguiente.
  await page.keyboard.press('ArrowDown');
  await expect(seccion.locator('input[value="comercio"]')).toBeChecked();
  expect(await visibles()).toEqual(['comercio']);
  // Opciones de 48 px.
  for (const caja of await seccion
    .locator('label:has(input[type="radio"])')
    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height)))
    expect(caja).toBeGreaterThanOrEqual(47.5);
});

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

test("el caso real de Micio's no se publica sin permiso (flag apagado)", async ({ page }) => {
  await page.goto('/empezar');
  await expect(page.locator('#caso-real-title')).toHaveCount(0);
  await expect(page.getByText("Micio's")).toHaveCount(0);
});

test('/sistema sin scroll horizontal (vitrina completa, también en celular)', async ({ page }) => {
  await page.goto('/sistema');
  const sobra = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(sobra).toBeLessThanOrEqual(0);
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

  test('título en hasta 3 líneas, salvedad gris en una y copy del hero', async ({ page }) => {
    await page.goto('/empezar');
    // El h1 encastra palabra por palabra (TituloEncastre): su nombre accesible es el titular entero.
    await expect(page.locator('h1')).toContainText(HERO.titulo);
    await expect(page.getByRole('heading', { level: 1, name: HERO.titulo })).toBeVisible();
    await expect(page.locator('#hero-salvedad')).toHaveText(HERO.subtitulo);
    expect(await lineas(page, '#hero-salvedad')).toBe(1);
    expect(await renglonesDePiezas(page, 'h1')).toBeLessThanOrEqual(3);
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

  test('la vista previa refleja el rubro, sus módulos y el nombre en vivo', async ({ page }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    const panel = page.getByTestId('negocio-preview-panel');
    await expect(panel).toContainText('Tu negocio');
    await elegirRubro(page, 'comercio');
    // La vista previa por rubro (navegador): la web de ejemplo de una tienda, sin huecos.
    const vista = panel.getByTestId('preview-negocio');
    await expect(vista).toHaveAttribute('data-rubro', 'comercio');
    await expect(vista).toHaveAttribute('data-dispositivo', 'escritorio');
    await expect(vista).toContainText(getPlantilla('comercio')!.portada.tituloDeEjemplo);
    await expect(vista.locator('[data-hueco]')).toHaveCount(0);
    await wizard(page).getByLabel('Nombre de tu negocio').fill('Tienda Sol');
    await expect(vista).toContainText('Tienda Sol');
  });

  test('"Qué podés activar" es un mapa de piezas (filas completas, anchos distintos); FAQ en 2', async ({
    page,
  }) => {
    await page.goto('/empezar');
    const piezas = page.locator('[data-mapa-piezas] > li');
    await expect(piezas).toHaveCount(8);
    // Varias piezas por fila (al menos 3 posiciones X), en 3 filas.
    expect(await columnas(page, '[data-mapa-piezas] > li')).toBeGreaterThanOrEqual(3);
    const cajas = await piezas.evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return { top: Math.round(r.top), left: r.left, right: r.right, width: Math.round(r.width) };
      }),
    );
    expect(new Set(cajas.map((c) => c.top)).size).toBe(3);
    // No son tarjetas iguales: al menos 3 anchos distintos.
    expect(new Set(cajas.map((c) => c.width)).size).toBeGreaterThanOrEqual(3);
    // Cada fila encastra de borde a borde del tablero (sin huecos al final).
    const tablero = (await page.locator('[data-mapa-piezas]').boundingBox())!;
    for (const top of new Set(cajas.map((c) => c.top))) {
      const fila = cajas.filter((c) => c.top === top);
      expect(Math.max(...fila.map((c) => c.right))).toBeGreaterThan(tablero.x + tablero.width - 4);
      expect(Math.min(...fila.map((c) => c.left))).toBeLessThan(tablero.x + 4);
    }
    expect(await columnas(page, 'section[aria-labelledby="faq-title"] details')).toBe(2);
  });

  test('títulos de sección de una línea y descripciones de una sola frase', async ({ page }) => {
    await page.goto('/empezar');
    for (const id of ['incluye-title', 'faq-title']) {
      expect(await lineas(page, `#${id}`)).toBe(1);
    }
    const textos = await page
      .locator(
        'section[aria-labelledby="incluye-title"] [data-mapa-piezas] li p, #incluye-title + p',
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
    // En celular, la vista previa es un celular con la web del rubro y el nombre del negocio.
    const vista = page.getByTestId('negocio-preview').getByTestId('preview-negocio');
    await expect(vista).toHaveAttribute('data-dispositivo', 'celular');
    await expect(vista).toContainText('Luna Peluquería');
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
