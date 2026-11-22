/**
 * Capturas de la home en los 7 anchos de referencia, con WebGL de verdad (SwiftShader) o con el poster.
 * Verifica que el canvas del símbolo dibujó (window.__simbolo === 'listo') antes de capturar.
 *
 * Uso: node scripts/capturas-home.mjs [--url http://localhost:3300] [--salida dir] [--modo 3d|poster]
 *      [--anchos 360x640,390x844] [--scroll 0,0.5,1] [--texto 200] [--ruta /]
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const URL_BASE = arg('url', 'http://localhost:3300');
const SALIDA = arg('salida', 'capturas-home');
const MODO = arg('modo', '3d');
const RUTA = arg('ruta', '/');
const TEXTO = Number(arg('texto', '100'));
const ANCHOS = arg('anchos', '360x640,390x844,430x932,768x1024,1024x768,1440x900,1920x1080')
  .split(',')
  .map((s) => s.split('x').map(Number));
const SCROLL = arg('scroll', '0').split(',').map(Number);
const PAGINA_COMPLETA = process.argv.includes('--completa');
const MENU = process.argv.includes('--menu');
/** Recorre cada sección de <main> como una persona (entra en pantalla, se anima) y captura cada una. */
const SECCIONES = process.argv.includes('--secciones');

mkdirSync(SALIDA, { recursive: true });
const navegador = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

for (const [ancho, alto] of ANCHOS) {
  const movil = ancho < 768;
  const ctx = await navegador.newContext({
    viewport: { width: ancho, height: alto },
    deviceScaleFactor: movil ? 2 : 1,
    hasTouch: movil,
    isMobile: movil,
  });
  const pagina = await ctx.newPage();
  const q = (RUTA.includes('?') ? '&' : '?') + (MODO === '3d' ? 'simbolo=3d' : 'simbolo=poster');
  await pagina.goto(`${URL_BASE}${RUTA}${q}`, { waitUntil: 'load', timeout: 120_000 });
  if (TEXTO !== 100) {
    await pagina.addStyleTag({ content: `html{font-size:${TEXTO}% !important}` });
  }
  if (MODO === '3d' && RUTA === '/') {
    await pagina.waitForFunction(() => window.__simbolo === 'listo', null, { timeout: 90_000 });
  }
  if (SECCIONES) {
    const total = await pagina.locator('main > section').count();
    for (let i = 0; i < total; i++) {
      const sec = pagina.locator('main > section').nth(i);
      await sec.evaluate((el) => el.scrollIntoView({ block: 'start' }));
      await pagina.waitForTimeout(1400);
      const nombre = `${ancho}x${alto}-seccion-${i}.png`;
      await pagina.screenshot({ path: join(SALIDA, nombre) });
      process.stdout.write(`${nombre}
`);
    }
    await ctx.close();
    continue;
  }
  for (const s of SCROLL) {
    // s = fracción del tramo fijo del hero (0 a 1).
    await pagina.evaluate((f) => {
      const h = document.getElementById('hero');
      const tramo = h ? h.offsetHeight - window.innerHeight : 0;
      window.scrollTo(0, (h ? h.offsetTop : 0) + Math.max(0, tramo) * f);
    }, s);
    await pagina.waitForTimeout(900);
    if (MENU) {
      await pagina.getByRole('button', { name: 'Abrir el menú' }).click();
      await pagina.waitForTimeout(900);
    }
    const nombre = `${ancho}x${alto}-${MODO}${MENU ? '-menu' : ''}${TEXTO !== 100 ? `-texto${TEXTO}` : ''}-s${s}.png`;
    await pagina.screenshot({ path: join(SALIDA, nombre), fullPage: PAGINA_COMPLETA });
    process.stdout.write(`${nombre}
`);
  }
  await ctx.close();
}
await navegador.close();
