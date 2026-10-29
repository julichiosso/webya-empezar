import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BASE, LOGO_RELLENO_ORIGINAL } from '@/brand/tokens/colores';
import { SEO_EMPEZAR } from '@/content/seo';
import { mezclar } from '@/lib/color';

const { og: OG } = SEO_EMPEZAR;

export const alt = OG.alt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Acá no hay CSS (el PNG se genera en el build): los colores salen de la config de marca.
const { bg: BG, fg: FG, muted: MUTED } = BASE;
// Borde de las pastillas: blanco al 20 % sobre el fondo, ya mezclado (opaco: Satori no necesita alfa).
const LINE = mezclar(FG, BG, 0.2);

const MODULOS = OG.modulos;

export default async function Image() {
  const [fuente, logoSvg] = await Promise.all([
    readFile(
      join(process.cwd(), 'node_modules/@fontsource/outfit/files/outfit-latin-700-normal.woff'),
    ),
    readFile(join(process.cwd(), 'public/webya-logo.svg'), 'utf8'),
  ]);
  // El logo es negro: se pasa a blanco y se embebe como data URI (sin pedir nada por red).
  const logo = `data:image/svg+xml;base64,${Buffer.from(logoSvg.replaceAll(LOGO_RELLENO_ORIGINAL, FG)).toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: BG,
        color: FG,
        padding: 72,
        fontFamily: 'Outfit',
      }}
    >
      {/* El SVG trae aire a la izquierda: se compensa (marginLeft) para alinear con el título. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) no usa next/image */}
      <img src={logo} width={216} height={50} alt="" style={{ marginLeft: -26 }} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: -4, fontWeight: 700 }}>
          {OG.titulo}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 56,
            lineHeight: 1.05,
            letterSpacing: -2,
            fontWeight: 700,
            color: MUTED,
          }}
        >
          {OG.subtitulo}
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {MODULOS.map((m) => (
            <div
              key={m}
              style={{
                display: 'flex',
                border: `2px solid ${LINE}`,
                borderRadius: 999,
                padding: '10px 24px',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: 'Outfit', data: fuente, style: 'normal', weight: 700 }],
    },
  );
}
