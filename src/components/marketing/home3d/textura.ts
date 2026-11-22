import { DataTexture, LinearFilter, LinearMipmapLinearFilter, RepeatWrapping, RGBAFormat } from 'three';

/**
 * Superficie de metal cepillado, generada en el navegador (sin archivos ni red): vetas horizontales finas
 * con un poco de grano. Sirve de mapa de relieve y de rugosidad (las vetas brillan distinto según la luz).
 * Pseudoaleatorio con semilla fija: el poster y el canvas salen iguales.
 */
export function texturaCepillado(lado = 256): DataTexture {
  let semilla = 7;
  const azar = () => {
    semilla = (semilla * 16807) % 2147483647;
    return semilla / 2147483647;
  };
  const filas = new Float32Array(lado);
  for (let y = 0; y < lado; y++) filas[y] = azar();
  const datos = new Uint8Array(lado * lado * 4);
  for (let y = 0; y < lado; y++) {
    // Cada veta mezcla su fila con las vecinas: líneas suaves, no ruido de TV.
    const base = (filas[y]! * 0.6 + filas[(y + 1) % lado]! * 0.25 + filas[(y + lado - 1) % lado]! * 0.15) * 0.7;
    for (let x = 0; x < lado; x++) {
      const v = Math.min(1, base + azar() * 0.18 + 0.12);
      const i = (y * lado + x) * 4;
      const b = Math.round(v * 255);
      datos[i] = b;
      datos[i + 1] = Math.round((0.55 + v * 0.35) * 255); // rugosidad (canal verde)
      datos[i + 2] = b;
      datos[i + 3] = 255;
    }
  }
  const t = new DataTexture(datos, lado, lado, RGBAFormat);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.magFilter = LinearFilter;
  t.minFilter = LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}
