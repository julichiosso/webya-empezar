import { expect, test } from '@playwright/test';
import { wizard } from './helpers';

test.describe('prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce' });

  test('el hero queda estático y completo, y las secciones se ven sin hacer scroll', async ({
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
  });

  test('el wizard sigue funcionando', async ({ page }) => {
    await page.goto('/empezar');
    await wizard(page)
      .locator('label', { hasText: /gastronomía/i })
      .click();
    await wizard(page).getByRole('button', { name: 'Continuar' }).click();
    await expect(wizard(page).getByRole('heading', { name: '¿Qué querés lograr?' })).toBeVisible();
  });
});

test.describe('movimiento normal', () => {
  test('el hero se anima y se pausa al salir de pantalla', async ({ page }) => {
    await page.goto('/empezar');
    const pieza = page.locator('.hero-piece').first();
    await expect(pieza).not.toHaveCSS('animation-name', 'none');
    const arte = page.locator('.hero-art');
    await expect(arte).toHaveAttribute('data-playing', 'true');

    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(arte).toHaveAttribute('data-playing', 'false');
    await expect(pieza).toHaveCSS('animation-play-state', 'paused');
  });

  test('solo se animan transform y opacity en el hero y el revelado', async ({ page }) => {
    await page.goto('/empezar');
    const propiedades = await page.evaluate(() => {
      const nombres = new Set<string>();
      for (const sel of ['.hero-piece', '.reveal']) {
        const el = document.querySelector(sel);
        if (!el) continue;
        for (const a of el.getAnimations()) {
          const efecto = a.effect as KeyframeEffect | null;
          for (const kf of efecto?.getKeyframes() ?? []) {
            for (const k of Object.keys(kf)) {
              if (!['offset', 'easing', 'composite', 'computedOffset'].includes(k)) nombres.add(k);
            }
          }
        }
      }
      return [...nombres];
    });
    expect(propiedades.length).toBeGreaterThan(0);
    for (const p of propiedades) expect(['opacity', 'transform']).toContain(p);
  });
});
