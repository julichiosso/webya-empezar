import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix, relative, resolve } from 'node:path';
import ts from 'typescript';

/** Utilidades de los tests de arquitectura: recorren src/ con el compilador de TypeScript. */

export const RAIZ = process.cwd();
const SRC = resolve(RAIZ, 'src');

export function archivosDeCodigo(dir = SRC): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return archivosDeCodigo(p);
    return /\.tsx?$/.test(n) && !/\.test\.tsx?$/.test(n) && !n.endsWith('.d.ts') ? [p] : [];
  });
}

/** Ruta relativa a src/ con "/" (p. ej. "components/ui/Button.tsx"). */
export const rel = (archivo: string) => relative(SRC, archivo).split('\\').join('/');

export function parsear(archivo: string) {
  return ts.createSourceFile(archivo, readFileSync(archivo, 'utf8'), ts.ScriptTarget.Latest, true);
}

/**
 * Capas, de arriba hacia abajo. Una capa puede importar de sí misma y de las de más abajo.
 * `server` va aparte: solo la usan app (route handlers) e instrumentation.ts.
 */
export const CAPAS = [
  'app',
  'features',
  'components/marketing',
  'components/patterns',
  'components/ui',
  'content',
  'brand',
  'domain',
  'config',
  'lib',
] as const;

export type Capa = (typeof CAPAS)[number] | 'server' | 'raiz';

export function capaDe(rutaSrc: string): Capa {
  if (rutaSrc.startsWith('server/')) return 'server';
  const capa = CAPAS.find((c) => rutaSrc === c || rutaSrc.startsWith(`${c}/`));
  return capa ?? 'raiz';
}

/** features/<nombre>: las features no se importan entre sí (el contrato compartido baja de capa). */
export const featureDe = (rutaSrc: string) =>
  rutaSrc.startsWith('features/') ? rutaSrc.split('/')[1] : null;

export interface ImportInterno {
  desde: string;
  hacia: string;
  linea: number;
}

/** Imports internos (alias @/ o relativos) resueltos a ruta dentro de src/ (sin extensión). */
export function importsInternos(archivo: string): ImportInterno[] {
  const sf = parsear(archivo);
  const desde = rel(archivo);
  const salida: ImportInterno[] = [];
  const agregar = (spec: string, nodo: ts.Node) => {
    let destino: string | null = null;
    if (spec.startsWith('@/')) destino = spec.slice(2);
    else if (spec.startsWith('.'))
      destino = posix.normalize(posix.join(posix.dirname(desde), spec));
    if (destino === null) return;
    const linea = sf.getLineAndCharacterOfPosition(nodo.getStart()).line + 1;
    salida.push({ desde, hacia: destino, linea });
  };
  const visitar = (n: ts.Node) => {
    if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier) {
      if (ts.isStringLiteral(n.moduleSpecifier)) agregar(n.moduleSpecifier.text, n);
    } else if (
      ts.isCallExpression(n) &&
      n.expression.kind === ts.SyntaxKind.ImportKeyword &&
      n.arguments[0] &&
      ts.isStringLiteral(n.arguments[0])
    ) {
      agregar(n.arguments[0].text, n);
    }
    ts.forEachChild(n, visitar);
  };
  visitar(sf);
  return salida;
}

export function importPermitido(desde: string, hacia: string): boolean {
  const a = capaDe(desde);
  const b = capaDe(hacia);
  if (a === 'raiz') return true; // instrumentation.ts y similares: arranque del servidor
  if (b === 'server') return a === 'server' || a === 'app';
  if (a === 'server') return b !== 'app' && b !== 'features' && !b.startsWith('components');
  if (a === 'features' && b === 'features') return featureDe(desde) === featureDe(hacia);
  if (b === 'raiz') return false;
  return CAPAS.indexOf(b as (typeof CAPAS)[number]) >= CAPAS.indexOf(a as (typeof CAPAS)[number]);
}

/** Atributos JSX que son texto para personas (lectores de pantalla incluidos). */
const ATRIBUTOS_DE_TEXTO = new Set([
  'aria-label',
  'aria-description',
  'aria-roledescription',
  'aria-valuetext',
  'placeholder',
  'title',
  'alt',
  'label',
]);

