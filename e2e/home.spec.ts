import { expect, test, type Page } from '@playwright/test';

/**
 * Home "Abierto siempre": la calle del hero se hace de noche con el scroll (y el header pasa a blanco),
 * sin movimiento queda quieta y de noche, las acciones llevan a donde dicen, los logos de "Confían en
 * Webya" cargan y cada trabajo abre su caso. La regresión visual va con movimiento reducido (estable).
 */

const soloEn = (nombres: string[]) =>
  test.beforeEach(({}, info) => {
    test.skip(!nombres.includes(info.project.name), `solo en ${nombres.join(', ')}`);
  });

/** Lleva el scroll a una fracción del tramo fijo del hero (0 a 1). */
async function irAlTramo(page: Page, f: number) {
  await page.evaluate((fr) => {
    const h = document.getElementById('hero')!;
    window.scrollTo(0, h.offsetTop + (h.offsetHeight - window.innerHeight) * fr);
  }, f);
}

test.describe('la calle con el scroll', () => {
  soloEn(['desktop', 'iphone-15']);

  test('el progreso va de 0 a 1, se hace de noche y el header pasa a blanco', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const hero = page.locator('#hero');
    const header = page.locator('header.a-nav');
    const p = () => hero.evaluate((el) => Number(el.style.getPropertyValue('--p') || 0));

    expect(await p()).toBe(0);
    await expect(hero).toHaveAttribute('data-paso', '0');
    await expect(hero).not.toHaveAttribute('data-oscuro', '');
    await expect(header).not.toHaveAttribute('data-sobre', 'oscuro');

    await irAlTramo(page, 0.45);
    await expect.poll(p).toBeGreaterThan(0.3);
    await expect(hero).toHaveAttribute('data-paso', '1');
    await expect(hero).toHaveAttribute('data-oscuro', '');
    await expect(header).toHaveAttribute('data-sobre', 'oscuro');
    await expect(hero.getByText(/^Bajás la persiana/)).toBeVisible();

    await irAlTramo(page, 1);
    await expect.poll(p).toBe(1);
    await expect(hero).toHaveAttribute('data-paso', '2');

    // Pasado el hero: la franja oscura mantiene el header blanco; en "Últimos trabajos" vuelve a negro.
    await page.locator('#confian').evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(page.locator('html')).toHaveAttribute('data-hero-paso', '');
    await page
      .locator('#trabajos')
      .evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 200));
    await expect(header).not.toHaveAttribute('data-sobre', 'oscuro');
  });
});

test.describe('la luna', () => {
  soloEn(['desktop', 'iphone-15']);

  test('de noche, tocar la luna hace de día y el header vuelve a negro', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const hero = page.locator('#hero');
    await irAlTramo(page, 0.45);
    await expect(hero).toHaveAttribute('data-oscuro', '');
    await hero.getByRole('button', { name: 'Hacer de día' }).click();
    await expect(hero).toHaveAttribute('data-cielo', 'dia');
    await expect(hero).not.toHaveAttribute('data-oscuro', '');
    await expect(page.locator('header.a-nav')).not.toHaveAttribute('data-sobre', 'oscuro');
    await expect(hero.getByRole('button', { name: 'Hacer de noche' })).toBeVisible();
  });
});

test.describe('movimiento reducido', () => {
  soloEn(['desktop', 'iphone-15']);
  test.use({ reducedMotion: 'reduce' });

  test('sin tramo fijo: la calle quieta y de noche, el lema completo y la bajada', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const hero = page.locator('#hero');
    const vh = page.viewportSize()!.height;
    expect(await hero.evaluate((el) => (el as HTMLElement).offsetHeight)).toBeLessThan(vh * 1.2);
    await expect(hero).toHaveAttribute('data-oscuro', '');
    await expect(page.locator('header.a-nav')).toHaveAttribute('data-sobre', 'oscuro');
    for (const palabra of await hero.locator('.hc-palabra').all()) {
      await expect(palabra).toHaveCSS('opacity', '1');
    }
    await expect(hero.getByText(/^Turnos, pedidos y tiendas online/)).toBeVisible();
    await expect(hero.locator('.hc-noche')).toHaveCSS('opacity', '1');
  });
});

test.describe('acciones del hero', () => {
  soloEn(['desktop', 'iphone-15']);

  test('"Probá las demos" abre las demos, "Armá tu sistema" el configurador y cada local su demo', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const hero = page.locator('#hero');
    await hero.getByRole('link', { name: 'Probá las demos' }).click();
    await expect(page).toHaveURL(/\/demos$/);
    await page.goto('/', { waitUntil: 'networkidle' });
    await hero.getByRole('link', { name: 'Armá tu sistema' }).click();
    await expect(page).toHaveURL(/\/armar$/);
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(hero.getByRole('link', { name: /: probá la demo/ })).toHaveCount(4);
    await expect(hero.getByRole('link', { name: /Peluquería/ })).toHaveAttribute(
      'href',
      '/demos/turnos',
    );
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

  test('primera pantalla de la home (la calle de noche)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('#hero .hc-luces')).toBeVisible();
    await expect(page).toHaveScreenshot('home-hero.png', {
      // La pantalla de tu negocio pasa sitios: se tapa para que la captura sea estable.
      mask: [page.locator('#hero .c-sitio')],
      maxDiffPixelRatio: 0.03,
    });
  });
});
