import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'WebYa: creá tu negocio online. Elegí tu rubro. Activá lo que necesitás.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Mismos tokens que globals.css (acá no hay CSS: el PNG se genera en el build).
const BG = '#0b0b0c';
const FG = '#ffffff';
const MUTED = '#a1a1a6';
const LINE = 'rgba(255,255,255,0.2)';

const MODULOS = ['Turnos', 'Tienda y catálogo', 'Carta con QR', 'Pagos online'];

export default async function Image() {
  const [fuente, logoSvg] = await Promise.all([
    readFile(
      join(process.cwd(), 'node_modules/@fontsource/outfit/files/outfit-latin-700-normal.woff'),
    ),
    readFile(join(process.cwd(), 'public/webya-logo.svg'), 'utf8'),
  ]);
  // El logo es negro: se pasa a blanco y se embebe como data URI (sin pedir nada por red).
  const logo = `data:image/svg+xml;base64,${Buffer.from(logoSvg.replaceAll('#000000', FG)).toString('base64')}`;

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
          Creá tu negocio online.
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
          Elegí tu rubro. Activá lo que necesitás.
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
