import { expect, test, type Page } from '@playwright/test';
import { HERO } from '../src/content/empezar/hero';
import { ESTADOS_PAGINA } from '../src/content/estados-pagina';
import { SEO_EMPEZAR, SEO_SITIO } from '../src/content/seo';

const TITULO = SEO_SITIO.tituloConMarca(SEO_EMPEZAR.titulo);

// El SEO no depende del viewport: se prueba una vez, en desktop.
test.beforeEach(({ viewport }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop' || !viewport, 'solo desktop');
});

const meta = (page: Page, selector: string) => page.locator(`head ${selector}`).first();

test('metadata: título, descripción, canonical y robots', async ({ page }) => {
  await page.goto('/empezar');
  await expect(page).toHaveTitle(TITULO);
  await expect(meta(page, 'meta[name="description"]')).toHaveAttribute(
    'content',
    SEO_EMPEZAR.descripcion,
  );
  await expect(meta(page, 'link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://webya.ar/empezar',
  );
  await expect(meta(page, 'meta[name="robots"]')).toHaveAttribute('content', /index, follow/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-AR');
});

test('Open Graph y Twitter con imagen', async ({ page, request }) => {
  await page.goto('/empezar');
  await expect(meta(page, 'meta[property="og:title"]')).toHaveAttribute('content', TITULO);
  await expect(meta(page, 'meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://webya.ar/empezar',
  );
  await expect(meta(page, 'meta[property="og:locale"]')).toHaveAttribute('content', 'es_AR');
  await expect(meta(page, 'meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );
  await expect(meta(page, 'meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(meta(page, 'meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  await expect(meta(page, 'meta[property="og:image:alt"]')).toHaveAttribute(
    'content',
    SEO_EMPEZAR.og.alt,
  );

  // La imagen existe y es un PNG real (se pide a la ruta local: el host del og:image es el de producción).
  const og = await page.locator('head meta[property="og:image"]').first().getAttribute('content');
  expect(og).toMatch(/^https:\/\/webya\.ar\/empezar\/opengraph-image/);
  const ruta = new URL(og ?? '').pathname + new URL(og ?? '').search;
  const res = await request.get(ruta);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
  const bytes = await res.body();
  expect([...bytes.subarray(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
  expect(bytes.length).toBeGreaterThan(5_000);
  expect(bytes.length).toBeLessThan(1_000_000);
});

test('robots.txt y sitemap.xml', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('User-Agent: *');
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Disallow: /api/');
  expect(robots).toContain('Sitemap: https://webya.ar/sitemap.xml');

  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('<loc>https://webya.ar/empezar</loc>');
  expect(sitemap).toContain('<loc>https://webya.ar/demo/gastronomia</loc>');
});

test('/marca es interna: noindex y fuera del sitemap', async ({ page, request }) => {
  await page.goto('/marca');
  await expect(meta(page, 'meta[name="robots"]')).toHaveAttribute('content', /noindex, nofollow/);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toContain('/marca');
});

test('/sistema es interna: noindex y fuera del sitemap', async ({ page, request }) => {
  await page.goto('/sistema');
  await expect(meta(page, 'meta[name="robots"]')).toHaveAttribute('content', /noindex, nofollow/);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toContain('/sistema');
});

test('JSON-LD del FAQ es válido y coincide con lo que se ve', async ({ page }) => {
  await page.goto('/empezar');
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(json ?? '{}') as {
    '@type': string;
    mainEntity: { name: string; acceptedAnswer: { text: string } }[];
  };
  expect(data['@type']).toBe('FAQPage');
  expect(data.mainEntity.length).toBeGreaterThanOrEqual(4);
  for (const q of data.mainEntity) {
    await expect(page.locator('summary', { hasText: q.name })).toBeVisible();
    expect(q.acceptedAnswer.text.length).toBeGreaterThan(20);
  }
});

test('encabezados: un solo h1 y jerarquía sin saltos', async ({ page }) => {
  await page.goto('/empezar');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText(HERO.titulo);
  const niveles = await page.evaluate(() =>
    [...document.querySelectorAll('h1,h2,h3')].map((h) => Number(h.tagName[1])),
  );
  for (let i = 1; i < niveles.length; i++) {
    expect((niveles[i] ?? 0) - (niveles[i - 1] ?? 0)).toBeLessThanOrEqual(1);
  }
});

test('una URL que no existe responde 404 con la página propia y noindex', async ({ page }) => {
  const res = await page.goto('/no-existe-esta-pagina');
  expect(res?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { level: 1, name: ESTADOS_PAGINA.noEncontrada.titulo }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: ESTADOS_PAGINA.noEncontrada.cta })).toHaveAttribute(
    'href',
    '/empezar',
  );
});