/** ¿Parece prosa en castellano? (no clases de Tailwind, ids ni rutas). */
export function esProsa(texto: string): boolean {
  const t = texto.trim();
  if (!/\p{L}/u.test(t)) return false;
  if (/^(data:|https?:|mailto:|tel:|node_modules\/|\/)/.test(t)) return false;
  // Datos de path SVG (`M12 4h1v1z`): comandos de una letra y números, no palabras.
  if (/^[MLHVCSQTAZ][\d\s.,MLHVCSQTAZmlhvcsqtaz-]*$/.test(t)) return false;
  // Listas de clases de Tailwind o selectores CSS: todo en minúscula, sin acentos.
  if (t.split(/\s+/).every((p) => /^[a-z0-9_:/.[\]()%#!&>*,=@'"-]+$/.test(p))) return false;
  if (/^[a-z0-9_:/.#[\]()-]+$/i.test(t) && !/\s/.test(t) && !/[áéíóúñ¿¡]/i.test(t)) {
    // Una sola palabra: solo es copy si empieza en mayúscula o lleva acento ("Listo", "Menú").
    return /^\p{Lu}\p{Ll}+$/u.test(t);
  }
  // Varias palabras: prosa si hay mayúscula inicial, acentos o puntuación de oración.
  return /^[¿¡]?\p{Lu}/u.test(t) || /[áéíóúñ¿¡?!.,:]/i.test(t);
}

/** `'@type': 'Question'` (schema.org) o `{ name: 'Outfit', data, weight }` (fuente del OG). */
function esVocabularioTecnico(p: ts.PropertyAssignment): boolean {
  const nombre = p.name.getText().replace(/['"]/g, '');
  if (nombre === '@type' || nombre === '@context') return true;
  if (nombre !== 'name' || !ts.isObjectLiteralExpression(p.parent)) return false;
  return p.parent.properties.some((q) => q.name?.getText() === 'weight');
}

export interface TextoHardcodeado {
  archivo: string;
  linea: number;
  texto: string;
}

/**
 * Copy escrito dentro de un componente: texto JSX, atributos de texto y literales en prosa (también
 * en constantes del módulo). Se ignoran className, imports, claves de objetos y llamadas a cn().
 */
export function textosHardcodeados(archivo: string): TextoHardcodeado[] {
  const sf = parsear(archivo);
  const salida: TextoHardcodeado[] = [];
  const anotar = (nodo: ts.Node, texto: string) => {
    if (!esProsa(texto)) return;
    const linea = sf.getLineAndCharacterOfPosition(nodo.getStart()).line + 1;
    salida.push({ archivo: rel(archivo), linea, texto: texto.trim().slice(0, 60) });
  };
  const ignorado = (n: ts.Node): boolean => {
    for (let p = n.parent; p; p = p.parent) {
      if (ts.isJsxAttribute(p)) {
        const nombre = p.name.getText();
        if (!ATRIBUTOS_DE_TEXTO.has(nombre)) return true;
        return false;
      }
      if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) return true;
      if (
        ts.isCallExpression(p) &&
        /^(cn|clsx|buttonClasses|require)$/.test(p.expression.getText())
      )
        return true;
      if (ts.isPropertyAssignment(p) && p.name === n) return true;
      // Vocabulario técnico, no copy: tipos de schema.org y nombres de fuente.
      if (ts.isPropertyAssignment(p) && esVocabularioTecnico(p)) return true;
      if (ts.isElementAccessExpression(p)) return true;
      if (ts.isLiteralTypeNode(p)) return true;
      if (
        ts.isBinaryExpression(p) &&
        [
          ts.SyntaxKind.EqualsEqualsEqualsToken,
          ts.SyntaxKind.ExclamationEqualsEqualsToken,
        ].includes(p.operatorToken.kind)
      )
        return true;
    }
    return false;
  };
  const visitar = (n: ts.Node) => {
    if (ts.isJsxText(n)) anotar(n, n.text);
    else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      if (!ignorado(n)) anotar(n, n.text);
    } else if (ts.isTemplateExpression(n) && !ignorado(n)) {
      anotar(n, [n.head.text, ...n.templateSpans.map((s) => s.literal.text)].join(' '));
    }
    ts.forEachChild(n, visitar);
  };
  visitar(sf);
  return salida;
}
