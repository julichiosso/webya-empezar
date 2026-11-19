import { ASUNTO_MAIL } from '@/content/configurador';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { siteConfig } from '@/lib/site-config';

export type Canal = 'whatsapp' | 'mail';

/**
 * Enlace para hablar con Julián con un mensaje ya escrito. Con NEXT_PUBLIC_WHATSAPP_NUMBER abre
 * WhatsApp; sin número (todavía no está cargado) cae a un mail con el mismo texto, así el pedido
 * nunca se pierde. Es un link: cero requests desde la página.
 */
export function enlaceContacto(
  mensaje: string,
  numero: string = siteConfig.whatsappNumber,
): { href: string; canal: Canal } {
  const wa = buildWhatsAppLink(numero, mensaje);
  if (wa) return { href: wa, canal: 'whatsapp' };
  const q = `subject=${encodeURIComponent(ASUNTO_MAIL)}&body=${encodeURIComponent(mensaje)}`;
  return { href: `mailto:${siteConfig.contactEmail}?${q}`, canal: 'mail' };
}

export const hayWhatsApp = (numero: string = siteConfig.whatsappNumber) =>
  buildWhatsAppLink(numero, '') !== null;
