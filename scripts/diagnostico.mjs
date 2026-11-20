// Abre una página y reporta errores de consola, clases de <html>, alto y si la pantalla de carga quedó a
// la vista. Uso: node scripts/diagnostico.mjs <url>
import { chromium } from '@playwright/test';

const [url] = process.argv.slice(2);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });
const mensajes = [];
pagina.on('console', (m) => mensajes.push(`${m.type()}: ${m.text()}`));
pagina.on('pageerror', (e) => mensajes.push(`pageerror: ${e.message}`));
await pagina.goto(url, { waitUntil: 'networkidle' });
const info = await pagina.evaluate(() => ({
  html: document.documentElement.className,
  alto: document.documentElement.scrollHeight,
  texto: document.body.innerText.length,
  carga: getComputedStyle(document.querySelector('.carga-inicial') ?? document.body).display,
  main: !!document.querySelector('main'),
}));
// eslint-disable-next-line no-console -- herramienta de línea de comandos: el reporte es la salida
console.log(JSON.stringify(info), '\n', mensajes.join('\n'));
await navegador.close();
