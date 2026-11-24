import { expect, test } from '@playwright/test';
import { PROYECTOS_UI } from '../src/content/home';
import { CASOS, datosCasos } from '../src/content/proyectos';

test('la barra de datos sale del manifiesto y los filtros cambian los casos', async ({ page }) => {
  await page.goto('/proyectos', { waitUntil: 'networkidle' });
  const d = datosCasos();
  await expect(page.getByText(`${d.casos} casos, ${d.enProduccion} en producción`)).toBeVisible();

  await page.getByRole('button', { name: PROYECTOS_UI.filtros.tipos.web, exact: true }).click();
  const web = CASOS.filter((c) => c.tipo === 'web');
  const otro = CASOS.find((c) => c.tipo !== 'web')!;
  await expect(page.getByText(web[0]!.cliente).filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByText(otro.cliente, { exact: true }).filter({ visible: true })).toHaveCount(
    0,
  );
});

test('el índice es navegable con flechas y el panel muestra el caso elegido', async ({
  page,
}, info) => {
  test.skip(
    !['desktop', 'desktop-1440', 'desktop-1920'].includes(info.project.name),
    'pestañas: escritorio',
  );
  await page.goto('/proyectos', { waitUntil: 'networkidle' });
  const tabs = page.getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText(CASOS[1]!.desafio);
});

test('cada caso tiene su página, con el configurador preseleccionado y la navegación', async ({
  page,
}) => {
  const caso = CASOS[0]!;
  await page.goto(`/proyectos/${caso.id}`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(caso.cliente);
  await expect(page.getByText(caso.desafio)).toBeVisible();
  const armar = page.getByRole('main').getByRole('link', { name: 'Armá tu sistema' }).last();
  await expect(armar).toHaveAttribute(
    'href',
    `/armar?tipo=${caso.tipo}&rubro=${caso.rubroConfigurador}`,
  );
  await expect(
    page.getByRole('link', { name: new RegExp(PROYECTOS_UI.caso.siguiente) }),
  ).toBeVisible();
});

test('un caso en construcción no tiene página pública', async ({ request }) => {
  const res = await request.get('/proyectos/abelardo');
  expect(res.status()).toBe(404);
});
