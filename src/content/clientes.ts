import { getRubro } from '@/content/rubros';

/**
 * Negocios que ya crearon su sitio con WebYa y autorizaron mostrarse. Agregar uno = agregar un objeto
 * acá: la sección los agrupa por rubro sola. Solo clientes reales, y `hizo` cuenta únicamente lo que
 * se verificó mirando el sitio. Sin cifras ni testimonios inventados.
 */
export interface Cliente {
  id: string;
  nombre: string;
  /** Id de un rubro de content/rubros. */
  rubroId: string;
  url: string;
  /** Una frase de lo que se hizo, verdadera y concreta. */
  hizo: string;
  /** Captura de móvil (375 px) en /public/clientes. */
  captura: string;
  /** Medidas reales del archivo, para reservar el alto (CLS 0). */
  capturaAncho: number;
  capturaAlto: number;
  /** Qué muestra la captura, para lectores de pantalla. */
  alt: string;
}

export const CLIENTES: readonly Cliente[] = [
  {
    id: 'micios',
    nombre: "Micio's Pizzería",
    rubroId: 'gastronomia',
    url: 'https://miciospizzas.com.ar',
    hizo: 'Carta online con buscador y pedidos que se confirman por WhatsApp.',
    captura: '/clientes/micios.webp',
    capturaAncho: 375,
    capturaAlto: 2198,
    alt: "Inicio del sitio de Micio's Pizzería en el celular: carta con pizzas, bebidas y postres.",
  },
  {
    id: 'abelardo',
    nombre: 'Abelardo Pizzas',
    rubroId: 'gastronomia',
    url: 'https://abelardo.vercel.app',
    hizo: 'Carta con promos del día y pedidos que se confirman por WhatsApp.',
    captura: '/clientes/abelardo.webp',
    capturaAncho: 375,
    capturaAlto: 2178,
    alt: 'Inicio del sitio de Abelardo en el celular: promos del día y categorías de la carta.',
  },
  {
    id: 'fonosanjorge',
    nombre: 'Fonosanjorge',
    rubroId: 'profesionales',
    url: 'https://fonosanjorge.com.ar',
    hizo: 'Sitio de la fonoaudióloga Lorena Almagro: especialidades, cómo trabaja y contacto.',
    captura: '/clientes/fonosanjorge.webp',
    capturaAncho: 375,
    capturaAlto: 4200,
    alt: 'Inicio del sitio de Fonosanjorge en el celular: presentación de la fonoaudióloga y sus especialidades.',
  },
];

export interface GrupoClientes {
  rubroId: string;
  rubro: string;
  clientes: readonly Cliente[];
}

/** Clientes agrupados por rubro, solo los rubros que tienen clientes, en orden de aparición. */
export function clientesPorRubro(clientes: readonly Cliente[] = CLIENTES): GrupoClientes[] {
  const grupos = new Map<string, Cliente[]>();
  for (const c of clientes) grupos.set(c.rubroId, [...(grupos.get(c.rubroId) ?? []), c]);
  return [...grupos].map(([rubroId, lista]) => {
    const r = getRubro(rubroId);
    return { rubroId, rubro: r?.nombreCorto ?? r?.nombre ?? rubroId, clientes: lista };
  });
}

export const YA_CREARON = {
  titulo: 'Ya crearon con WebYa',
  bajada: 'Negocios reales, con su sitio funcionando. Abrilos y fijate.',
  ver: 'Verlo funcionando',
  flecha: ' ↗',
  /** Se dice después del nombre del negocio: "Verlo funcionando, Abelardo Pizzas". */
  externo: ' (se abre en otra pestaña)',
} as const;
