/**
 * Sanitización de texto libre. No reemplaza al escapado de salida (React ya escapa), pero evita
 * guardar basura: etiquetas HTML, caracteres de control y espacios raros.
 */

// Control C0/C1 (menos \t \n \r), ancho cero, separadores de línea/párrafo, marcas bidi y BOM.
// Se arma desde un string con escapes dobles para no depender de caracteres invisibles en el código.
const CONTROL_CHARS = new RegExp(
  '[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F\\u200B-\\u200F\\u2028-\\u202E\\u2066-\\u2069\\uFEFF]',
  'g',
);
const HTML_TAGS = /<\/?[a-zA-Z!][^>]*>?/g;
const LINE_SEPARATOR = String.fromCharCode(0x2028);

/** Una línea: sin etiquetas, sin control, espacios colapsados. */
export function sanitizeLine(value: string): string {
  return value
    .normalize('NFC')
    .replace(CONTROL_CHARS, '')
    .replace(HTML_TAGS, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Multilínea: igual, pero conserva saltos de línea (máx. dos seguidos). */
export function sanitizeMultiline(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARS, (c) => (c === LINE_SEPARATOR ? '\n' : ''))
    .replace(HTML_TAGS, '')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Recorre un objeto plano y sanitiza sus strings. `multiline` lista las claves que admiten saltos. */
export function sanitizeRecord<T extends Record<string, unknown>>(
  input: T,
  multiline: readonly string[] = [],
): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      out[key] = multiline.includes(key) ? sanitizeMultiline(value) : sanitizeLine(value);
    } else if (Array.isArray(value)) {
      out[key] = value.map((v) => (typeof v === 'string' ? sanitizeLine(v) : v));
    } else {
      out[key] = value;
    }
  }
  return out as T;
}
