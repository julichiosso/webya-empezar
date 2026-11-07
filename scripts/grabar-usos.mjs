/**
 * Graba los sitios reales de los clientes mientras alguien los usa (los videos de los celulares del
 * hero). Usar cuando un cliente cambie su sitio: `node scripts/grabar-usos.mjs [id…]`. Necesita ffmpeg.
 *
 * Seguridad: entra como un visitante cualquiera y nunca envía nada. Se corta todo pedido que no sea GET
 * (salvo la consulta de catálogo de Petrucci, que solo lee), las salidas a WhatsApp y las estadísticas, y
 * cada recorrido termina antes de confirmar. El carrito y los
 * formularios quedan en el navegador de la grabación, que se descarta.
 *
 * Micio's y Abelardo le preguntan a su servidor si están abiertos (/api/estado…). Esa consulta también se
 * corta: el sitio queda como lo ve un cliente en horario de atención, aunque se grabe de madrugada. No se
 * cambia ningún contenido.
 */
import { chromium, devices } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SALIDA = resolve('public/clientes');
const VIEWPORT = { width: 390, height: 790 };
const ALTO_ESTADO = 54;
const ANCHO_FINAL = 480;
/** Una pausa más larga que esto se acorta: es la red, no parte del recorrido. */
const PAUSA_MAXIMA_S = 2.2;
const BLOQUEADOS =
  /wa\.me|whatsapp|\/api\/estado|analytics|googletagmanager|facebook|insights|vitals|clarity|hotjar/i;

/** Es un POST, pero solo pregunta si las piezas guardadas siguen en el catálogo. */
const SOLO_LECTURA = /\/catalog\/products\/validate$/;

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** El dedo: un círculo que no intercepta toques y se mueve hasta donde se va a tocar. */
const instalarDedo = () => {
  const crear = () => {
    if (document.getElementById('__dedo') || !document.body) return;
    const d = document.createElement('div');
    d.id = '__dedo';
    d.style.cssText =
      'position:fixed;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;' +
      'background:rgba(255,255,255,.55);border:2px solid rgba(0,0,0,.35);box-shadow:0 2px 12px rgba(0,0,0,.35);' +
      'z-index:2147483647;pointer-events:none;opacity:0;' +
      'transition:transform .5s cubic-bezier(.3,.8,.3,1),opacity .2s,scale .14s;' +
      'transform:translate(var(--x,300px),var(--y,700px))';
    document.body.append(d);
  };
  window.__dedo = (x, y) => {
    crear();
    const d = document.getElementById('__dedo');
    d.style.setProperty('--x', `${x}px`);
    d.style.setProperty('--y', `${y}px`);
    d.style.opacity = '1';
  };
  window.__apreta = (si) => {
    const d = document.getElementById('__dedo');
    if (d) d.style.scale = si ? '.72' : '1';
  };
};

/** Baja hasta dejar el elemento en la zona cómoda, despacio, como con el dedo. */
async function llevarALaVista(page, loc) {
  const caja = await loc.boundingBox();
  if (!caja) return;
  const objetivo = caja.y + caja.height / 2 - VIEWPORT.height * 0.55;
  const dentro = caja.y > 70 && caja.y + caja.height < VIEWPORT.height - 90;
  if (dentro) return;
  await page.evaluate(
    (dy) =>
      new Promise((listo) => {
        const inicio = performance.now();
        const desde = window.scrollY;
        const dur = Math.min(1500, 500 + Math.abs(dy) * 0.9);
        const paso = (t) => {
          const f = Math.min((t - inicio) / dur, 1);
          const e = f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2;
          window.scrollTo(0, desde + dy * e);
          if (f < 1) requestAnimationFrame(paso);
          else listo();
        };
        requestAnimationFrame(paso);
      }),
    objetivo,
  );
  await espera(180);
}

function acciones(page) {
  const mover = async (loc) => {
    await loc.waitFor({ state: 'visible', timeout: 12000 });
    await llevarALaVista(page, loc);
    const c = await loc.boundingBox();
    if (!c) throw new Error('sin caja');
    await page.evaluate(([x, y]) => window.__dedo(x, y), [c.x + c.width / 2, c.y + c.height / 2]);
    await espera(560);
  };
  return {
    pausa: espera,
    /** Baja un poco la página, como quien mira. */
    bajar: (dy, dur = 1100) =>
      page.evaluate(
        ([d, ms]) =>
          new Promise((listo) => {
            const inicio = performance.now();
            const desde = window.scrollY;
            const paso = (t) => {
              const f = Math.min((t - inicio) / ms, 1);
              window.scrollTo(0, desde + d * (f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2));
              if (f < 1) requestAnimationFrame(paso);
              else listo();
            };
            requestAnimationFrame(paso);
          }),
        [dy, dur],
      ),
    tocar: async (loc) => {
      await mover(loc);
      await page.evaluate(() => window.__apreta(true));
      await espera(130);
      await loc.tap({ timeout: 8000 });
      await page.evaluate(() => window.__apreta?.(false)).catch(() => {});
      await espera(260);
    },
    escribir: async (loc, texto) => {
      await mover(loc);
      await page.evaluate(() => window.__apreta(true));
      await espera(120);
      await loc.tap({ timeout: 8000 });
      await page.evaluate(() => window.__apreta(false));
      await espera(250);
      await page.keyboard.type(texto, { delay: 95 });
    },
    elegir: async (loc, valor) => {
      await mover(loc);
      await page.evaluate(() => window.__apreta(true));
      await espera(120);
      await page.evaluate(() => window.__apreta(false));
      await loc.selectOption(valor);
    },
  };
}

