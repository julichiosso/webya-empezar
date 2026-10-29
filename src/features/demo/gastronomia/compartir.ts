import {
  COCINA_IDS,
  MODULOS_DEMO,
  PALETAS_DEMO,
  RUBRO_DEMO,
  type CocinaId,
} from '@/content/demos/gastronomia';
import { ORIGEN_DEMO_GASTRONOMIA } from '@/config/origenes';
import type { DatosDesdeDemo } from '@/features/empezar/desde-demo';
import { LARGO_NOMBRE_LOCAL, type EstadoDemo, type Personalizacion } from './store';

/**
 * Personalización en la URL (para el QR y el link de WhatsApp): `?local=&paleta=&cocina=`.
 * Al leer se valida todo contra la config; lo desconocido se ignora.
 */
export function personalizacionDeUrl(search: string): Personalizacion {
  const q = new URLSearchParams(search);
  const p: Personalizacion = {};
  const local = q.get('local')?.trim();
  if (local) p.nombreLocal = local.slice(0, LARGO_NOMBRE_LOCAL);
  const paleta = q.get('paleta');
  if (paleta && PALETAS_DEMO.some((x) => x.id === paleta)) p.paletaId = paleta;
  const cocina = q.get('cocina');
  if (cocina && (COCINA_IDS as readonly string[]).includes(cocina)) p.cocinaId = cocina as CocinaId;
  return p;
}

/** URL de la demo con la personalización actual (absoluta, para compartir). */
export function urlCompartible(
  origen: string,
  e: Pick<EstadoDemo, 'nombreLocal' | 'paletaId' | 'cocinaId'>,
) {
  const q = new URLSearchParams();
  if (e.nombreLocal) q.set('local', e.nombreLocal);
  q.set('paleta', e.paletaId);
  q.set('cocina', e.cocinaId);
  return `${origen}/demo/gastronomia?${q.toString()}`;
}

/** "Mandame esta demo por WhatsApp": sin número, así la persona elige a quién (o a sí misma). */
export function linkWhatsAppDemo(url: string, nombreLocal: string): string {
  const texto = `Mirá cómo quedaría ${nombreLocal} con WebYa (demo con datos de ejemplo): ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

/** Lo que la demo le pasa al wizard al tocar "Quiero esto para mi local". */
export function datosParaWizard(
  e: Pick<EstadoDemo, 'nombreLocal' | 'paletaId' | 'cocinaId'>,
): DatosDesdeDemo {
  return {
    origen: ORIGEN_DEMO_GASTRONOMIA,
    rubro: RUBRO_DEMO,
    modulos: MODULOS_DEMO,
    // Si no escribió un nombre, no le cargamos "Tu pizzería": que lo complete.
    nombreNegocio: e.nombreLocal ?? '',
    demo: { paleta: e.paletaId, cocina: e.cocinaId },
  };
}
