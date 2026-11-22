/**
 * Capa de analítica abstracta. El sink propio (lib/medicion.ts) manda cada evento a /api/eventos con
 * sendBeacon. Para sumar otro proveedor, registrá otro "sink" una vez en el cliente:
 *
 *   registerSink((evento, props) => window.plausible?.(evento, { props }));
 *   registerSink((evento, props) => window.gtag?.('event', evento, props));
 *   registerSink((evento, props) => window.fbq?.('trackCustom', evento, props));
 */

export interface EventosAnalitica {
  /** Abrió una página (sale apenas carga: cuenta también a quien se va sin tocar nada). */
  pagina_vista: { ruta: string; utm_source?: string; utm_medium?: string; utm_campaign?: string };
  // Configurador "Armá tu sistema" (home y landings).
  configurador_tipo: { tipo: string; origen: 'tarjeta' | 'atajo' };
  configurador_enviar: { tipo: string; rubro: string; modulos: number; canal: 'whatsapp' | 'mail' };
  configurador_demo: { rubro: string };
  // Demos de rubro (/demos/<rubro>). `demo` es el rubro (p. ej. 'pedidos').
  demo_view: { demo: string; cocina: string };
  demo_personalizada: {
    demo: string;
    campo: 'nombre' | 'paleta' | 'cocina' | 'rubro' | 'producto' | 'logo';
    valor: string;
  };
  demo_pedido_creado: { demo: string; modalidad: string; items: number; medioPago: string };
  demo_estado_avanzado: { demo: string; estado: string };
  demo_cta_click: { demo: string; origen: string };
  demo_qr_celular: { demo: string };
  demo_whatsapp_click: { demo: string };
  // Demo Studio: qué hizo, nunca lo que escribió.
  demo_asistente: { demo: string; paso: number; accion: 'siguiente' | 'saltar' | 'fin' };
  demo_simulacion: { demo: string; accion: 'inicio' | 'pausa' | 'fin' };
  demo_accion: {
    demo: string;
    accion: 'deshacer' | 'rehacer' | 'reiniciar' | 'compartir' | 'texto_grande';
  };
  demo_enviada: { demo: string; canal: 'whatsapp' | 'mail' | 'copiar' };
  // Buscador del hero: a qué sugerencia fue (el texto escrito nunca se manda).
  buscador_elegido: { destino: string; rubro: string };
  // Cualquier link a WhatsApp del sitio (dónde estaba, no qué dice).
  whatsapp_click: { donde: string };
  // Sugerencias del celular: cuál se mostró, cuál se tocó y cuál se cerró.
  sugerencia: { id: string; accion: 'vista' | 'toque' | 'cerrada' };
}

export type NombreEvento = keyof EventosAnalitica;

/** Lista cerrada para la API de eventos: un nombre que no esté acá no se guarda. */
export const NOMBRES_EVENTO = [
  'pagina_vista',
  'configurador_tipo',
  'configurador_enviar',
  'configurador_demo',
  'demo_view',
  'demo_personalizada',
  'demo_pedido_creado',
  'demo_estado_avanzado',
  'demo_cta_click',
  'demo_qr_celular',
  'demo_whatsapp_click',
  'demo_asistente',
  'demo_simulacion',
  'demo_accion',
  'demo_enviada',
  'buscador_elegido',
  'whatsapp_click',
  'sugerencia',
] as const satisfies readonly NombreEvento[];
export type Sink = <E extends NombreEvento>(evento: E, props: EventosAnalitica[E]) => void;

const sinks = new Set<Sink>();

export function registerSink(sink: Sink): () => void {
  sinks.add(sink);
  return () => sinks.delete(sink);
}

export function track<E extends NombreEvento>(evento: E, props: EventosAnalitica[E]): void {
  if (typeof window === 'undefined') return;
  for (const sink of sinks) {
    try {
      sink(evento, props);
    } catch {
      // la analítica nunca debe romper la experiencia
    }
  }
}
