/**
 * Lo pesado del buscador (el índice y la búsqueda), en un módulo propio: Buscador.tsx lo pide con
 * import() la primera vez que la persona toca el campo. Así no suma al JavaScript de la carga.
 */
export {
  ARMABLES,
  DESTINOS_BUSQUEDA,
  RUBRO_POR_PALABRA,
  hrefArmar,
} from '@/content/buscador-destinos';
export { buscar, detectarRubro } from '@/lib/busqueda';
