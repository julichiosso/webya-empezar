import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { LOGO_ENCUADRE } from '@/brand/logo/LogoWebya';
import { LOGO_TRAZOS } from '@/brand/logo/trazos';
import { EDITORIAL } from '@/brand/tokens/colores';
import { SEO_SITIO } from '@/content/seo';

const OG = SEO_SITIO.og;

export const alt = OG.alt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Imagen para compartir (se genera en el build): negro plano, logo `<webya>`, titular y zona. */
export default async function Image() {
  const fuente = (peso: number) =>
    readFile(
      join(process.cwd(), `node_modules/@fontsource/inter/files/inter-latin-${peso}-normal.woff`),
    );
  const [semibold, regular] = await Promise.all([fuente(600), fuente(400)]);
  const { tinta, blanco, gris, linea, lima } = EDITORIAL;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: tinta,
        color: blanco,
        padding: '64px 72px',
        fontFamily: 'Inter',
      }}
    >
      <svg viewBox={LOGO_ENCUADRE} width={200} height={60}>
        <g fill={blanco} fillRule="evenodd">
          {LOGO_TRAZOS.map((t) => (
            <path key={t.letra} d={t.d} />
          ))}
        </g>
      </svg>
      <div
        style={{
          display: 'flex',
          fontSize: 84,
          fontWeight: 600,
          lineHeight: 0.95,
          letterSpacing: -4,
          maxWidth: 980,
        }}
      >
        {OG.titulo}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          borderTop: `1px solid ${linea}`,
          paddingTop: 28,
          fontSize: 28,
          fontWeight: 400,
          color: gris,
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: 999, background: lima }} />
        {OG.pie}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Inter', data: semibold, weight: 600, style: 'normal' },
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
      ],
    },
  );
}
