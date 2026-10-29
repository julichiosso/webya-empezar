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
  lead_enviado: { rubro: string; modulos: number; objetivos: number };
  modulo_alternado: { modulo: string; activo: boolean; origen: 'hero' | 'wizard' };
  whatsapp_click: { origen: 'confirmacion' | 'flotante' };
  // Demos de rubro (/demo/<rubro>). `demo` es el rubro (p. ej. 'gastronomia').
  demo_view: { demo: string; cocina: string };
  demo_personalizada: { demo: string; campo: 'nombre' | 'paleta' | 'cocina'; valor: string };
  demo_pedido_creado: { demo: string; modalidad: string; items: number; medioPago: string };
  demo_estado_avanzado: { demo: string; estado: string };
  demo_cta_click: { demo: string; origen: string };
  demo_qr_celular: { demo: string };
  demo_whatsapp_click: { demo: string };
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
