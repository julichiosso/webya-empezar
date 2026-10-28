/**
 * Capa de analítica abstracta. Sin proveedor todavía: para enchufar uno, registrá un "sink"
 * una vez en el cliente (ver README, sección Analítica):
 *
 *   registerSink((evento, props) => window.plausible?.(evento, { props }));
 *   registerSink((evento, props) => window.gtag?.('event', evento, props));
 *   registerSink((evento, props) => window.fbq?.('trackCustom', evento, props));
 */

export interface EventosAnalitica {
  empezar_view: Record<string, never>;
  rubro_seleccionado: { rubro: string };
  paso_completado: { paso: number; nombre: string };
  lead_enviado: { rubro: string; objetivos: number };
  whatsapp_click: { origen: 'confirmacion' | 'flotante' };
}

export type NombreEvento = keyof EventosAnalitica;
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
