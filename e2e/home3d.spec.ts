import { expect, test, type Page } from '@playwright/test';

/**
 * Hero 3D de la home: el poster es lo primero (LCP), el WebGL dibuja de verdad cuando se fuerza, el plan B
 * funciona sin él, el movimiento reducido deja todo quieto y completo, y ningún link interno da 404.
 * Las capturas de regresión visual van con movimiento reducido (poster quieto: estables entre corridas).
 */

const soloEn = (nombres: string[]) =>
  test.beforeEach(({}, info) => {
    test.skip(!nombres.includes(info.project.name), `solo en ${nombres.join(', ')}`);
  });

test.describe('poster primero', () => {
  soloEn(['desktop', 'iphone-15']);

  test('el poster del estado 0 se precarga y se pinta con medidas fijas', async ({ page }) => {
    await page.goto('/?simbolo=poster', { waitUntil: 'networkidle' });
    const poster = page.locator('#hero .h3d-poster-0');
    await expect(poster).toBeVisible();
    expect(await poster.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(
      true,
    );
    await expect(poster).toHaveAttribute('width', '1600');
    await expect(poster).toHaveAttribute('height', '1000');
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(1);
    // Decorativo: el mensaje está en el texto.
    await expect(page.locator('#hero .h3d-objeto')).toHaveAttribute('aria-hidden', 'true');
  });

  test('sin WebGL no se pide el chunk de three.js', async ({ page }) => {
    const scripts: string[] = [];
    page.on('request', (r) => {
      if (r.resourceType() === 'script') scripts.push(r.url());
    });
    await page.goto('/?simbolo=poster', { waitUntil: 'networkidle' });
    await expect.poll(() => page.evaluate(() => window.__simbolo)).toBe('poster');
    const cuerpos = await Promise.all(
      scripts.map((u) => page.request.get(u).then((r) => r.text())),
    );
    expect(cuerpos.some((c) => c.includes('WebGLRenderer'))).toBe(false);
  });
});

test.describe('tres estados con el scroll', () => {
  soloEn(['desktop', 'iphone-15']);

  test('el progreso va de 0 a 1 en el tramo fijo y la barra del celular aparece al pasar el hero', async ({
    page,
  }) => {
    await page.goto('/?simbolo=poster', { waitUntil: 'networkidle' });
    const p = () => page.locator('#hero').evaluate((el) => Number(el.style.getPropertyValue('--p') || 0));
    expect(await p()).toBe(0);
    await page.evaluate(() => {
      const h = document.getElementById('hero')!;
      window.scrollTo(0, h.offsetTop + (h.offsetHeight - window.innerHeight) / 2);
    });
    await expect.poll(p).toBeGreaterThan(0.3);
    await page.evaluate(() => {
      const h = document.getElementById('hero')!;
      window.scrollTo(0, h.offsetTop + h.offsetHeight);
    });
    await expect.poll(p).toBe(1);
    await expect(page.locator('html')).toHaveAttribute('data-hero-paso', '');
  });
});

test.describe('movimiento reducido', () => {
  soloEn(['desktop', 'iphone-15']);
  test.use({ reducedMotion: 'reduce' });

  test('sin tramo fijo, sin WebGL, el lema completo y un solo poster', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const vh = page.viewportSize()!.height;
    const alto = await page.locator('#hero').evaluate((el) => (el as HTMLElement).offsetHeight);
    expect(alto).toBeLessThan(vh * 1.2);
    await expect.poll(() => page.evaluate(() => window.__simbolo)).toBe('poster');
    for (const palabra of await page.locator('.h3d-palabra').all()) {
      await expect(palabra).toHaveCSS('opacity', '1');
    }
    await expect(page.locator('.h3d-poster-1')).toBeHidden();
    await expect(page.locator('.h3d-poster-2')).toBeHidden();
  });
});

test.describe('contacto y zona desde el hero', () => {
  soloEn(['desktop', 'iphone-15']);

  test('el sello abre WhatsApp en otra pestaña y el globo lleva a /zona', async ({ page }) => {
    await page.goto('/?simbolo=poster', { waitUntil: 'networkidle' });
    const sello = page.locator('#hero').getByRole('link', { name: /^Escribinos por/ });
    await expect(sello).toHaveAttribute('href', /^https:\/\/wa\.me\//);
    await expect(sello).toHaveAttribute('target', '_blank');
    expect((await sello.boundingBox())!.width).toBeGreaterThanOrEqual(72);
    await page.locator('#hero').getByRole('link', { name: /Ver la zona de atención/ }).click();
    await expect(page).toHaveURL(/\/zona$/);
  });

  test('la píldora "¿Qué necesita tu negocio?" lleva al buscador', async ({ page }) => {
    await page.goto('/?simbolo=poster', { waitUntil: 'networkidle' });
    await page.locator('#hero').getByRole('link', { name: '¿Qué necesita tu negocio?' }).click();
    await expect(page).toHaveURL(/#necesita$/);
    await expect(page.locator('#necesita').getByRole('combobox')).toBeInViewport();
  });
});

test.describe('enlaces internos', () => {
  soloEn(['desktop']);

  test('ningún link interno de la home ni del menú da 404', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Abrir el menú' }).click();
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href]')]
        .map((a) => a.getAttribute('href')!)
        .filter((h) => h.startsWith('/') && !h.startsWith('//')),
    );
    const unicos = [...new Set(hrefs.map((h) => h.split('#')[0]!.split('?')[0]!))].filter(Boolean);
    expect(unicos.length).toBeGreaterThan(10);
    const rotos: string[] = [];
    for (const h of unicos) {
      const r = await request.get(h, { maxRedirects: 3 });
      if (r.status() >= 400) rotos.push(`${h} → ${r.status()}`);
    }
    expect(rotos).toEqual([]);
  });
});

/** Regresión visual de la primera pantalla, quieta (movimiento reducido = poster). */
async function primeraPantalla(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('#hero .h3d-poster-0')).toBeVisible();
}

test.describe('regresión visual', () => {
  test.use({ reducedMotion: 'reduce' });

  test('primera pantalla de la home', async ({ page }) => {
    await primeraPantalla(page);
    await expect(page).toHaveScreenshot('home-hero.png', {
      mask: [page.locator('.h3d-globo')],
      maxDiffPixelRatio: 0.03,
    });
  });
});
