// Recorre la home con movimiento (como una persona): captura la primera pantalla, la franja de frases ya
// llena, la vitrina de proyectos, el hover de una fila de rubro y el avión del botón Enviar.
// Uso: node scripts/probar-home.mjs <base> <carpeta>
import { chromium } from '@playwright/test';

const [base, salida] = process.argv.slice(2);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
await pagina.route('**/api/leads', async (r) => {
  await new Promise((ok) => setTimeout(ok, 4000));
  await r.fulfill({ status: 201, body: '{"ok":true}' });
});
await pagina.goto(`${base}/`, { waitUntil: 'networkidle' });
await pagina.waitForTimeout(1500);
await pagina.screenshot({ path: `${salida}/1-primera.png` });

const fila = pagina.locator('.e-fila').first();
await fila.hover();
await pagina.waitForTimeout(700);
const cf = await fila.boundingBox();
await pagina.screenshot({
  path: `${salida}/2-fila.png`,
  clip: { x: cf.x - 20, y: cf.y - 10, width: cf.width + 40, height: cf.height * 2 + 20 },
});

await pagina.mouse.move(0, 0);
const manifiesto = pagina.locator('.e-manifiesto-palabra').first();
await manifiesto.scrollIntoViewIfNeeded();
await pagina.waitForTimeout(500);
await pagina.screenshot({ path: `${salida}/3-manifiesto-a.png` });
await pagina.waitForTimeout(1800);
await pagina.screenshot({ path: `${salida}/3-manifiesto-b.png` });

const vitrina = pagina.locator('.e-escenario').first();
await vitrina.scrollIntoViewIfNeeded();
await pagina.evaluate(() => window.scrollBy(0, 120));
await pagina.waitForTimeout(1200);
await pagina.screenshot({ path: `${salida}/4-vitrina.png` });
await pagina.locator('.e-nombre-vitrina').nth(2).hover();
await pagina.waitForTimeout(1200);
await pagina.screenshot({ path: `${salida}/4-vitrina-b.png` });

const boton = pagina.locator('form button[type="submit"]').last();
await boton.scrollIntoViewIfNeeded();
const cb = await boton.boundingBox();
const clip = { x: cb.x - 30, y: cb.y - 40, width: cb.width + 80, height: cb.height + 60 };
await boton.hover();
await pagina.waitForTimeout(300);
await pagina.screenshot({ path: `${salida}/5-avion-a.png`, clip });
await pagina.waitForTimeout(800);
await pagina.screenshot({ path: `${salida}/5-avion-b.png`, clip });
await pagina.locator('form input[type="tel"]').last().fill('3406419495');
await boton.click();
await pagina.waitForTimeout(450);
await pagina.screenshot({ path: `${salida}/5-avion-c.png`, clip });
await navegador.close();