const RECORRIDOS = {
  micios: {
    url: 'https://miciospizzas.com.ar',
    calentar: ['/producto/85', '/carrito'],
    async usar(page, a) {
      await a.pausa(900);
      await a.tocar(page.locator('a[href="/producto/85"]:visible').first());
      await a.pausa(900);
      await a.tocar(page.getByRole('button', { name: /^Clásica \$/ }));
      await a.pausa(450);
      await a.tocar(page.getByRole('button', { name: /^Agregar/ }));
      await a.pausa(800);
      await a.tocar(page.locator('a[href="/carrito"]:visible').first());
      await a.pausa(700);
      await a.escribir(page.locator('input[placeholder="Nombre"]:visible').first(), 'Ana');
      await a.escribir(page.locator('input[placeholder="Apellido"]:visible').first(), 'García');
      // "Confirmar por WhatsApp" queda listo y no se toca.
      await a.pausa(1800);
    },
  },
  abelardo: {
    url: 'https://abelardo.vercel.app',
    calentar: ['/pizzas', '/producto/1', '/carrito'],
    async usar(page, a) {
      await a.pausa(800);
      await a.tocar(
        page.locator('main a[href="/pizzas"]:visible, a[href="/pizzas"]:visible').last(),
      );
      await a.pausa(800);
      await a.tocar(page.locator('a[href="/producto/1"]:visible').first());
      await a.pausa(800);
      await a.tocar(page.getByRole('button', { name: /^8 porciones/ }));
      await a.pausa(450);
      await a.tocar(page.getByRole('button', { name: /^Agregar/ }));
      await a.pausa(800);
      await a.tocar(page.locator('a[href="/carrito"]:visible').last());
      await a.pausa(1000);
    },
  },
  fonosanjorge: {
    url: 'https://fonosanjorge.com.ar',
    async usar(page, a) {
      await a.pausa(1000);
      await a.tocar(page.getByRole('button', { name: /Quiero mi turno/ }).first());
      await a.pausa(800);
      await a.escribir(page.getByPlaceholder('Ej: Ana García'), 'Ana García');
      await a.pausa(500);
      const servicio = page.locator('select:visible').first();
      const valor = await servicio.locator('option').nth(1).getAttribute('value');
      await a.elegir(servicio, valor);
      await a.pausa(1900);
    },
  },
  petrucci: {
    url: 'https://joyeria-petrucci-web.vercel.app',
    calentar: ['/joyeria/anillos/anillo-plata-y-oro'],
    async preparar(page) {
      await page
        .getByRole('button', { name: 'SOLO LAS NECESARIAS' })
        .tap({ timeout: 5000 })
        .catch(() => {});
      await espera(500);
    },
    async usar(page, a) {
      await a.pausa(800);
      await a.tocar(page.getByRole('link', { name: 'Ver pieza' }).first());
      await a.pausa(1400);
      await a.tocar(page.locator('button:visible', { hasText: /guardar para consultar/i }).first());
      // Al guardar, el sitio abre solo el panel "Mi consulta".
      await a.pausa(2600);
    },
  },
};

/** La barra de estado de un iPhone, en PNG transparente: se pega arriba del video. */
async function barraDeEstado(navegador, destino) {
  const c = await navegador.newContext({
    viewport: { width: 390, height: ALTO_ESTADO },
    deviceScaleFactor: 2,
  });
  const p = await c.newPage();
  await p.setContent(`<body style="margin:0;background:transparent"><div style="position:relative;width:390px;height:${ALTO_ESTADO}px;color:#fff;font:600 16px -apple-system,'Segoe UI',system-ui,sans-serif">
    <span style="position:absolute;left:44px;top:19px">9:41</span>
    <svg style="position:absolute;right:30px;top:21px" width="74" height="13" viewBox="0 0 74 13" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0.5" width="3" height="11.5" rx="1"/>
      <path d="M31 2.2c2.4 0 4.6 1 6.2 2.5l1.2-1.3C36.4 1.5 33.8.3 31 .3s-5.4 1.2-7.4 3.1l1.2 1.3C26.4 3.2 28.6 2.2 31 2.2Zm0 3.9c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7.2 7.2 0 0 0 31 4.3a7.2 7.2 0 0 0-4.8 1.9l1.2 1.3c1-.9 2.2-1.4 3.6-1.4Zm0 3.8c-.8 0-1.4.3-1.9.7l1.9 2 1.9-2c-.5-.4-1.1-.7-1.9-.7Z"/>
      <rect x="47.5" y="1" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".45"/><rect x="49" y="2.5" width="19" height="8" rx="1.8"/><rect x="70.5" y="4.5" width="1.6" height="4" rx=".8" opacity=".5"/>
    </svg></div></body>`);
  await p.screenshot({ path: destino, omitBackground: true });
  await c.close();
}

