import { expect, test } from '@playwright/test';

/**
 * Home "El pueblo": el plano del hero con los negocios que se tocan (cada uno abre su ficha con la mini
 * demo y el link a la demo completa), sin movimiento todo queda quieto y con el turno confirmado, las
 * acciones llevan a donde dicen, los logos de "Confían en Webya" cargan y cada trabajo abre su caso. La
 * regresión visual va con movimiento reducido (estable).
 */

const soloEn = (nombres: string[]) =>
  test.beforeEach(({}, info) => {
    test.skip(!nombres.includes(info.project.name), `solo en ${nombres.join(', ')}`);
  });

test.describe('el plano del pueblo', () => {
  soloEn(['desktop', 'iphone-15']);

  test('arranca con la peluquería y cada negocio abre su ficha con su demo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const hero = page.locator('#hero');
    const ficha = hero.locator('.pb-globo');
    await expect(hero.getByRole('button', { name: 'Peluquería' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(ficha.getByRole('link', { name: 'Probá la demo de turnos' })).toHaveAttribute(
      'href',
      '/demos/turnos',
    );

    const casos = [
      ['Pizzería', 'Probá la demo de pedidos', '/demos/pedidos'],
      ['Comercio', 'Probá la demo de tienda', '/demos/tienda'],
      ['Consultorio', 'Probá la demo de página web', '/demos/web'],
      ['Tu negocio', 'Armá tu sistema', '/armar'],
    ] as const;
    for (const [rubro, link, href] of casos) {
      const boton = hero.getByRole('button', { name: rubro });
      await boton.click();
      await expect(boton).toHaveAttribute('aria-pressed', 'true');
      await expect(ficha.getByRole('link', { name: link })).toHaveAttribute('href', href);
    }
  });
});

test.describe('movimiento reducido', () => {
  soloEn(['desktop', 'iphone-15']);
  test.use({ reducedMotion: 'reduce' });

  test('todo quieto: el lema completo, la bajada y el turno ya confirmado', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const hero = page.locator('#hero');
    for (const palabra of await hero.locator('.pb-palabra').all()) {
      await expect(palabra).toHaveCSS('opacity', '1');
    }
    await expect(hero.getByText(/^Turnos con seña, pedidos y tiendas online/)).toBeVisible();
    await expect(hero.locator('.vt-paso-3')).toHaveCSS('opacity', '1');
    await expect(hero.locator('.pb-reparto')).toBeHidden();
  });
});

test.describe('acciones del hero', () => {
  soloEn(['desktop', 'iphone-15']);

  test('"Probá las demos" abre las demos y "Armá tu sistema" el configurador', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const hero = page.locator('#hero');
    await hero.getByRole('link', { name: 'Probá las demos' }).click();
    await expect(page).toHaveURL(/\/demos$/);
    await page.goto('/', { waitUntil: 'networkidle' });
    await hero.getByRole('link', { name: 'Armá tu sistema' }).click();
    await expect(page).toHaveURL(/\/armar$/);
  });
});

test.describe('asistente', () => {
  soloEn(['desktop', 'iphone-15']);

  test('la carita abre el chat, entiende el problema y pasa a WhatsApp', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const carita = page.getByRole('button', { name: 'Abrir el asistente de Webya' });
    await expect(carita).toBeVisible();
    await carita.click();
    const chat = page.getByRole('dialog', { name: 'Asistente de Webya' });
    await expect(chat).toBeVisible();
    await chat.getByRole('button', { name: 'Me reservan y no vienen' }).click();
    await expect(chat.getByRole('link', { name: /Turnos con seña/ })).toBeVisible();
    await chat.getByRole('textbox').fill('quiero hablar con una persona');
    await chat.getByRole('button', { name: 'Enviar' }).click();
    const wa = chat.getByRole('link', { name: 'Seguir por WhatsApp' }).first();
    await expect(wa).toHaveAttribute('href', /^https:\/\/wa\.me\/.*asistente/);
    await page.keyboard.press('Escape');
    await expect(chat).toBeHidden();
    await expect(carita).toBeFocused();
  });
});

test.describe('confían en Webya y últimos trabajos', () => {
  soloEn(['desktop', 'iphone-15']);

  test('los cinco logos cargan, con su nombre', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const confian = page.locator('#confian');
    await expect(confian.getByRole('heading', { name: 'Confían en Webya' })).toBeAttached();
    const logos = confian.locator('ul:not([aria-hidden]) img');
    await expect(logos).toHaveCount(5);
    for (const nombre of [
      "Micio's Pizzería",
      'Joyería Petrucci',
      'Fono San Jorge',
      'Abelardo Pizzería',
      'Carribar Las Maris',
    ]) {
      await expect(confian.getByRole('img', { name: nombre })).toHaveCount(1);
    }
    // En el celular la calle pasa en marquesina: se espera a que todas terminen de cargar.
    await confian.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect
      .poll(
        () =>
          logos.evaluateAll((imgs) => imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0)),
        {
          timeout: 20_000,
        },
      )
      .toBe(true);
  });

  test('cada trabajo abre su caso', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const trabajos = page.locator('#trabajos');
    const tarjetas = trabajos.locator('.tb-tarjeta');
    expect(await tarjetas.count()).toBeGreaterThanOrEqual(4);
    await trabajos.getByRole('link', { name: /Micio's Pizzería/ }).click();
    await expect(page).toHaveURL(/\/proyectos\/micios$/);
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

test.describe('regresión visual', () => {
  test.use({ reducedMotion: 'reduce' });

  test('primera pantalla de la home (el plano del pueblo)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#hero .pb-plano')).toBeVisible();
    await expect(page).toHaveScreenshot('home-hero.png', { maxDiffPixelRatio: 0.03 });
  });
});
