import type { LeadRow } from './repositories/types';

/** Lo mínimo para avisar de un lead nuevo. */
export type LeadNotificacion = Pick<
  LeadRow,
  'id' | 'nombre' | 'nombre_negocio' | 'rubro' | 'rubro_otro' | 'modulos' | 'objetivos' | 'whatsapp'
>;

/** Lead parcial: el WhatsApp, lo que necesita (y el texto libre) y lo que haya elegido. */
export type LeadParcialNotificacion = Pick<
  LeadRow,
  'id' | 'whatsapp' | 'necesidades' | 'necesidad_libre' | 'rubro' | 'rubro_otro' | 'modulos'
>;

export interface NotificationService {
  nuevoLead(lead: LeadNotificacion): Promise<void>;
  /** Alguien dejó solo su WhatsApp: conviene escribirle rápido, aunque no complete el resto. */
  nuevoLeadParcial(lead: LeadParcialNotificacion): Promise<void>;
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

  async nuevoLeadParcial(lead: LeadParcialNotificacion): Promise<void> {
    // Ni el teléfono ni el texto libre van al log: solo si hay texto.
    console.warn(
      `[leads] nuevo lead parcial ${lead.id} (${lead.rubro_otro ?? lead.rubro ?? 'sin rubro'}), ` +
        `necesidades: ${lead.necesidades.join(', ') || '-'}` +
        (lead.necesidad_libre ? ', con pedido a medida' : ''),
    );
  }
}

export function getNotificationService(): NotificationService {
  return new ConsoleNotificationService();
}
