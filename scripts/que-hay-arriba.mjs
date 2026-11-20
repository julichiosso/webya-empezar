// Lista los elementos que ocupan la franja de arriba de la página (para encontrar espacios vacíos).
// Uso: node scripts/que-hay-arriba.mjs <url>
import { chromium } from '@playwright/test';

const [url] = process.argv.slice(2);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1366, height: 680 } });
await pagina.goto(url, { waitUntil: 'networkidle' });
const datos = await pagina.evaluate(() => {
  const header = document.querySelector('header');
  const r = header?.getBoundingClientRect();
  const antes = [...document.body.children].map((el) => {
    const b = el.getBoundingClientRect();
    return `${el.tagName}.${String(el.className).slice(0, 40)} top=${Math.round(b.top)} h=${Math.round(b.height)}`;
  });
  return { headerTop: r?.top, scrollY: window.scrollY, hijos: antes.slice(0, 8) };
});
// eslint-disable-next-line no-console -- herramienta de línea de comandos: el reporte es la salida
console.log(JSON.stringify(datos, null, 1));
await navegador.close();
