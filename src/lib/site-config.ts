/**
 * Configuración pública del sitio. Las NEXT_PUBLIC_* se inlinean en el build, por eso se leen
 * con el nombre completo (no con process.env[key]). Los secretos NUNCA van acá: ver server/env.ts.
 */
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://webya.ar',
  /** TODO: completar NEXT_PUBLIC_WHATSAPP_NUMBER (formato 549XXXXXXXXXX). */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  /** TODO: completar NEXT_PUBLIC_CONTACT_EMAIL. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://instagram.com/webya.dev',
} as const;
