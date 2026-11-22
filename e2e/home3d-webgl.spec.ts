import { expect, test } from '@playwright/test';

/**
 * El símbolo en WebGL de verdad: Chromium headless con SwiftShader (render por software). Sin estos flags el
 * headless no tiene WebGL2 y el sitio cae al poster (eso lo prueba home3d.spec.ts).
 */
test.use({
  launchOptions: {
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  },
});
test.beforeEach(({}, info) => {
  test.skip(!['desktop', 'iphone-15'].includes(info.project.name), 'solo en desktop e iphone-15');
});

test.describe('WebGL', () => {

  test('forzado, el canvas reemplaza al poster', async ({ page }) => {
    await page.goto('/?simbolo=3d', { waitUntil: 'load' });
    await expect.poll(() => page.evaluate(() => window.__simbolo), { timeout: 30_000 }).toBe('listo');
    await expect(page.locator('#hero .h3d-objeto')).toHaveClass(/h3d-en3d/);
  });

  test('el canvas dibuja el símbolo de verdad (píxeles opacos)', async ({ page }) => {
    // Modo captura: conserva el buffer de dibujo para poder leerlo.
    await page.goto('/?captura=2', { waitUntil: 'load' });
    await expect.poll(() => page.evaluate(() => window.__simbolo), { timeout: 30_000 }).toBe('listo');
    const pixeles = await page.locator('#hero .h3d-canvas').evaluate((c: HTMLCanvasElement) => {
      // Se copia a un canvas 2D: cuenta los píxeles opacos (el símbolo) sobre el fondo transparente.
      const ctx = Object.assign(document.createElement('canvas'), { width: 160, height: 100 }).getContext(
        '2d',
      )!;
      ctx.drawImage(c, 0, 0, 160, 100);
      const d = ctx.getImageData(0, 0, 160, 100).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i]! > 200) n++;
      return n;
    });
    expect(pixeles).toBeGreaterThan(800);
  });

  test('el canvas no bloquea el scroll de la página', async ({ page }) => {
    await page.goto('/?simbolo=3d', { waitUntil: 'load' });
    await expect.poll(() => page.evaluate(() => window.__simbolo), { timeout: 30_000 }).toBe('listo');
    const canvas = page.locator('#hero .h3d-canvas');
    await expect(canvas).toHaveCSS('touch-action', 'pan-y');
    await canvas.hover();
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  });
});

