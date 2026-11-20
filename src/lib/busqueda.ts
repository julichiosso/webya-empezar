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
