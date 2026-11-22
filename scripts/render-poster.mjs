/**
 * Renderiza los posters del símbolo `<w>` (los tres estados) con la MISMA escena de three.js que usa el
 * hero, en Chromium headless con SwiftShader (WebGL por software), y los guarda en public/home3d/ como
 * WebP con transparencia (next/image los sirve en AVIF/WebP al tamaño justo).
 *
 * Uso: con el sitio corriendo (`LEAD_REPOSITORY=memory pnpm dev -p 3300`), `node scripts/render-poster.mjs`
 * [--url http://localhost:3300] [--salida public/home3d].
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const URL_BASE = arg('url', 'http://localhost:3300');
const SALIDA = arg('salida', 'public/home3d');

mkdirSync(SALIDA, { recursive: true });
const navegador = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const pagina = await navegador.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });

for (const estado of [0, 1, 2]) {
  await pagina.goto(`${URL_BASE}/?captura=${estado}`, { waitUntil: 'load', timeout: 120_000 });
  await pagina.waitForFunction(() => window.__simbolo === 'listo', null, { timeout: 60_000 });
  const datos = await pagina.evaluate(() => {
    const c = document.querySelector('.h3d-canvas');
    return c instanceof HTMLCanvasElement ? c.toDataURL('image/png') : null;
  });
  if (!datos) throw new Error('No se encontró el canvas del símbolo');
  const png = Buffer.from(datos.split(',')[1], 'base64');
  const meta = await sharp(png).metadata();
  const destino = join(SALIDA, `simbolo-${estado}.webp`);
  await sharp(png).webp({ quality: 88, alphaQuality: 90, effort: 6 }).toFile(destino);
  // Copia PNG para revisar a ojo (no se publica).
  writeFileSync(join(process.env.TEMP ?? '.', `simbolo-${estado}.png`), png);
  process.stdout.write(`${destino} (${meta.width}×${meta.height})
`);
}
await navegador.close();
