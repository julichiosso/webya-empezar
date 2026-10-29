import { expect, test, type Page } from '@playwright/test';
import { abrirWizard, tocar, wizard } from './helpers';

const hero = (page: Page) => page.getByRole('group', { name: /armá tu negocio/i });

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

  test('activar un módulo cambia el estado al instante, sin animación, y la pista se ve igual', async ({
    page,
  }) => {
    await page.goto('/empezar');
    const tarjeta = hero(page).getByRole('button', { name: /turnos y reservas/i });
    await tarjeta.click();
    await expect(tarjeta).toHaveAttribute('aria-pressed', 'true');
    await expect(tarjeta).toHaveCSS('animation-name', 'none');
    await expect(tarjeta.locator('.tile-check')).toHaveCSS('opacity', '1');
    // La pista es texto: se muestra (sin movimiento) y se va sola.
    await expect(hero(page).getByText('Tocá para activar')).toBeVisible();
    await expect(hero(page).getByText('Tocá para activar')).toBeHidden({ timeout: 6000 });
  });

  test('el wizard sigue funcionando', async ({ page }) => {
    await page.goto('/empezar');
    await abrirWizard(page);
    await tocar(page, /gastronomía/i);
    await wizard(page).getByRole('button', { name: 'Siguiente' }).click();
    await expect(wizard(page).getByRole('heading', { name: '¿Qué querés activar?' })).toBeVisible();
  });
});

test.describe('movimiento normal', () => {
  test('el hero se arma una sola vez (no hay loop sobre elementos interactivos)', async ({
    page,
  }) => {
    await page.goto('/empezar');
    const pieza = page.locator('.hero-piece').first();
    await expect(pieza).not.toHaveCSS('animation-name', 'none');
    await expect(pieza).toHaveCSS('animation-iteration-count', '1');
    // Terminada la entrada, las tarjetas quedan visibles y estables.
    for (const b of await hero(page).getByRole('button').all()) {
      await expect(b).toBeVisible();
    }
    await page.waitForTimeout(1500);
    await expect(hero(page).getByRole('button').first()).toHaveCSS('opacity', '1');
  });

  test('la pista "Tocá para activar" aparece al primer toque, se va sola y no vuelve', async ({
    page,
  }) => {
    await page.goto('/empezar');
    const pista = hero(page).getByText('Tocá para activar');
    await expect(pista).toBeHidden();
    await hero(page)
      .getByRole('button', { name: /turnos y reservas/i })
      .click();
    await expect(pista).toBeVisible();
    await expect(pista).toBeHidden({ timeout: 6000 });
    await hero(page)
      .getByRole('button', { name: /pagos online/i })
      .click();
    await expect(pista).toBeHidden();
  });

  test('solo se animan transform y opacity (hero, revelado y activar módulo)', async ({ page }) => {
    await page.goto('/empezar');
    await hero(page)
      .getByRole('button', { name: /carta con qr/i })
      .click();
    const propiedades = await page.evaluate(() => {
      const nombres = new Set<string>();
      for (const sel of ['.hero-piece', '.reveal', '.tile[aria-pressed="true"]', '.hint-in']) {
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
