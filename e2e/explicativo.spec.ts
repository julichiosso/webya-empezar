import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { abrirDemo } from './demo-helpers';

// Video explicativo ("Mirá cómo funciona"): motion graphics + voz del dispositivo + subtítulos.
const boton = (page: Page) => page.getByRole('button', { name: /mirá cómo funciona/i });
const video = (page: Page) => page.getByRole('dialog', { name: 'Cómo funciona WebYa' });

async function hidratado(page: Page) {
  await page.waitForFunction(() => {
    const b = [...document.querySelectorAll('button')].find((x) =>
      x.textContent?.includes('Mirá cómo funciona'),
    );
    return !!b && Object.keys(b).some((k) => k.startsWith('__react'));
  });
}

test('desde /empezar: se abre, muestra subtítulos y capítulos, y cierra con Escape devolviendo el foco', async ({
  page,
}) => {
  await page.goto('/empezar');
  await hidratado(page);
  await boton(page).click();
  await expect(video(page)).toBeVisible();
  await expect(video(page).getByTestId('subtitulo')).toContainText('¿Te pasa?');
  await expect(video(page).getByRole('button', { name: /^Capítulo \d/ })).toHaveCount(9);

  await video(page).getByRole('button', { name: 'Capítulo siguiente' }).click();
  await expect(video(page).getByTestId('subtitulo')).toContainText('pieza por pieza');

  await page.keyboard.press('Escape');
  await expect(video(page)).toBeHidden();
  await expect(boton(page)).toBeFocused();
});

test('la última escena lleva al wizard y cierra el video', async ({ page }) => {
  await page.goto('/empezar');
  await hidratado(page);
  await boton(page).click();
  await video(page)
    .getByRole('button', { name: /^Capítulo 9:/ })
    .click();
  await video(page).getByRole('link', { name: 'Quiero el mío' }).click();
  await expect(video(page)).toBeHidden();
  await expect(page).toHaveURL(/#wizard$/);
});

test('desde la demo también se abre', async ({ page }) => {
  await abrirDemo(page);
  await boton(page).click();
  await expect(video(page)).toBeVisible();
  await video(page)
    .getByRole('button', { name: /^Capítulo 9:/ })
    .click();
  // Ya estás en la demo: "Probar la demo" cierra el video.
  await video(page).getByRole('button', { name: 'Probar la demo' }).click();
  await expect(video(page)).toBeHidden();
});

test('sin scroll horizontal y controles de 48 px con el video abierto', async ({ page }) => {
  await page.goto('/empezar');
  await hidratado(page);
  await boton(page).click();
  await expect(video(page)).toBeVisible();
  const sobra = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(sobra).toBeLessThanOrEqual(0);
  const chicos = await video(page)
    .locator('button, a[href]')
    .evaluateAll((els) =>
      els
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .map((el) => ({
          t: el.getAttribute('aria-label') ?? el.textContent,
          h: el.getBoundingClientRect().height,
        }))
        .filter((x) => x.h < 47.5),
    );
  expect(chicos).toEqual([]);
});

test.describe('accesibilidad y movimiento reducido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('el video no tiene violaciones WCAG AA y las escenas aparecen quietas', async ({ page }) => {
    await page.goto('/empezar');
    await hidratado(page);
    await boton(page).click();
    await expect(video(page)).toBeVisible();
    await expect(video(page).locator('.mg').first()).toHaveCSS('animation-name', 'none');
    const r = await new AxeBuilder({ page })
      .include('dialog')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
    ).toEqual([]);
  });
});
