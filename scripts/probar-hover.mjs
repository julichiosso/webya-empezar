// Captura un botón en reposo y con el mouse encima (a mitad del gesto y al final), para revisarlo.
// Uso: node scripts/probar-hover.mjs <base> <carpeta> [ruta] [selector]
import { chromium } from '@playwright/test';

const [base, salida, ruta = '/', selector = 'main .e-btn-primario'] = process.argv.slice(2);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
await pagina.goto(base + ruta, { waitUntil: 'networkidle' });
const boton = pagina.locator(selector).first();
const caja = await boton.boundingBox();
const clip = { x: caja.x - 30, y: caja.y - 20, width: caja.width + 60, height: caja.height + 40 };
await pagina.screenshot({ path: `${salida}/hover-0.png`, clip });
await boton.hover();
await pagina.waitForTimeout(250);
await pagina.screenshot({ path: `${salida}/hover-1.png`, clip });
await pagina.waitForTimeout(700);
await pagina.screenshot({ path: `${salida}/hover-2.png`, clip });
await navegador.close();