async function grabar(navegador, id, r, temporal, estado) {
  const contexto = await navegador.newContext({
    ...devices['iPhone 15'],
    viewport: VIEWPORT,
    screen: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  await contexto.route('**/*', (ruta) => {
    const q = ruta.request();
    const permitido = q.method() === 'GET' || SOLO_LECTURA.test(q.url());
    return !permitido || BLOQUEADOS.test(q.url()) ? ruta.abort() : ruta.continue();
  });
  await contexto.addInitScript(instalarDedo);
  const page = await contexto.newPage();

  // Primero se visita todo una vez: en la grabación no hay esperas de red.
  for (const ruta of ['', ...(r.calentar ?? [])]) {
    await page.goto(r.url + ruta, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  }
  await page.goto(r.url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await r.preparar?.(page);

  const cdp = await contexto.newCDPSession(page);
  const cuadros = [];
  cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
    const archivo = join(temporal, `${id}-${String(cuadros.length).padStart(5, '0')}.jpg`);
    writeFileSync(archivo, Buffer.from(data, 'base64'));
    cuadros.push({ archivo, t: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 88,
    maxWidth: 780,
    maxHeight: 1580,
  });
  await r.usar(page, acciones(page));
  await cdp.send('Page.stopScreencast');
  await contexto.close();

  // ffmpeg arma el video con la duración real de cada cuadro, acortando las esperas largas.
  let total = 0;
  const lista = cuadros.map((c, i) => {
    const d = Math.min((cuadros[i + 1]?.t ?? c.t + 1.2) - c.t, PAUSA_MAXIMA_S);
    total += d;
    return `file '${c.archivo.replaceAll('\\', '/')}'\nduration ${d.toFixed(4)}`;
  });
  const ultimo = cuadros.at(-1);
  if (!ultimo) throw new Error(`${id}: sin cuadros`);
  lista.push(`file '${ultimo.archivo.replaceAll('\\', '/')}'`);
  const concat = join(temporal, `${id}.txt`);
  writeFileSync(concat, lista.join('\n'));
  const mp4 = join(SALIDA, `uso-${id}.mp4`);
  const filtro =
    `[0:v]fps=30,scale=780:1580,pad=780:${1580 + ALTO_ESTADO * 2}:0:${ALTO_ESTADO * 2}:black[b];` +
    `[b][1:v]overlay=0:0,scale=${ANCHO_FINAL}:-2,format=yuv420p[o]`;
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-v',
      'error',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      concat,
      '-i',
      estado,
      '-filter_complex',
      filtro,
      '-map',
      '[o]',
      '-an',
      '-c:v',
      'libx264',
      '-profile:v',
      'main',
      '-preset',
      'slow',
      '-crf',
      '31',
      '-movflags',
      '+faststart',
      mp4,
    ],
    { stdio: 'inherit' },
  );
  const poster = join(SALIDA, `uso-${id}.webp`);
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-v',
      'error',
      '-ss',
      '0.5',
      '-i',
      mp4,
      '-frames:v',
      '1',
      '-c:v',
      'libwebp',
      '-quality',
      '68',
      poster,
    ],
    { stdio: 'inherit' },
  );
  console.warn(
    `${id}: ${total.toFixed(1)} s, ${cuadros.length} cuadros, video ${Math.round(statSync(mp4).size / 1024)} KB, póster ${Math.round(statSync(poster).size / 1024)} KB`,
  );
}

const pedidos = process.argv.slice(2);
const temporal = mkdtempSync(join(tmpdir(), 'webya-usos-'));
const navegador = await chromium.launch();
try {
  const estado = join(temporal, 'estado.png');
  await barraDeEstado(navegador, estado);
  for (const [id, r] of Object.entries(RECORRIDOS)) {
    if (pedidos.length > 0 && !pedidos.includes(id)) continue;
    await grabar(navegador, id, r, temporal, estado);
  }
} finally {
  await navegador.close();
  if (existsSync(temporal)) rmSync(temporal, { recursive: true, force: true });
}
