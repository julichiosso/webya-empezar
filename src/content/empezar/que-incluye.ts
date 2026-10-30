import { ESTADOS_MODULO_TEXTO } from '@/content/estados-modulo';

/**
 * Sección "Qué podés activar" (el catálogo): los módulos salen de content/modulos.ts y cada uno muestra su
 * estado tal cual (etiqueta + explicación de content/estados-modulo.ts, y su `notaEstado` si tiene).
 */
export const QUE_INCLUYE = {
  titulo: 'Qué podés activar',
  bajada: 'Cada módulo es una pieza: sumá solo las que tu negocio usa.',
  /** Título de la leyenda que explica los estados. */
  leyendaEstados: 'Qué quiere decir cada estado',
  estados: ESTADOS_MODULO_TEXTO,
  /** Enlace secundario al final del catálogo: baja a la sección "¿Y si no está?". */
  noEsta: {
    pregunta: '¿No ves lo que necesitás?',
    enlace: 'Lo armamos a medida',
  },
} as const;
