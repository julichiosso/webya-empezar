/**
 * Corre al final de `pnpm build`: busca "[COMPLETAR" en lo que se publica (HTML y RSC prerenderizados y el
 * JS del navegador). Si aparece, un dato pendiente de TODO-contenido.md llegó al sitio y el build falla.
 * El JS del servidor no se revisa: no se publica y puede conservar comentarios.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const RAIZ = join(process.cwd(), '.next');
const CARPETAS = [join(RAIZ, 'server', 'app'), join(RAIZ, 'static')];
const PUBLICADO = /\.(html|rsc|body|js|json|txt)$/;
const SERVIDOR_JS = /[\\/]server[\\/]app[\\/].*\.js$/;

function archivos(dir) {
  let lista = [];
  let nombres = [];
  try {
    nombres = readdirSync(dir);
  } catch {
    return lista;
  }
  for (const n of nombres) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) lista = lista.concat(archivos(p));
    else if (PUBLICADO.test(n) && !SERVIDOR_JS.test(p)) lista.push(p);
  }
  return lista;
}

const revisados = CARPETAS.flatMap(archivos);
if (!revisados.length) {
  console.error('chequear-pendientes: no encontré la salida del build en .next');
  process.exit(1);
}

const con = revisados.filter((a) => readFileSync(a, 'utf8').includes('[COMPLETAR'));
if (con.length) {
  console.error('chequear-pendientes: hay datos [COMPLETAR] publicados (ver TODO-contenido.md):');
  for (const a of con) console.error(`  ${relative(process.cwd(), a)}`);
  process.exit(1);
}
process.stdout.write(
  `chequear-pendientes: sin [COMPLETAR] en ${revisados.length} archivos publicados.\n`,
);
