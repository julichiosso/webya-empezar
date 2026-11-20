// Captura el logo calcado y el suavizado, uno arriba del otro y en grande, para compararlos.
// Uso: node scripts/comparar-logo.mjs <html> <salida.png> [x] [y] [ancho] [alto]
import { chromium } from '@playwright/test';

const [html, salida, x = '0', y = '0', w = '1400', h = '1120'] = process.argv.slice(2);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 2400, height: 1120 } });
await pagina.goto(`file:///${html.replace(/\\/g, '/')}`);
await pagina.waitForTimeout(300);
await pagina.screenshot({
  path: salida,
  clip: { x: Number(x), y: Number(y), width: Number(w), height: Number(h) },
});
await navegador.close();
