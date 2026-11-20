// Capturas de páginas en varios anchos para la verificación visual (no corre en CI).
// Uso: node scripts/capturas.mjs <base> <carpeta> <ruta[,ruta]> <anchos> [full]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [base, salida, rutas, anchos, full] = process.argv.slice(2);
mkdirSync(salida, { recursive: true });
const navegador = await chromium.launch();
for (const ancho of anchos.split(',').map(Number)) {
  const alto =
    ancho < 500 ? 844 : ancho < 900 ? 1024 : ancho < 1300 ? 800 : ancho < 1600 ? 900 : 1080;
  const ctx = await navegador.newContext({
    viewport: { width: ancho, height: alto },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    isMobile: ancho < 900,
    hasTouch: ancho < 900,
  });
  const pagina = await ctx.newPage();
  for (const ruta of rutas.split(',')) {
    await pagina.goto(base + ruta, { waitUntil: 'networkidle' });
    // content-visibility: auto no pinta lo que está lejos: para la captura completa, todo visible.
    await pagina.addStyleTag({ content: '*{content-visibility:visible!important}' });
    await pagina.waitForTimeout(300);
    const desborde = await pagina.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    const altoTotal = await pagina.evaluate(() => document.documentElement.scrollHeight);
    const nombre = `${ruta.replace(/[/?=]/g, '_') || '_'}-${ancho}.png`;
    await pagina.screenshot({ path: `${salida}/${nombre}`, fullPage: full === 'full' });
    // eslint-disable-next-line no-console -- herramienta de línea de comandos: el reporte es la salida
    console.log(
      `${ruta} @${ancho}: alto ${altoTotal}px (${(altoTotal / alto).toFixed(1)} pantallas), desborde ${desborde}px`,
    );
  }
  await ctx.close();
}
await navegador.close();
