import type { LeadRow } from './repositories/types';

/** Lo mínimo para avisar de un lead nuevo. */
export type LeadNotificacion = Pick<
  LeadRow,
  'id' | 'nombre' | 'nombre_negocio' | 'rubro' | 'rubro_otro' | 'modulos' | 'objetivos' | 'whatsapp'
>;

export interface NotificationService {
  nuevoLead(lead: LeadNotificacion): Promise<void>;
}

/**
 * Implementación stub: deja una línea en la consola del servidor. No loguea teléfono ni mail.
 *
 * Cómo conectar un aviso real (se reemplaza `getNotificationService`, el resto no cambia):
 *  - Email: implementar NotificationService con Resend/Postmark/SendGrid y llamar a su API
 *    desde `nuevoLead` con RESEND_API_KEY y NOTIFY_TO_EMAIL (agregarlas a env.ts y .env.example).
 *  - WhatsApp: WhatsApp Cloud API (POST /{phone-number-id}/messages) con una plantilla aprobada.
 *  - Slack: un Incoming Webhook (SLACK_WEBHOOK_URL) con un POST JSON { text }.
 *  - Varios a la vez: un CompositeNotificationService que reparta en Promise.allSettled.
 * En Vercel, para no demorar la respuesta, envolver el envío con `after()` de next/server.
 */
export class ConsoleNotificationService implements NotificationService {
  async nuevoLead(lead: LeadNotificacion): Promise<void> {
    console.warn(
      `[leads] nuevo lead ${lead.id}: ${lead.nombre_negocio} (${lead.rubro_otro ?? lead.rubro}), ` +
        `módulos: ${lead.modulos.join(', ')}`,
    );
  }
}

export function getNotificationService(): NotificationService {
  return new ConsoleNotificationService();
}
