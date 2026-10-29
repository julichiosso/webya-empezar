import type { ModuloId } from '@/content/modulos';
import { cafeteria } from '@/content/demos/gastronomia/cocinas/cafe';
import { parrilla } from '@/content/demos/gastronomia/cocinas/parrilla';
import { pizzeria } from '@/content/demos/gastronomia/cocinas/pizzeria';
import { COCINA_IDS, type CocinaDemo, type CocinaId } from './types';

/**
 * Demo de Gastronomía (/demo/gastronomia). TODOS los datos de ejemplo viven en esta carpeta; los
 * componentes solo los leen. Procedimiento para sumar otra demo: skill webya-demo-builder.
 */
export * from './paletas';
export * from './types';

export const COCINAS: Readonly<Record<CocinaId, CocinaDemo>> = {
  parrilla,
  pizzeria,
  cafe: cafeteria,
};

export const COCINA_POR_DEFECTO: CocinaId = 'pizzeria';

export function getCocina(id: string | null | undefined): CocinaDemo {
  return (COCINA_IDS as readonly string[]).includes(id ?? '')
    ? COCINAS[id as CocinaId]
    : COCINAS[COCINA_POR_DEFECTO];
}

/** Tenant y local ficticios de la demo: nunca coinciden con uno real. */
export const TENANT_DEMO = 'demo';
export const LOCAL_DEMO = 'demo-local';

/** Rubro y módulos con los que el CTA "Quiero esto para mi local" abre el wizard. */
export const MODULOS_DEMO: readonly ModuloId[] = ['carta_qr', 'pedidos', 'pagos', 'notificaciones'];

/** Cartel permanente: la demo nunca cobra ni envía nada. */
export const AVISO_DEMO = 'Demo con datos de ejemplo. No se cobra ni se envía nada.';
