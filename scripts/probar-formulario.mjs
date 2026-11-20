// Captura el contacto rápido: un campo con foco y el botón Enviar en reposo, con el mouse y enviando.
// Uso: node scripts/probar-formulario.mjs <base> <carpeta>
import { chromium } from '@playwright/test';

const [base, salida] = process.argv.slice(2);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
// El envío se demora a propósito para ver el avión volando.
await pagina.route('**/api/leads', async (r) => {
  await new Promise((ok) => setTimeout(ok, 3000));
  await r.fulfill({ status: 201, body: '{"ok":true}' });
});
await pagina.goto(`${base}/`, { waitUntil: 'networkidle' });
const form = pagina.locator('form').last();
await form.scrollIntoViewIfNeeded();
await form.locator('input[type="text"]').first().focus();
await pagina.waitForTimeout(300);
await form.screenshot({ path: `${salida}/form-foco.png` });
const boton = form.locator('button[type="submit"]');
const caja = await boton.boundingBox();
const clip = { x: caja.x - 20, y: caja.y - 14, width: caja.width + 40, height: caja.height + 28 };
await pagina.mouse.move(0, 0);
await pagina.waitForTimeout(300);
await pagina.screenshot({ path: `${salida}/enviar-0.png`, clip });
await boton.hover();
await pagina.waitForTimeout(800);
await pagina.screenshot({ path: `${salida}/enviar-1.png`, clip });
await form.locator('input[type="tel"]').fill('3406419495');
await boton.click();
await pagina.waitForTimeout(250);
await pagina.screenshot({ path: `${salida}/enviar-2.png`, clip });
await navegador.close();
