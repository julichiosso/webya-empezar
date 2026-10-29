import { expect, test } from '@playwright/test';

/** Headers de seguridad y CSP fija con SRI (docs/adr/0001-csp-fija-con-sri.md). */
for (const ruta of ['/empezar', '/demo/gastronomia']) {
  test(`${ruta}: CSP fija y headers de seguridad`, async ({ request }) => {
    const res = await request.get(ruta);
    const h = res.headers();
    const csp = h['content-security-policy'] ?? '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain('unsafe-eval');
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBe('DENY');
  });

  test(`${ruta}: los scripts del framework llevan integrity (SRI)`, async ({ request }) => {
    const html = await (await request.get(ruta)).text();
    const scripts = [...html.matchAll(/<script[^>]*\ssrc="[^"]+"[^>]*>/g)].map((m) => m[0]);
    // Next 16.4 aplica SRI al runtime, polyfills y main-app, pero no a los chunks de cada página
    // (los tiene en el manifiesto y no los usa). Limitación documentada en el ADR 0001.
    const delFramework = scripts.filter((s) => /\/(webpack|main-app|polyfills)-[^/]+\.js"/.test(s));
    expect(delFramework.length).toBeGreaterThanOrEqual(3);
    for (const s of delFramework) expect(s, s).toMatch(/integrity="sha256-[A-Za-z0-9+/=]+"/);
  });
}

test('la CSP no bloquea nada al usar la página', async ({ page }) => {
  const violaciones: string[] = [];
  page.on('console', (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) violaciones.push(m.text());
  });
  await page.goto('/empezar');
  await page.evaluate(() => document.querySelector('#wizard')?.scrollIntoView());
  await page.waitForLoadState('networkidle');
  await page.goto('/demo/gastronomia');
  await page.waitForLoadState('networkidle');
  expect(violaciones).toEqual([]);
});
