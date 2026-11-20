/**
 * Configuración pública del sitio. Las NEXT_PUBLIC_* se inlinean en el build, por eso se leen
 * con el nombre completo (no con process.env[key]). Los secretos NUNCA van acá: ver server/env.ts.
 */
export const siteConfig = {
  /**
   * Dominio canónico, fijo: canonical, Open Graph, sitemap y JSON-LD apuntan siempre a webya.dev, aunque el
   * sitio se sirva desde un deploy de Vercel (*.vercel.app). Los links internos son relativos.
   */
  url: 'https://webya.dev',
  /**
   * WhatsApp de Julián (formato wa.me: 54 + 9 + característica sin 0 + número sin 15). Es público
   * (va en cada link wa.me), por eso tiene valor por defecto; NEXT_PUBLIC_WHATSAPP_NUMBER lo pisa.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5493406419495',
  contactEmail: 'studio.webya@gmail.com',
  instagramUrl: 'https://instagram.com/webya.dev',
} as const;
