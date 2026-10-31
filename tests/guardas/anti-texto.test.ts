// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * Anti-texto hardcodeado (más estricto que tests/arquitectura, que usa una heurística de prosa):
 * ningún .tsx de components, features o app escribe texto visible en JSX.
 *
 * - Nodo de texto JSX con al menos una letra (`<p>Hola</p>`, `<span>px</span>`).
 * - Literal de texto con letras como hijo JSX (`{'Hola'}`).
 * - `aria-label`, `alt`, `title` o `placeholder` con un string literal con letras (`alt=""` vale:
 *   es la forma correcta de marcar una imagen decorativa).
 *
 * El texto llega por props o desde src/content. Análisis con el compilador de TypeScript (ya
 * instalado), sin dependencias nuevas.
 */
const RAIZ = process.cwd();
const CARPETAS = ['src/components', 'src/features', 'src/app'];
const ATRIBUTOS = new Set(['aria-label', 'alt', 'title', 'placeholder']);
const LETRA = /\p{L}/u;

/** Archivo (relativo a la raíz, con "/") → motivo. Vacía: si algo falla, lo decide el integrador. */
const EXCEPCIONES: Record<string, string> = {};

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? archivos(p) : [p];
  });
}

const rel = (f: string) => relative(RAIZ, f).split('\\').join('/');

/** Texto literal de un inicializador de atributo (`"x"`, `{'x'}`, `` {`x`} ``), o null. */
function literalDe(ini: ts.JsxAttributeValue | undefined): string | null {
  if (!ini) return null;
  if (ts.isStringLiteral(ini)) return ini.text;
  if (ts.isJsxExpression(ini) && ini.expression) {
    const e = ini.expression;
    if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
  }
  return null;
}

function textosEnJsx(nombre: string, codigo: string): string[] {
  const sf = ts.createSourceFile(nombre, codigo, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const salida: string[] = [];
  const anotar = (n: ts.Node, texto: string) => {
    const linea = sf.getLineAndCharacterOfPosition(n.getStart()).line + 1;
    salida.push(`${nombre}:${linea} «${texto.trim().replace(/\s+/g, ' ').slice(0, 50)}»`);
  };
  const visitar = (n: ts.Node) => {
    if (ts.isJsxText(n) && LETRA.test(n.text)) anotar(n, n.text);
    else if (
      ts.isJsxExpression(n) &&
      n.expression &&
      (ts.isJsxElement(n.parent) || ts.isJsxFragment(n.parent)) &&
      (ts.isStringLiteral(n.expression) || ts.isNoSubstitutionTemplateLiteral(n.expression)) &&
      LETRA.test(n.expression.text)
    )
      anotar(n, n.expression.text);
    else if (ts.isJsxAttribute(n) && ATRIBUTOS.has(n.name.getText())) {
      const texto = literalDe(n.initializer);
      if (texto !== null && LETRA.test(texto)) anotar(n, `${n.name.getText()}="${texto}"`);
    }
    ts.forEachChild(n, visitar);
  };
  visitar(sf);
  return salida;
}

const componentes = CARPETAS.flatMap((c) => archivos(resolve(RAIZ, c))).filter(
  (f) => f.endsWith('.tsx') && !/\.test\.tsx$/.test(f),
);

describe('anti-texto: cero texto visible literal en JSX', () => {
  it('el detector encuentra texto, literales y atributos, y deja pasar lo sano', () => {
    const malo = `export const A = () => (<p title="Ayuda">Hola <b>{'che'}</b><img alt="Foto" /><input placeholder={\`Nombre\`} aria-label='Buscar' /></p>);`;
    expect(textosEnJsx('a.tsx', malo)).toHaveLength(6);
    const sano = `export const B = ({ t }: { t: string }) => (<p className="text-muted" title={t}>{t} · 3 <img alt="" />{' '}</p>);`;
    expect(textosEnJsx('b.tsx', sano)).toEqual([]);
  });

  it('revisa los componentes de verdad', () => {
    expect(componentes.length).toBeGreaterThan(20);
  });

  it('ningún componente escribe texto visible (salvo excepciones registradas)', () => {
    const violaciones = componentes
      .filter((f) => !(rel(f) in EXCEPCIONES))
      .flatMap((f) => textosEnJsx(rel(f), readFileSync(f, 'utf8')));
    expect(violaciones).toEqual([]);
  });

  it('cada excepción sigue haciendo falta (si no, se borra)', () => {
    const sobrantes = Object.keys(EXCEPCIONES).filter(
      (e) => textosEnJsx(e, readFileSync(resolve(RAIZ, e), 'utf8')).length === 0,
    );
    expect(sobrantes).toEqual([]);
  });
});
