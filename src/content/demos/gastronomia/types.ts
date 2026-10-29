import type { ColoresPaleta } from '@/brand/tokens/colores';
import type { Centavos } from '@/domain/pedidos/dinero';
import type { EntradaPedido } from '@/domain/pedidos/schemas';
import type { Menu } from '@/domain/pedidos/types';

/** Rubro de esta demo (config/rubros). */
export const RUBRO_DEMO = 'gastronomia';

export const COCINA_IDS = ['parrilla', 'pizzeria', 'cafe'] as const;
export type CocinaId = (typeof COCINA_IDS)[number];

/** Nombres de las cocinas, livianos (sin cartas) para el wizard. Un test verifica que coincidan. */
export const NOMBRES_COCINA: Readonly<Record<CocinaId, string>> = {
  parrilla: 'Parrilla',
  pizzeria: 'Pizzería',
  cafe: 'Café',
};

/** Un tipo de cocina de la demo: cambia la carta, los precios de ejemplo y los pedidos simulados. */
export interface CocinaDemo {
  id: CocinaId;
  /** Cómo se elige en "Personalizá tu demo". */
  nombre: string;
  /** Nombre del local hasta que la persona escriba el suyo. */
  nombreLocalPorDefecto: string;
  menu: Menu;
  /** Costo de envío de ejemplo (solo delivery). */
  costoEnvio: Centavos;
  /** Pedidos para "Simular un pedido" en el panel del dueño. Se arman igual que uno real. */
  pedidosEjemplo: EntradaPedido[];
}

export interface PaletaDemo extends ColoresPaleta {
  id: string;
}
