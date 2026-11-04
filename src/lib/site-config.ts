/**
 * Configuración pública del sitio. Las NEXT_PUBLIC_* se inlinean en el build, por eso se leen
 * con el nombre completo (no con process.env[key]). Los secretos NUNCA van acá: ver server/env.ts.
 */
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://webya.dev',
  /**
   * WhatsApp de WebYa (formato 549XXXXXXXXXX). Sin número, los botones de WhatsApp no se muestran
   * y el contacto queda por mail e Instagram.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  contactEmail: 'studio.webya@gmail.com',
  instagramUrl: 'https://instagram.com/webya.dev',
} as const;
