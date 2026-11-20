/**
 * Búsqueda local para el buscador del hero: sin red, sin dependencias. Ignora mayúsculas, tildes,
 * signos y palabras de relleno ("para", "mi", "quiero"…), tolera plurales y busca también frases.
 */

/** Palabras que no ayudan a buscar. */
const RELLENO = new Set([
  'a',
  'al',
  'algo',
  'como',
  'con',
  'de',
  'del',
  'el',
  'en',
  'es',
  'hacer',
  'la',
  'las',
  'lo',
  'los',
  'me',
  'mi',
  'mis',
  'necesito',
  'negocio',
  'para',
  'por',
  'que',
  'quiero',
  'se',
  'su',
  'sus',
  'tengo',
  'un',
  'una',
  'unos',
  'y',
  'yo',
]);

/** Saca caracteres de control y recorta: lo que entra al buscador siempre es texto acotado. */
export function limpiarConsulta(texto: string, largo: number): string {
  return texto.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, largo);
}

/** Minúsculas, sin tildes ni signos, espacios simples. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Distancia de edición (con transposición: "turnso" está a 1 de "turnos"). Corta apenas supera `max`:
 * el buscador solo pregunta "¿está cerca?", nunca cuánto.
 */
export function distancia(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let antes2: number[] = [];
  let antes = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const fila = [i];
    let minimo = i;
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(antes[j]! + 1, fila[j - 1]! + 1, antes[j - 1]! + costo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, antes2[j - 2]! + 1);
      }
      fila.push(v);
      minimo = Math.min(minimo, v);
    }
    if (minimo > max) return max + 1;
    antes2 = antes;
    antes = fila;
  }
  return antes[b.length]!;
}

/** Error de tipeo tolerado: uno en palabras de 5 a 7 letras, dos desde 8. Las cortas, exactas. */
const tolerancia = (t: string) => (t.length >= 8 ? 2 : t.length >= 5 ? 1 : 0);

const parecida = (t: string, p: string) => {
  const max = tolerancia(t);
  return max > 0 && p.length >= 4 && distancia(t, p, max) <= max;
};

/** Singular aproximado: "turnos" → "turno", "pizzerias" → "pizzeria". */
const raiz = (p: string) => (p.length > 4 && p.endsWith('s') ? p.slice(0, -1) : p);

interface Buscable {
  titulo: string;
  palabras: readonly string[];
}

function puntaje(item: Buscable, consulta: string, tokens: readonly string[]): number {
  let total = 0;
  const palabras = item.palabras.map(normalizar);
  // Frases completas ("cuanto sale", "lista de precios"): valen más.
  for (const p of palabras) if (p.includes(' ') && consulta.includes(p)) total += 6;
  const titulo = normalizar(item.titulo).split(' ');
  for (const t of tokens) {
    let mejor = 0;
    for (const p of [...palabras, ...titulo]) {
      if (p === t || raiz(p) === raiz(t)) mejor = Math.max(mejor, 5);
      else if (t.length >= 3 && p.startsWith(t)) mejor = Math.max(mejor, 3);
      else if (p.length >= 4 && t.startsWith(raiz(p))) mejor = Math.max(mejor, 3);
      else if (parecida(t, p)) mejor = Math.max(mejor, 2);
      else if (t.length >= 4 && p.includes(t)) mejor = Math.max(mejor, 1);
    }
    total += mejor;
  }
  return total;
}

/** Los destinos que mejor coinciden con lo escrito, de mayor a menor (como mucho `max`). */
export function buscar<T extends Buscable>(items: readonly T[], texto: string, max = 5): T[] {
  const consulta = normalizar(texto);
  if (consulta.length < 2) return [];
  const tokens = consulta.split(' ').filter((t) => t.length >= 2 && !RELLENO.has(t));
  if (tokens.length === 0 && !consulta.includes(' ')) return [];
  return items
    .map((item, orden) => ({ item, orden, puntos: puntaje(item, consulta, tokens) }))
    .filter((r) => r.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos || a.orden - b.orden)
    .slice(0, max)
    .map((r) => r.item);
}

/**
 * El rubro que se nombra en lo escrito ("turnos para mi peluqeria" → 'estetica'), con la misma
 * tolerancia a errores. Null si no nombra ninguno.
 */
export function detectarRubro(
  texto: string,
  rubros: Readonly<Record<string, string>>,
): string | null {
  const tokens = normalizar(texto)
    .split(' ')
    .filter((t) => t.length >= 3 && !RELLENO.has(t));
  for (const t of tokens) {
    for (const [palabra, rubro] of Object.entries(rubros)) {
      if (palabra === t || raiz(palabra) === raiz(t) || parecida(t, palabra)) return rubro;
    }
  }
  return null;
}
