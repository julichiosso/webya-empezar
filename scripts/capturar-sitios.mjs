// Captura la portada de escritorio (1600 × 1000) de los sitios publicados del manifiesto, para la
// composición escritorio + celular de los casos. Son sitios hechos por Webya y públicos. Se reemplazan
// por las capturas que pase Julián (IMAGENES.md). Uso: node scripts/capturar-sitios.mjs
import { chromium } from '@playwright/test';

const SITIOS = [
  { id: 'micios', url: 'https://www.miciospizzas.com.ar' },
  { id: 'petrucci', url: 'https://www.joyeriapetrucci.com.ar' },
  { id: 'lorena', url: 'https://www.fonosanjorge.com.ar' },
];

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
for (const s of SITIOS) {
  await pagina.goto(s.url, { waitUntil: 'networkidle', timeout: 60_000 });
  await pagina.waitForTimeout(1500);
  await pagina.screenshot({ path: `public/clientes/${s.id}-escritorio.jpg`, type: 'jpeg', quality: 82 });
  // eslint-disable-next-line no-console -- herramienta de línea de comandos: el reporte es la salida
  console.log(`${s.id}: listo`);
}
await navegador.close();
