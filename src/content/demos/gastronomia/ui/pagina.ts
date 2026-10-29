/** Página /demo/gastronomia: metadatos (SEO y Open Graph) y encabezado. */
export const PAGINA_DEMO = {
  titulo: 'Demo para gastronomía',
  descripcion:
    'Mirá cómo quedaría tu local: carta con QR, pedidos y seguimiento en vivo, con datos de ejemplo.',
  og: {
    sitio: 'WebYa',
    titulo: (titulo: string) => `${titulo} | WebYa`,
  },
  ariaLogo: 'WebYa: volver al inicio',
  encabezado: {
    titulo: 'Así se vería tu local con WebYa',
    bajada: 'Pedí algo como si fueras un cliente: elegí un plato, armalo a tu gusto y confirmá.',
  },
} as const;
