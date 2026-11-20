import { expect, test } from '@playwright/test';
import { ZONA } from '../src/content/paginas';
import { LOCALIDADES, datosZona } from '../src/content/zona';

test('/zona: las dos ciudades en el título y los datos desde el manifiesto', async ({ page }) => {
  await page.goto('/zona', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(ZONA.titulo.join(' '));
  const d = datosZona();
  await expect(page.getByText(ZONA.datos(d.zonas, d.localidades))).toBeVisible();
  await expect(page.getByRole('img', { name: /Mapa de la zona/ })).toBeVisible();
});

test('/zona: elegir una localidad de la lista la marca y ofrece escribirnos desde ahí', async ({
  page,
}) => {
  await page.goto('/zona', { waitUntil: 'networkidle' });
  const l = LOCALIDADES.find((x) => x.slug === 'sastre')!;
  await page.getByRole('button', { name: l.nombre, exact: true }).click();
  await expect(page.getByRole('button', { name: l.nombre, exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const link = page
    .getByRole('region', { name: ZONA.lista.ayuda })
    .getByRole('link', { name: new RegExp(`^${ZONA.seleccion.link}`) });
  const texto = new URL((await link.getAttribute('href'))!).searchParams.get('text');
  expect(texto).toBe(ZONA.seleccion.mensaje(l.nombre));
});
