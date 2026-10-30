import { expect, test } from '@playwright/test';
import { HERO } from '../src/content/empezar/hero';
import { NAV } from '../src/content/empezar/nav';
import {
  leerLeads,
  negocioUnico,
  TITULO_FINAL,
  TITULO_PASO_1,
  TITULO_COMPLETAR,
  TITULO_PASO_2,
  TITULO_RUBRO,
  TITULO_WHATSAPP,
  abrirWizard,
  wizard,
} from './helpers';

// El teclado es independiente del viewport: se prueba una vez, en desktop.
test.beforeEach(({ viewport }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop' || !viewport, 'solo desktop');
});

test('el mockup del hero se opera solo con teclado y llega al wizard', async ({ page }) => {
  await page.goto('/empezar');
  const hero = page.getByRole('group', { name: /armá tu negocio/i });
  const turnos = hero.getByRole('button', { name: /turnos y reservas/i });

  // Tab: "Saltar al contenido" → logo → CTA de la nav → CTA del hero → "Mirá cómo funciona" (video)
  // → enlace a la demo → las cuatro tarjetas, en orden.
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: NAV.saltar })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: NAV.inicio })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation').getByRole('link', { name: NAV.cta })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('main').getByRole('link', { name: HERO.cta })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /mirá cómo funciona/i })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: HERO.enlaceDemo })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(turnos).toBeFocused();

  await page.keyboard.press('Space');
  await expect(turnos).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Space');
  await expect(turnos).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Enter');
  await expect(turnos).toHaveAttribute('aria-pressed', 'true');

  await page.keyboard.press('Tab');
  await expect(hero.getByRole('button', { name: /tienda y catálogo/i })).toBeFocused();
});

test('el flujo completo se puede hacer solo con teclado', async ({ page }) => {
  const negocio = negocioUnico('teclado');
  await page.goto('/empezar');
  await abrirWizard(page);
  const w = wizard(page);
  await expect(w.getByRole('heading', { name: TITULO_PASO_1 })).toBeVisible();

  // Paso 1: Espacio marca una necesidad (checkbox); Enter avanza.
  await w.getByRole('checkbox', { name: 'Cobrar' }).focus();
  await page.keyboard.press('Space');
  await expect(w.getByRole('checkbox', { name: 'Cobrar' })).toBeChecked();
  await page.keyboard.press('Enter');

  // Paso 2: el foco pasa al título; las flechas mueven la selección del grupo de radios; Enter avanza.
  await expect(w.getByRole('heading', { name: TITULO_RUBRO })).toBeFocused();
  await w.getByRole('radio', { name: /peluquería/i }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(w.getByRole('radio', { name: /gastronomía/i })).toBeChecked();
  await page.keyboard.press('ArrowLeft');
  await expect(w.getByRole('radio', { name: /peluquería/i })).toBeChecked();
  await page.keyboard.press('Enter');

  // Paso 3: el foco pasa al título; Tab llega al primer módulo (Turnos, ya sugerido).
  // Espacio lo apaga, otra vez lo prende; Enter avanza.
  await expect(w.getByRole('heading', { name: TITULO_PASO_2 })).toBeFocused();
  await page.keyboard.press('Tab');
  const primero = w.getByRole('checkbox').first();
  await expect(primero).toBeFocused();
  await expect(primero).toBeChecked();
  await page.keyboard.press('Space');
  await expect(primero).not.toBeChecked();
  await page.keyboard.press('Space');
  await expect(primero).toBeChecked();
  await page.keyboard.press('Enter');

  // Paso 4: arranca con el foco en el WhatsApp; Enter guarda el lead parcial.
  await expect(w.getByRole('heading', { name: TITULO_WHATSAPP })).toBeVisible();
  await expect(w.getByLabel('Tu WhatsApp')).toBeFocused();
  await page.keyboard.type('1123456789');
  await page.keyboard.press('Enter');

  // Paso 5: el foco en el nombre del negocio (lo único obligatorio); Enter envía.
  await expect(w.getByRole('heading', { name: TITULO_COMPLETAR })).toBeVisible();
  await expect(w.getByLabel('Nombre de tu negocio')).toBeFocused();
  await page.keyboard.type(negocio);
  await page.keyboard.press('Enter'); // Enter dentro de un campo envía el formulario

  await expect(w.getByRole('heading', { name: TITULO_FINAL })).toBeVisible();
  expect((await leerLeads()).some((l) => l.nombre_negocio === negocio)).toBe(true);
});

test('el foco es siempre visible', async ({ page }) => {
  await page.goto('/empezar');
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => {
      const s = getComputedStyle(document.activeElement as HTMLElement);
      return { estilo: s.outlineStyle, ancho: parseFloat(s.outlineWidth) };
    });
    expect(outline.estilo).not.toBe('none');
    expect(outline.ancho).toBeGreaterThanOrEqual(2);
  }
});
