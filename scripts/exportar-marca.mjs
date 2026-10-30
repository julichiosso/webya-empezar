#!/usr/bin/env node
/**
 * Exporta los assets de marca de WebYa a partir de las fuentes reales (sin copias a mano):
 *   - src/brand/logo/trazos.ts      el wordmark (y su "w", la variante compacta)
 *   - src/brand/logo/variantes.ts   geometría de las tejas (favicon, app icon, avatar)
 *   - src/brand/tokens/primitivos.ts los colores
 *   - src/brand/ilustracion/iconos/paths.ts los íconos (no se editan acá)
 *
 * Escribe:
 *   - src/app/icon.svg                         favicon (teja compacta de 32)
 *   - docs/marca/logo/*.svg                    wordmark monocromo (negro y blanco) y compacta
 *   - docs/marca/instagram/avatar.{svg,png}    avatar 1080×1080
 *   - docs/marca/instagram/destacada-*.{svg,png} 5 portadas de destacadas 1080×1080
 *
 * Los PNG se renderizan con Playwright (Chromium headless, ya instalado para E2E). Sin dependencias
 * nuevas. Node ≥ 22.18 (importa .ts con type stripping). Uso: `node scripts/exportar-marca.mjs`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const raiz = new URL('../', import.meta.url);
const ruta = (rel) => fileURLToPath(new URL(rel, raiz));
const importar = (rel) => import(new URL(rel, raiz).href);

const { COLOR } = await importar('src/brand/tokens/primitivos.ts');
const { LOGO_TRAZOS, LOGO_VIEWBOX } = await importar('src/brand/logo/trazos.ts');
const { svgTejaCompacta, svgWordmark, TEJA, viewBoxCompacta } = await importar(
  'src/brand/logo/variantes.ts',
);
const { ICONS } = await importar('src/brand/ilustracion/iconos/paths.ts');

const NEGRO = COLOR.negro[950];
const BLANCO = COLOR.blanco[0];
const W = LOGO_TRAZOS[0];

/** Lado de los assets de Instagram (avatar y destacadas). */
const LADO_IG = 1080;

/**
 * Avatar: Instagram lo recorta en círculo. Con la "w" al 56 % del ancho, sus esquinas quedan bien
 * adentro del círculo inscripto (no se cortan) y la letra se lee a 40 px.
 */
const OCUPACION_AVATAR = 0.56;

/** Destacadas: el ícono (grilla 24) al 44 % del lado, centrado; trazo 1,5 de la grilla, escalado. */
const OCUPACION_ICONO = 0.44;

/** Portadas de destacadas: nombre del archivo → ícono del set propio. */
const DESTACADAS = [
  { archivo: 'destacada-rubros', icono: 'tienda' },
  { archivo: 'destacada-modulos', icono: 'catalogo' },
  { archivo: 'destacada-demo', icono: 'play' },
  { archivo: 'destacada-como-trabajamos', icono: 'formularios' },
  { archivo: 'destacada-contacto', icono: 'chat' },
];

const r3 = (v) => Math.round(v * 1000) / 1000;

/** Un ícono de 24×24 centrado en un cuadro, con el trazo del set (1,5) escalado. */
function svgDestacada(paths, lado) {
  const s = (lado * OCUPACION_ICONO) / 24;
  const t = (lado - 24 * s) / 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" width="${lado}" height="${lado}">` +
    `<rect width="${lado}" height="${lado}" fill="${NEGRO}"/>` +
    `<g transform="translate(${r3(t)} ${r3(t)}) scale(${r3(s)})" fill="none" stroke="${BLANCO}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">` +
    paths.map((d) => `<path d="${d}"/>`).join('') +
    `</g></svg>`
  );
}

/** La "w" sola, recortada a su cuadro (para usar sobre cualquier fondo). */
function svgCompacta(tinta) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxCompacta(W)}" role="img" aria-label="WebYa">` +
    `<path d="${W.d}" fill="${tinta}" fill-rule="evenodd"/></svg>`
  );
}

const svgs = [
  {
    archivo: 'src/app/icon.svg',
    svg: svgTejaCompacta(W, {
      lado: 32,
      fondo: NEGRO,
      tinta: BLANCO,
      radio: 32 * TEJA.radioRelativo,
      ocupacion: TEJA.ocupacion,
    }),
  },
  { archivo: 'docs/marca/logo/webya-negro.svg', svg: svgWordmark(LOGO_TRAZOS, LOGO_VIEWBOX, NEGRO) },
  { archivo: 'docs/marca/logo/webya-blanco.svg', svg: svgWordmark(LOGO_TRAZOS, LOGO_VIEWBOX, BLANCO) },
  { archivo: 'docs/marca/logo/webya-compacta-negro.svg', svg: svgCompacta(NEGRO) },
  { archivo: 'docs/marca/logo/webya-compacta-blanco.svg', svg: svgCompacta(BLANCO) },
  {
    archivo: 'docs/marca/instagram/avatar.svg',
    lado: LADO_IG,
    svg: svgTejaCompacta(W, {
      lado: LADO_IG,
      fondo: NEGRO,
      tinta: BLANCO,
      radio: 0,
      ocupacion: OCUPACION_AVATAR,
    }),
  },
  ...DESTACADAS.map((d) => {
    const paths = ICONS[d.icono];
    if (!paths) throw new Error(`Ícono inexistente en paths.ts: ${d.icono}`);
    return {
      archivo: `docs/marca/instagram/${d.archivo}.svg`,
      lado: LADO_IG,
      svg: svgDestacada(paths, LADO_IG),
    };
  }),
];

const escrito = [];
for (const { archivo, svg } of svgs) {
  await mkdir(dirname(ruta(archivo)), { recursive: true });
  await writeFile(ruta(archivo), `${svg}\n`);
  escrito.push(archivo);
}

// PNG: cada SVG de Instagram, renderizado a su tamaño exacto (1×, sin márgenes).
const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({ deviceScaleFactor: 1 });
  for (const { archivo, svg, lado } of svgs.filter((s) => s.lado)) {
    await pagina.setViewportSize({ width: lado, height: lado });
    await pagina.setContent(
      `<!doctype html><html><body style="margin:0;background:${NEGRO}">${svg}</body></html>`,
    );
    const png = archivo.replace(/\.svg$/, '.png');
    await pagina.screenshot({ path: ruta(png), clip: { x: 0, y: 0, width: lado, height: lado } });
    escrito.push(png);
  }
} finally {
  await navegador.close();
}

// eslint-disable-next-line no-console -- script de línea de comandos: el listado es su salida.
console.log(`Assets de marca (${escrito.length}):\n${escrito.map((a) => `  ${a}`).join('\n')}`);
