import { expect, test } from '@playwright/test';
import { abrirWizard, elegirRubro, TITULO_NEGOCIO, wizard } from './helpers';

test.describe('prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce' });

  test('las tarjetas de rubro quedan estáticas y completas, y las secciones se ven sin hacer scroll', async ({
    page,
  }) => {
    await page.goto('/empezar');
    const piezas = page.locator('.hero-piece');
    expect(await piezas.count()).toBeGreaterThan(0);
    for (const el of await piezas.all()) {
      await expect(el).toHaveCSS('animation-name', 'none');
      await expect(el).toHaveCSS('opacity', '1');
    }
    for (const el of await page.locator('.reveal').all()) {
      await expect(el).toHaveCSS('animation-name', 'none');
      await expect(el).toHaveCSS('opacity', '1');
    }
    // El logo aparece entero y quieto: las 5 letras visibles, sin animación.
    const letras = page.locator('header .logo-pieza');
    await expect(letras).toHaveCount(5);
    for (const el of await letras.all()) {
      await expect(el).toHaveCSS('animation-name', 'none');
      await expect(el).toHaveCSS('opacity', '1');
    }
  });

  test('el flujo sigue funcionando', async ({ page }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    await elegirRubro(page, 'gastronomia');
    await expect(wizard(page).getByRole('heading', { name: TITULO_NEGOCIO })).toBeVisible();
  });
});

test.describe('movimiento normal', () => {
  test('las tarjetas de rubro entran una sola vez (nada en loop sobre lo que se toca)', async ({
    page,
  }) => {
    await page.goto('/empezar');
    const pieza = page.locator('.hero-piece').first();
    await expect(pieza).not.toHaveCSS('animation-name', 'none');
    await expect(pieza).toHaveCSS('animation-iteration-count', '1');
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.hero-piece')].every((el) =>
        el.getAnimations().every((a) => a.playState === 'finished'),
      ),
    );
    for (const b of await wizard(page).locator('[data-rubro]').all()) {
      await expect(b).toBeVisible();
    }
  });

  test('el logo se arma una sola vez y queda quieto', async ({ page }) => {
    await page.goto('/empezar');
    const letras = page.locator('header .logo-pieza');
    await expect(letras).toHaveCount(5);
    await expect(letras.first()).toHaveCSS('animation-name', 'logo-encaje');
    await expect(letras.first()).toHaveCSS('animation-iteration-count', '1');
    // Terminado el armado no queda nada corriendo en el logo.
    await page.waitForFunction(() =>
      [...document.querySelectorAll('header .logo-pieza')].every((el) =>
        el.getAnimations().every((a) => a.playState === 'finished'),
      ),
    );
    for (const el of await letras.all()) await expect(el).toHaveCSS('opacity', '1');
  });

  test('solo se animan transform y opacity (tarjetas, revelado y logo)', async ({
    page,
  }) => {
    const recoger = (selectores: string[]) =>
      page.evaluate((sels) => {
        const nombres = new Set<string>();
        for (const sel of sels) {
          const el = document.querySelector(sel);
          if (!el) continue;
          for (const a of el.getAnimations()) {
            const efecto = a.effect as KeyframeEffect | null;
            for (const kf of efecto?.getKeyframes() ?? []) {
              for (const k of Object.keys(kf)) {
                if (!['offset', 'easing', 'composite', 'computedOffset'].includes(k)) {
                  nombres.add(k);
                }
              }
            }
          }
        }
        return [...nombres];
      }, selectores);

    await page.goto('/empezar');
    const tarjetas = await recoger(['.hero-piece', '.reveal']);
    const logo = await recoger(['header .logo-pieza']);
    expect(logo.length).toBeGreaterThan(0);
    expect(tarjetas.length).toBeGreaterThan(0);
    for (const p of [...logo, ...tarjetas]) expect(['opacity', 'transform']).toContain(p);
  });
});
