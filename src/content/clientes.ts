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
  /** Ciudad del negocio, tal como figura en su sitio. */
  ciudad: string;
  /** Una frase de lo que se hizo, verdadera y concreta. */
  hizo: string;
  /** Lo que tiene el sitio hoy, punto por punto. Solo lo verificado mirando el sitio publicado. */
  armamos: readonly string[];
  /** Captura de móvil (375 px) en /public/clientes. */
  captura: string;
  /** Medidas reales del archivo, para reservar el alto (CLS 0). */
  capturaAncho: number;
  capturaAlto: number;
  /** Recorte de la primera pantalla (375x560) para el telón de la intro. */
  telon: string;
  /** Rótulo corto del telón: nombre y qué hace, verdadero. */
  rotulo: string;
  /** Qué muestra la captura, para lectores de pantalla. */
  alt: string;
}

export const CLIENTES: readonly Cliente[] = [
  {
    id: 'micios',
    nombre: "Micio's Pizzería",
    rubroId: 'gastronomia',
    url: 'https://miciospizzas.com.ar',
    ciudad: 'San Jorge, Santa Fe',
    hizo: 'Carta online con buscador y pedidos que se confirman por WhatsApp.',
    armamos: [
      'Carta online con buscador',
      'Pedidos que se confirman por WhatsApp',
      'Días y horarios de atención',
      'Mapa y enlace a su Instagram',
    ],
    captura: '/clientes/micios.webp',
    capturaAncho: 375,
    capturaAlto: 2198,
    telon: '/clientes/telon-micios.webp',
    rotulo: "Micio's Pizzería · carta y pedidos",
    alt: "Inicio del sitio de Micio's Pizzería en el celular: carta con pizzas, bebidas y postres.",
  },
  {
    id: 'abelardo',
    nombre: 'Abelardo Pizzas',
    rubroId: 'gastronomia',
    url: 'https://abelardo.vercel.app',
    ciudad: 'San Jorge, Santa Fe',
    hizo: 'Carta con promos del día y pedidos que se confirman por WhatsApp.',
    armamos: [
      'Carta con categorías y promos del día',
      'Pedidos que se confirman por WhatsApp',
      'Horario de hoy y mapa',
      'Se puede agregar a la pantalla de inicio del celular',
    ],
    captura: '/clientes/abelardo.webp',
    capturaAncho: 375,
    capturaAlto: 2178,
    telon: '/clientes/telon-abelardo.webp',
    rotulo: 'Abelardo Pizzas · promos y pedidos',
    alt: 'Inicio del sitio de Abelardo en el celular: promos del día y categorías de la carta.',
  },
  {
    id: 'fonosanjorge',
    nombre: 'Fonosanjorge',
    rubroId: 'profesionales',
    url: 'https://fonosanjorge.com.ar',
    ciudad: 'San Jorge, Santa Fe',
    hizo: 'Sitio de la fonoaudióloga Lorena Almagro: especialidades, cómo trabaja y contacto.',
    armamos: [
      'Especialidades y talleres infantiles',
      'Cobertura de obras sociales',
      'Cómo trabaja con cada familia',
      'Turno y consultas por WhatsApp, con el mensaje ya armado',
    ],
    captura: '/clientes/fonosanjorge.webp',
    capturaAncho: 375,
    capturaAlto: 4200,
    telon: '/clientes/telon-fonosanjorge.webp',
    rotulo: 'Fonosanjorge · sitio de una fonoaudióloga',
    alt: 'Inicio del sitio de Fonosanjorge en el celular: presentación de la fonoaudióloga y sus especialidades.',
  },
  {
    id: 'petrucci',
    nombre: 'Joyería Petrucci',
    rubroId: 'comercio',
    url: 'https://joyeria-petrucci-web.vercel.app',
    ciudad: 'San Jorge, Santa Fe',
    hizo: 'Catálogo online de joyas, relojes y más, con consulta por WhatsApp en cada producto.',
    armamos: [
      'Catálogo por categorías: joyería, relojes, marroquinería y mates',
      'Novedades y consulta por WhatsApp en cada producto',
      'Sus marcas y sus trabajos a medida',
      'Dirección con mapa',
    ],
    captura: '/clientes/petrucci.webp',
    capturaAncho: 375,
    capturaAlto: 4200,
    telon: '/clientes/telon-petrucci.webp',
    rotulo: 'Joyería Petrucci · catálogo y consultas',
    alt: 'Inicio del sitio de Joyería Petrucci en el celular: alianzas y joyas hechas en su taller, categorías y novedades.',
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

/** Cifras de la sección: salen de la lista de clientes, nunca se escriben a mano. */
export function resumenClientes(clientes: readonly Cliente[] = CLIENTES) {
  return { sitios: clientes.length, rubros: new Set(clientes.map((c) => c.rubroId)).size };
}

/** Dominio para mostrar: sin protocolo ni www. */
export const dominioDe = (url: string) => new URL(url).host.replace(/^www\./, '');

export const YA_CREARON = {
  titulo: 'Ya crearon con WebYa',
  bajada: 'Negocios reales, con su sitio funcionando. Conocelos.',
  resumen: { sitios: 'sitios funcionando', rubros: 'rubros' },
  caso: (n: number) => `Caso ${String(n).padStart(2, '0')}`,
  queArmamos: 'Qué tiene hoy',
  ver: 'Verlo funcionando',
  flecha: ' ↗',
  /** Se dice después del nombre del negocio: "Verlo funcionando, Abelardo Pizzas". */
  externo: ' (se abre en otra pestaña)',
} as const;
