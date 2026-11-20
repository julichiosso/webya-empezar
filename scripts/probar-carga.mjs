// Fuerza la pantalla de carga en una página ya cargada y la captura a mitad del trazo y al final.
// Uso: node scripts/probar-carga.mjs <base> <carpeta>
import { chromium } from '@playwright/test';

const [base, salida] = process.argv.slice(2);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 390, height: 844 } });
await pagina.goto(base + '/', { waitUntil: 'networkidle' });
await pagina.evaluate(() => {
  document.documentElement.classList.remove('listo');
  document.querySelectorAll('.carga-inicial, .carga-inicial *').forEach((el) => {
    el.getAnimations().forEach((a) => {
      a.cancel();
      a.play();
    });
  });
});
await pagina.waitForTimeout(150);
await pagina.screenshot({ path: `${salida}/carga-0.png` });
await pagina.waitForTimeout(800);
await pagina.screenshot({ path: `${salida}/carga-1.png` });
await pagina.waitForTimeout(1600);
await pagina.screenshot({ path: `${salida}/carga-2.png` });
await navegador.close();
