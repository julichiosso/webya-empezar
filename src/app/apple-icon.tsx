import { ImageResponse } from 'next/og';
import { LOGO_TRAZOS } from '@/brand/logo/trazos';
import { svgTejaCompacta, TEJA } from '@/brand/logo/variantes';
import { BASE } from '@/brand/tokens/colores';

/**
 * Ícono de la pantalla de inicio en iOS: la variante compacta (la "w") en la misma teja que el
 * favicon (src/app/icon.svg). Cuadrado y sin esquinas: iOS le pone su propia máscara redondeada.
 * Los colores salen de la marca (colores.ts); se genera en el build (estático).
 */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const teja = svgTejaCompacta(LOGO_TRAZOS[0], {
  lado: size.width,
  fondo: BASE.bg,
  tinta: BASE.fg,
  radio: 0,
  ocupacion: TEJA.ocupacion,
});
const src = `data:image/svg+xml;base64,${Buffer.from(teja).toString('base64')}`;

export default function AppleIcon() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) no usa next/image
    <img src={src} width={size.width} height={size.height} alt="" />,
    size,
  );
}
