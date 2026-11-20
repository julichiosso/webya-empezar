// Captura el buscador del hero (vacío, escribiendo y con sugerencias) y los avisos tipo isla, en
// escritorio y celular. Uso: node scripts/probar-buscador.mjs <base> <carpeta>
import { chromium } from '@playwright/test';

const [base, salida] = process.argv.slice(2);
const navegador = await chromium.launch();
for (const [nombre, vp, movil] of [
  ['escritorio', { width: 1440, height: 900 }, false],
  ['celular', { width: 390, height: 844 }, true],
]) {
  const pagina = await navegador.newPage({ viewport: vp, isMobile: movil, hasTouch: movil });
  await pagina.goto(`${base}/`, { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(3000);
  await pagina.screenshot({ path: `${salida}/${nombre}-1-isla.png` });
  const caja = pagina.getByRole('combobox');
  await caja.click();
  await caja.pressSequentially('turnos para mi peluqueria', { delay: 15 });
  await pagina.waitForTimeout(700);
  await pagina.screenshot({ path: `${salida}/${nombre}-2-sugerencias.png` });
  await caja.fill('');
  await caja.pressSequentially('acopio', { delay: 15 });
  await pagina.waitForTimeout(500);
  await pagina.screenshot({ path: `${salida}/${nombre}-3-campo.png` });
  await pagina.close();
}
await navegador.close();
