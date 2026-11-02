import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { abrirDemo } from './demo-helpers';

// Video explicativo: motion graphics + voz del dispositivo + subtítulos.
// - En /empezar: la sección "Mirá cómo se arma tu negocio" (poster + play) con la animación de las
//   cuatro pantallas del flujo, embebida en el slot (mientras no haya MP4 configurado).
// - En la demo: el botón "Mirá cómo funciona" abre el video de Gastronomía en un diálogo.
const play = (page: Page) => page.getByRole('button', { name: /mirá cómo funciona/i });
const seccion = (page: Page) => page.locator('section[aria-labelledby="video-title"]');
const presentacion = (page: Page) => page.getByRole('group', { name: 'Video de presentación' });
const video = (page: Page) => page.getByRole('dialog', { name: 'Cómo funciona WebYa' });

async function hidratado(page: Page) {
  await page.waitForFunction(() => {
    const b = [...document.querySelectorAll('button')].find((x) =>
      x.textContent?.includes('Mirá cómo funciona'),
    );
    return !!b && Object.keys(b).some((k) => k.startsWith('__react'));
  });
}

async function controlesDe48(zona: Locator) {
  const chicos = await zona.locator('button, a[href]').evaluateAll((els) =>
    els
      .filter((el) => (el as HTMLElement).offsetParent !== null)
      .map((el) => ({
        t: el.getAttribute('aria-label') ?? el.textContent,
        h: el.getBoundingClientRect().height,
      }))
      .filter((x) => x.h < 47.5),
  );
  expect(chicos).toEqual([]);
}

async function sinScrollHorizontal(page: Page) {
  const sobra = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(sobra).toBeLessThanOrEqual(0);
}

