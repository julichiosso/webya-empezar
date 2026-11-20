import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { EDITORIAL } from '@/brand/tokens/colores';
import { MAPA_LIMITE, MAPA_PROYECCION as P } from '@/config/zona-geo';
import { ZONA as Z } from '@/content/paginas';
import { LOCALIDADES, ORDEN_ZONAS, localidadesDe } from '@/content/zona';
import { proyectar, zonaSuave } from '@/lib/mapa';

export const alt = Z.seo.descripcion;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Imagen para compartir /zona: el titular con las dos ciudades y el mapa real de la zona. */
export default async function Image() {
  const geist = (peso: number) =>
    readFile(
      join(process.cwd(), `node_modules/@fontsource/geist/files/geist-latin-${peso}-normal.woff`),
    );
  const [semibold, regular] = await Promise.all([geist(600), geist(400)]);
  const { tinta, blanco, gris } = EDITORIAL;
  const punto = (lat: number, lng: number) => proyectar(P, lat, lng);
  const zonas = ORDEN_ZONAS.map((z) =>
    zonaSuave(
      localidadesDe(z).map((l) => punto(l.lat, l.lng)),
      26,
    ),
  );
  const alto = 560;
  const ancho = Math.round((P.ancho / P.alto) * alto);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: tinta,
        color: blanco,
        padding: '40px 72px',
        fontFamily: 'Geist',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
        <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: -4, lineHeight: 0.95 }}>
          {Z.titulo.join(' ')}
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: gris, lineHeight: 1.3 }}>{Z.bajada}</div>
      </div>
      <svg width={ancho} height={alto} viewBox={`0 0 ${P.ancho} ${P.alto}`}>
        <path d={zonas[0]} fill={blanco} fillOpacity={0.1} />
        <path d={zonas[1]} fill={blanco} fillOpacity={0.18} />
        <path d={MAPA_LIMITE} fill="none" stroke={blanco} strokeOpacity={0.45} strokeWidth={2} />
        {LOCALIDADES.map((l) => {
          const [x, y] = punto(l.lat, l.lng);
          return <circle key={l.slug} cx={x} cy={y} r={l.principal ? 10 : 5} fill={blanco} />;
        })}
      </svg>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
        { name: 'Geist', data: regular, weight: 400, style: 'normal' },
      ],
    },
  );
}
