// Recorre la página como una persona (scroll de a poco) y avisa si algún titular animado quedó oculto.
// Uso: node scripts/probar-titulos.mjs <base> <ruta> [ancho] [alto]
import { chromium } from '@playwright/test';

const [base, ruta = '/', ancho = '1366', alto = '683'] = process.argv.slice(2);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({
  viewport: { width: Number(ancho), height: Number(alto) },
});
await pagina.goto(base + ruta, { waitUntil: 'networkidle' });
const total = await pagina.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total; y += 120) {
  await pagina.mouse.wheel(0, 120);
  await pagina.waitForTimeout(40);
}
await pagina.waitForTimeout(1500);
const ocultos = await pagina.evaluate(() =>
  [...document.querySelectorAll('[data-words],[data-reveal]')]
    .filter((el) => !el.classList.contains('in'))
    .map((el) => `${el.tagName} ${(el.textContent || '').trim().slice(0, 50)}`),
);
// eslint-disable-next-line no-console -- herramienta de línea de comandos: el reporte es la salida
console.log(ocultos.length ? `SIN .in:\n${ocultos.join('\n')}` : 'todo revelado');
await navegador.close();
