import { AVISOS_LEAD } from '@/content/avisos-lead';
import { getModulo, MODULO_IDS, type ModuloId } from '@/content/modulos';
import { getRubro } from '@/content/rubros';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { getEnv, type ServerEnv } from './env';
import type { DatosCompletar, LeadRow } from './repositories/types';

/** Lo mínimo para avisar de un lead nuevo. */
export type LeadNotificacion = Pick<
  LeadRow,
  'id' | 'nombre' | 'nombre_negocio' | 'rubro' | 'rubro_otro' | 'modulos' | 'objetivos' | 'whatsapp'
> &
  Partial<Pick<LeadRow, 'ciudad' | 'origen'>>;

/** Lead parcial: el WhatsApp, lo que necesita (y el texto libre) y lo que haya elegido. */
export type LeadParcialNotificacion = Pick<
  LeadRow,
  'id' | 'whatsapp' | 'necesidades' | 'necesidad_libre' | 'rubro' | 'rubro_otro' | 'modulos'
> &
  Partial<Pick<LeadRow, 'nombre_negocio' | 'ciudad' | 'origen'>>;

export interface NotificationService {
  nuevoLead(lead: LeadNotificacion): Promise<void>;
  /** Alguien dejó solo su WhatsApp: conviene escribirle rápido, aunque no complete el resto. */
  nuevoLeadParcial(lead: LeadParcialNotificacion): Promise<void>;
  /** Sumó nombre, mail o mensaje al lead que ya había dejado. */
  leadCompletado(id: string, datos: DatosCompletar): Promise<void>;
}

/** Un canal manda un texto ya armado. Lo que puede fallar (red, credenciales) lanza. */
interface Canal {
  enviar(asunto: string, texto: string): Promise<void>;
}

const ESPERA_MS = 5000;

const esModulo = (id: string): id is ModuloId => (MODULO_IDS as readonly string[]).includes(id);

function textoLead(lead: LeadParcialNotificacion | LeadNotificacion) {
  const negocio = lead.nombre_negocio ?? null;
  return AVISOS_LEAD.nuevo({
    negocio,
    rubro: lead.rubro_otro ?? (lead.rubro ? (getRubro(lead.rubro)?.nombre ?? lead.rubro) : null),
    ciudad: lead.ciudad,
    modulos: lead.modulos.map((m) => (esModulo(m) ? getModulo(m).nombre : m)),
    pedidoLibre: 'necesidad_libre' in lead ? lead.necesidad_libre : null,
    origen: lead.origen,
    whatsapp: lead.whatsapp,
    linkWhatsapp: buildWhatsAppLink(lead.whatsapp, AVISOS_LEAD.primerMensaje(negocio)),
  });
}

/** Telegram: gratis y llega al celular al instante. Requiere crear un bot con @BotFather. */
export function canalTelegram(token: string, chatId: string): Canal {
  return {
    async enviar(_asunto, texto) {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: texto, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(ESPERA_MS),
      });
      if (!r.ok) throw new Error(`Telegram respondió ${r.status}`);
    },
  };
}

/** Mail por la API de Resend. */
export function canalResend(apiKey: string, para: string, de: string): Canal {
  return {
    async enviar(asunto, texto) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ from: de, to: [para], subject: asunto, text: texto }),
        signal: AbortSignal.timeout(ESPERA_MS),
      });
      if (!r.ok) throw new Error(`Resend respondió ${r.status}`);
    },
  };
}

/** Avisa por todos los canales: que falle uno no frena al otro. Lanza solo si fallaron todos. */
export class CanalesNotificationService implements NotificationService {
  constructor(private readonly canales: readonly Canal[]) {}

  private async repartir(asunto: string, texto: string): Promise<void> {
    const resultados = await Promise.allSettled(this.canales.map((c) => c.enviar(asunto, texto)));
    const fallas = resultados.filter((r) => r.status === 'rejected');
    if (fallas.length > 0 && fallas.length === resultados.length) {
      throw new Error(`Fallaron todos los canales de aviso (${fallas.length})`);
    }
  }

  nuevoLead(lead: LeadNotificacion): Promise<void> {
    return this.repartir(AVISOS_LEAD.asunto(lead.nombre_negocio), textoLead(lead));
  }

  nuevoLeadParcial(lead: LeadParcialNotificacion): Promise<void> {
    return this.repartir(AVISOS_LEAD.asunto(lead.nombre_negocio ?? null), textoLead(lead));
  }

  leadCompletado(_id: string, d: DatosCompletar): Promise<void> {
    return this.repartir(
      AVISOS_LEAD.asuntoCompletado(d.nombre_negocio),
      AVISOS_LEAD.completado({
        negocio: d.nombre_negocio,
        nombre: d.nombre,
        email: d.email,
        mensaje: d.mensaje,
      }),
    );
  }
}

/**
 * Sin canales configurados: deja una línea en la consola del servidor, sin teléfono ni mail ni texto
 * libre de la persona. El lead queda guardado, pero nadie se entera: env.ts lo avisa al arrancar.
 */
export class ConsoleNotificationService implements NotificationService {
  async nuevoLead(lead: LeadNotificacion): Promise<void> {
    console.warn(
      `[leads] nuevo lead ${lead.id} (${lead.rubro}), módulos: ${lead.modulos.join(', ')}`,
    );
  }

  async nuevoLeadParcial(lead: LeadParcialNotificacion): Promise<void> {
    console.warn(
      `[leads] nuevo lead parcial ${lead.id} (${lead.rubro ?? 'sin rubro'}), ` +
        `necesidades: ${lead.necesidades.join(', ') || '-'}` +
        (lead.necesidad_libre ? ', con pedido a medida' : ''),
    );
  }

  async leadCompletado(id: string): Promise<void> {
    console.warn(`[leads] lead completado ${id}`);
  }
}

/** Elige los canales según las variables de entorno. */
export function crearNotificaciones(
  env: Pick<
    ServerEnv,
    | 'TELEGRAM_BOT_TOKEN'
    | 'TELEGRAM_CHAT_ID'
    | 'RESEND_API_KEY'
    | 'NOTIFY_TO_EMAIL'
    | 'NOTIFY_FROM_EMAIL'
  >,
): NotificationService {
  const canales: Canal[] = [];
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    canales.push(canalTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID));
  }
  if (env.RESEND_API_KEY && env.NOTIFY_TO_EMAIL) {
    canales.push(canalResend(env.RESEND_API_KEY, env.NOTIFY_TO_EMAIL, env.NOTIFY_FROM_EMAIL));
  }
  return canales.length > 0
    ? new CanalesNotificationService(canales)
    : new ConsoleNotificationService();
}

let instancia: NotificationService | undefined;

export function getNotificationService(): NotificationService {
  instancia ??= crearNotificaciones(getEnv());
  return instancia;
}
