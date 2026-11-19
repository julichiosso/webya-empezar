import type { NextConfig } from 'next';

const desarrollo = process.env.NODE_ENV === 'development';

/**
 * CSP fija (sin nonce) para no perder el HTML estático: ver docs/adr/0001-csp-fija-con-sri.md.
 * - script-src necesita 'unsafe-inline' por los scripts en línea de Next (datos de hidratación) y los
 *   nuestros (entrada del logo, tema). Los chunks externos llevan además `integrity` (SRI).
 * - Nada se carga de otro origen: ni fuentes, ni analítica, ni APIs del navegador por red.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${desarrollo ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${desarrollo ? ' ws:' : ''}`,
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Hash de cada chunk JS en el atributo `integrity`: el navegador rechaza un archivo alterado.
    sri: { algorithm: 'sha256' },
    // El CSS (Tailwind, chico) viaja dentro del HTML: saca la hoja bloqueante del camino crítico.
    inlineCss: false,
  },
  async redirects() {
    // /empezar era la landing anterior (link de la bio de Instagram): ahora todo vive en la home.
    // 307 (no permanente) para poder volver atrás sin caché de redirección en los navegadores.
    return [
      { source: '/empezar', destination: '/', permanent: false },
      // La demo de gastronomía genérica se reemplazó por la del sistema real de Micio's.
      { source: '/demo/gastronomia', destination: '/demo/pedidos', permanent: false },
      // La demo del bot de peluquería se reemplazó por la del turnero con seña (sistema real).
      { source: '/demo/peluqueria', destination: '/demo/turnos', permanent: false },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default config;
