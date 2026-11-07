import { expect, test } from '@playwright/test';
import { CREAR, VER } from '../src/content/crear';

const esLg = (w: number | undefined) => (w ?? 0) >= 1024;

test('armo el sitio, lo veo en vivo, me llevo el link y se abre igual en otro lado', async ({
  page,
  context,
  browser,
}) => {
  await page.goto('/crear?rubro=peluqueria_estetica');
  await page.getByLabel(CREAR.campos.nombre.etiqueta).fill('Barbería Sur');
  await page.getByLabel(CREAR.items.nombre(1)).fill('Corte clásico');
  await page.getByLabel(CREAR.items.precio(1)).fill('$ 12.000');
  if (!esLg(page.viewportSize()?.width)) {
    await page.getByRole('button', { name: CREAR.vistas.ver }).click();
  }
  const sitio = page.getByTestId('sitio-negocio');
  await expect(sitio).toContainText('Barbería Sur');
  await expect(sitio).toContainText('Corte clásico');

  const abrir = page.getByRole('link', { name: CREAR.compartir.abrir });
  const ruta = await abrir.getAttribute('href');
  expect(ruta).toMatch(/^\/ver#[A-Za-z0-9_-]+$/);

  // Otra persona, sin nada guardado: el link alcanza.
  const otra = await browser.newContext({ baseURL: context.pages()[0]?.url() });
  const p2 = await otra.newPage();
  await p2.goto(new URL(ruta!, page.url()).href);
  await expect(p2.getByRole('heading', { level: 1 })).toHaveText('Barbería Sur');
  await expect(p2.getByText('Corte clásico')).toBeVisible();
  await expect(p2.getByRole('note')).toContainText(VER.banner.texto);
  await otra.close();
});

test('publicar pide nombre y WhatsApp, y recién ahí guarda el lead', async ({ page }) => {
  await page.goto('/crear?rubro=comercio');
  const mostrarVer = async () => {
    if (!esLg(page.viewportSize()?.width)) {
      await page.getByRole('button', { name: CREAR.vistas.ver }).click();
    }
  };
  const mostrarEditar = async () => {
    if (!esLg(page.viewportSize()?.width)) {
      await page.getByRole('button', { name: CREAR.vistas.editar }).click();
    }
  };
  await mostrarVer();
  await page.getByRole('button', { name: CREAR.publicar.cta }).click();
  await expect(page.getByText(CREAR.publicar.faltaNombre)).toBeVisible();

  await mostrarEditar();
  await page.getByLabel(CREAR.campos.nombre.etiqueta).fill(`Tienda ${Date.now()}`);
  await mostrarVer();
  await page.getByRole('button', { name: CREAR.publicar.cta }).click();
  await expect(page.getByText(CREAR.publicar.faltaWhatsapp)).toBeVisible();

  await mostrarEditar();
  const n = String(Date.now()).slice(-8);
  await page.getByLabel(CREAR.campos.whatsapp.etiqueta).fill(`11${n}`);
  await mostrarVer();
  const pedido = page.waitForResponse((r) => r.url().endsWith('/api/leads'));
  await page.getByRole('button', { name: CREAR.publicar.cta }).click();
  expect((await pedido).status()).toBe(201);
  await expect(page.getByText(CREAR.publicar.listo)).toBeVisible();
});

test('un link roto no rompe nada: lo dice y ofrece armar el tuyo', async ({ page }) => {
  await page.goto('/ver#esto-no-es-un-borrador');
  await expect(page.getByRole('heading', { name: VER.vacio.titulo })).toBeVisible();
  await expect(page.getByRole('link', { name: VER.vacio.cta })).toHaveAttribute('href', '/crear');
});

test('lo que venga en un link se muestra como texto y no se indexa', async ({ page }) => {
  const dialogos: string[] = [];
  page.on('dialog', (d) => {
    dialogos.push(d.message());
    void d.dismiss();
  });
  const crudo = JSON.stringify({ rubro: 'comercio', nombre: '<img src=x onerror=alert(1)>Hola' });
  const b64 = Buffer.from(crudo).toString('base64url');
  await page.goto(`/ver#${b64}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hola');
  expect(dialogos).toEqual([]);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
