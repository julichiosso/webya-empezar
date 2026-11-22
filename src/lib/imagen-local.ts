/**
 * Fotos y logos que la persona sube a una demo: se achican y comprimen en su navegador y NUNCA salen de su
 * dispositivo (no hay ningún envío). Devuelve una URL local (`blob:`) que hay que liberar con `liberarImagen`.
 */

export const LADO_MAXIMO = 1280;
/** Lo que se acepta antes de procesar: una foto de celular grande entra; un video renombrado, no. */
export const PESO_MAXIMO = 25 * 1024 * 1024;

export type ErrorImagen = 'tipo' | 'peso' | 'lectura';

export interface ImagenLocal {
  url: string;
  ancho: number;
  alto: number;
}

/** Medidas finales para que el lado mayor no pase de `max`, sin agrandar nunca. */
export function medidasAjustadas(ancho: number, alto: number, max = LADO_MAXIMO) {
  const k = Math.min(1, max / Math.max(ancho, alto));
  return { ancho: Math.max(1, Math.round(ancho * k)), alto: Math.max(1, Math.round(alto * k)) };
}

export async function prepararImagen(
  archivo: File,
  max = LADO_MAXIMO,
): Promise<ImagenLocal | { error: ErrorImagen }> {
  if (!archivo.type.startsWith('image/')) return { error: 'tipo' };
  if (archivo.size > PESO_MAXIMO) return { error: 'peso' };
  try {
    const bitmap = await createImageBitmap(archivo);
    const { ancho, alto } = medidasAjustadas(bitmap.width, bitmap.height, max);
    const lienzo = document.createElement('canvas');
    lienzo.width = ancho;
    lienzo.height = alto;
    const ctx = lienzo.getContext('2d');
    if (!ctx) throw new Error('sin canvas');
    ctx.drawImage(bitmap, 0, 0, ancho, alto);
    bitmap.close();
    const blob = await new Promise<Blob | null>((ok) => lienzo.toBlob(ok, 'image/webp', 0.82));
    if (!blob) throw new Error('sin blob');
    return { url: URL.createObjectURL(blob), ancho, alto };
  } catch {
    // Formatos que el navegador no decodifica en canvas (HEIC en algunos Android): el archivo tal cual.
    try {
      return { url: URL.createObjectURL(archivo), ancho: 0, alto: 0 };
    } catch {
      return { error: 'lectura' };
    }
  }
}

export function liberarImagen(url?: string) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
}
