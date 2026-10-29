import { expect, test, type Page } from '@playwright/test';

// El SEO no depende del viewport: se prueba una vez, en desktop.
test.beforeEach(({ viewport }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop' || !viewport, 'solo desktop');
});

const meta = (page: Page, selector: string) => page.locator(`head ${selector}`).first();

test('metadata: título, descripción, canonical y robots', async ({ page }) => {
  await page.goto('/empezar');
  await expect(page).toHaveTitle('Creá tu negocio online | WebYa');
  await expect(meta(page, 'meta[name="description"]')).toHaveAttribute(
    'content',
    /Elegí tu rubro y activá solo lo que tu negocio necesita/,
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
  await expect(meta(page, 'meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Creá tu negocio online | WebYa',
  );
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
    /creá tu negocio online/i,
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
  await expect(page.locator('h1')).toContainText('Creá tu negocio online.');
  const niveles = await page.evaluate(() =>
    [...document.querySelectorAll('h1,h2,h3')].map((h) => Number(h.tagName[1])),
  );
  for (let i = 1; i < niveles.length; i++) {
    expect((niveles[i] ?? 0) - (niveles[i - 1] ?? 0)).toBeLessThanOrEqual(1);
  }
});