test.describe('/empezar: video de presentación', () => {
  test('el poster está en el HTML y el reproductor no baja hasta tocar play', async ({ page }) => {
    const scripts: string[] = [];
    page.on('response', (r) => {
      if (r.request().resourceType() === 'script') scripts.push(r.url());
    });
    await page.goto('/empezar', { waitUntil: 'networkidle' });
    await expect(seccion(page).locator('svg[data-poster]')).toBeAttached();
    await expect(seccion(page).getByRole('list', { name: 'Qué vas a ver' })).toBeAttached();
    await expect(page.locator('video')).toHaveCount(0);
    // Ya no hay dos videos: el botón viejo de debajo del flujo se fue.
    await expect(play(page)).toHaveCount(1);

    await hidratado(page);
    const antes = scripts.length;
    await play(page).click();
    await expect(presentacion(page)).toBeVisible();
    expect(scripts.length).toBeGreaterThan(antes);
  });

  test('se reproduce en el slot, con subtítulos y capítulos, y el foco queda en pausa', async ({
    page,
  }) => {
    await page.goto('/empezar');
    await hidratado(page);
    const alto = await seccion(page).locator('[data-slot-video]').evaluate((el) => el.clientHeight);
    await play(page).click();
    await expect(presentacion(page)).toBeVisible();
    // Mismo alto que el poster: sin saltos.
    expect(
      await seccion(page)
        .locator('[data-slot-video]')
        .evaluate((el) => el.clientHeight),
    ).toBe(alto);
    await expect(presentacion(page).getByTestId('subtitulo')).toContainText('Primero elegís');
    await expect(presentacion(page).getByRole('button', { name: /^Capítulo \d/ })).toHaveCount(4);
    await expect(presentacion(page).getByRole('button', { name: 'Pausar' })).toBeFocused();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await presentacion(page).getByRole('button', { name: 'Capítulo siguiente' }).click();
    await expect(presentacion(page).getByTestId('subtitulo')).toContainText('cómo se llama');
  });

  test('la última escena lleva a la pantalla 1 del flujo', async ({ page }) => {
    await page.goto('/empezar');
    await hidratado(page);
    await play(page).click();
    await presentacion(page)
      .getByRole('button', { name: /^Capítulo 4:/ })
      .click();
    await expect(presentacion(page).getByTestId('subtitulo')).not.toContainText(/horas|hs\b/);
    await presentacion(page).getByRole('link', { name: 'Elegí tu rubro' }).click();
    await expect(page).toHaveURL(/#wizard$/);
  });

  test('se pausa sola si sale de la pantalla', async ({ page }) => {
    await page.goto('/empezar');
    await hidratado(page);
    await play(page).click();
    await expect(presentacion(page).getByRole('button', { name: 'Pausar' })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(presentacion(page).getByRole('button', { name: 'Reproducir' })).toBeAttached();
  });

  test('sin scroll horizontal y controles de 48 px, en el poster y reproduciendo', async ({
    page,
  }) => {
    await page.goto('/empezar');
    await hidratado(page);
    await seccion(page).scrollIntoViewIfNeeded();
    await controlesDe48(seccion(page));
    await play(page).click();
    await expect(presentacion(page)).toBeVisible();
    await sinScrollHorizontal(page);
    await controlesDe48(presentacion(page));
  });
});

test.describe('demo: video de Gastronomía en un diálogo', () => {
  test('se abre, muestra subtítulos y capítulos, y cierra con Escape devolviendo el foco', async ({
    page,
  }) => {
    await abrirDemo(page);
    await play(page).click();
    await expect(video(page)).toBeVisible();
    await expect(video(page).getByTestId('subtitulo')).toContainText('¿Te pasa?');
    await expect(video(page).getByRole('button', { name: /^Capítulo \d/ })).toHaveCount(9);

    await video(page).getByRole('button', { name: 'Capítulo siguiente' }).click();
    await expect(video(page).getByTestId('subtitulo')).toContainText('pieza por pieza');

    await page.keyboard.press('Escape');
    await expect(video(page)).toBeHidden();
    await expect(play(page)).toBeFocused();
  });

  test('en la última escena, "Probar la demo" cierra el video (ya estás en la demo)', async ({
    page,
  }) => {
    await abrirDemo(page);
    await play(page).click();
    await expect(video(page)).toBeVisible();
    await video(page)
      .getByRole('button', { name: /^Capítulo 9:/ })
      .click();
    await expect(video(page).getByTestId('subtitulo')).not.toContainText(/veinticuatro|horas/);
    await expect(video(page).getByRole('link', { name: 'Quiero el mío' })).toHaveAttribute(
      'href',
      '/empezar#wizard',
    );
    await video(page).getByRole('button', { name: 'Probar la demo' }).click();
    await expect(video(page)).toBeHidden();
  });

  test('sin scroll horizontal y controles de 48 px con el video abierto', async ({ page }) => {
    await abrirDemo(page);
    await play(page).click();
    await expect(video(page)).toBeVisible();
    await sinScrollHorizontal(page);
    await controlesDe48(video(page));
  });
});

test.describe('accesibilidad y movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });

  const auditar = async (page: Page, zona: string) => {
    const r = await new AxeBuilder({ page })
      .include(zona)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
    ).toEqual([]);
  };

  test('/empezar: poster y presentación sin violaciones WCAG AA, con las escenas quietas', async ({
    page,
  }) => {
    await page.goto('/empezar');
    await hidratado(page);
    await seccion(page).scrollIntoViewIfNeeded();
    await auditar(page, 'section[aria-labelledby="video-title"]');
    await play(page).click();
    await expect(presentacion(page)).toBeVisible();
    await expect(presentacion(page).locator('.mg').first()).toHaveCSS('animation-name', 'none');
    await expect(presentacion(page).locator('.mg-progreso')).toHaveCSS('animation-name', 'none');
    await auditar(page, 'section[aria-labelledby="video-title"]');
  });

  test('demo: el video no tiene violaciones WCAG AA y las escenas aparecen quietas', async ({
    page,
  }) => {
    await abrirDemo(page);
    await play(page).click();
    await expect(video(page)).toBeVisible();
    await expect(video(page).locator('.mg').first()).toHaveCSS('animation-name', 'none');
    await auditar(page, 'dialog');
  });
});

test('el poster queda quieto también con movimiento normal', async ({ page }) => {
  await page.goto('/empezar');
  await expect(seccion(page).locator('svg[data-poster] .mg').first()).toHaveCSS(
    'animation-name',
    'none',
  );
});
