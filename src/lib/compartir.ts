/**
 * Empaqueta una configuración (JSON) en un texto corto para el hash de un link, y la desempaqueta. Usa la
 * compresión nativa del navegador (`CompressionStream`, deflate) cuando existe; si no, base64 sin comprimir.
 * Sin librerías. El primer carácter dice el formato: `z` comprimido, `j` plano.
 *
 * Nunca viajan imágenes (pesan y son de la persona): el que arma la configuración las saca antes.
 */

/** Tope del texto empaquetado: un link más largo se rompe en WhatsApp y en algunos navegadores. */
export const MAX_EMPAQUETADO = 6000;

function aBase64Url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deBase64Url(texto: string): Uint8Array {
  const b64 = texto.replace(/-/g, '+').replace(/_/g, '/');
  const s = atob(b64 + '==='.slice((b64.length + 3) % 4));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

async function pasarPor(bytes: Uint8Array, flujo: CompressionStream | DecompressionStream) {
  const salida = new Blob([bytes as BlobPart]).stream().pipeThrough(flujo);
  return new Uint8Array(await new Response(salida).arrayBuffer());
}

export async function empaquetar(valor: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(valor));
  if (typeof CompressionStream === 'function') {
    try {
      return `z${aBase64Url(await pasarPor(bytes, new CompressionStream('deflate-raw')))}`;
    } catch {
      // Navegador con la API a medias: sigue sin comprimir.
    }
  }
  return `j${aBase64Url(bytes)}`;
}

/** Devuelve el valor (sin validar: lo valida quien lo usa) o null si el texto no es un paquete válido. */
export async function desempaquetar(texto: string): Promise<unknown> {
  if (!texto || texto.length > MAX_EMPAQUETADO * 2) return null;
  try {
    const tipo = texto[0];
    const bytes = deBase64Url(texto.slice(1));
    let plano: Uint8Array;
    if (tipo === 'z') plano = await pasarPor(bytes, new DecompressionStream('deflate-raw'));
    else if (tipo === 'j') plano = bytes;
    else return null;
    return JSON.parse(new TextDecoder().decode(plano)) as unknown;
  } catch {
    return null;
  }
}
