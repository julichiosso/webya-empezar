import { expect, test } from '@playwright/test';

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'desktop', 'SEO: un proyecto alcanza');
});

const SITIO = 'https://webya.dev';

for (const ruta of [
  '/',
  '/turnero',
  '/pedidos',
  '/tienda',
  '/web',
  '/proyectos',
  '/nosotros',
  '/zona',
  '/armar',
  '/demos',
]) {
  test(`${ruta}: title, description, canonical y Open Graph`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page).toHaveTitle(/Webya/);
    const meta = (sel: string) => page.locator(sel).first().getAttribute('content');
    expect((await meta('meta[name="description"]'))!.length).toBeGreaterThan(60);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(
      ruta === '/' ? SITIO : `${SITIO}${ruta}`,
    );
    expect(await meta('meta[property="og:image"]')).toContain('/opengraph-image');
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-AR');
  });
}

test('JSON-LD: organización, negocio con toda la zona, Julián y un Service por producto', async ({
  page,
}) => {
  await page.goto('/');
  const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
  const datos = bloques.map((b) => JSON.parse(b));
  const grafo = datos.find((d) => d['@graph'])['@graph'] as Record<string, unknown>[];
  const negocio = grafo.find((n) => n['@type'] === 'ProfessionalService')!;
  expect(JSON.stringify(negocio.areaServed)).toContain('San Jorge');
  expect(JSON.stringify(negocio.areaServed)).toContain('San Francisco');
  expect(JSON.stringify(negocio.areaServed)).toContain('Sastre');
  expect(grafo.filter((n) => n['@type'] === 'Service').length).toBeGreaterThanOrEqual(6);
  expect(grafo.some((n) => n['@type'] === 'Organization')).toBe(true);
  const persona = grafo.find((n) => n['@type'] === 'Person')!;
  expect(persona.name).toBe('Julián Chiosso');
});

test('sitemap con las landings y robots que lo apunta', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const r of ['/turnero', '/pedidos', '/tienda', '/web', '/proyectos', '/nosotros', '/zona'])
    expect(sitemap).toContain(`${SITIO}${r}`);
  expect(sitemap).not.toContain('/pizzerias');
  expect(sitemap).not.toContain('/empezar');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain(`Sitemap: ${SITIO}/sitemap.xml`);
});

test('la imagen Open Graph existe y es PNG', async ({ request }) => {
  const res = await request.get('/opengraph-image');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
});

test('cada página tiene un solo h1 y ningún link dice "(se abre en otra pestaña)" a la vista', async ({
  page,
}) => {
  for (const ruta of ['/', '/turnero', '/proyectos', '/nosotros', '/demos']) {
    await page.goto(ruta);
    await expect(page.locator('h1')).toHaveCount(1);
    const visibles = await page
      .locator('a')
      .evaluateAll(
        (as) =>
          as.filter((a) => /se abre en otra pesta/i.test((a as HTMLElement).innerText)).length,
      );
    expect(visibles, ruta).toBe(0);
  }
});
