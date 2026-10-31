/**
 * Escenas de rubro (grilla 96): la portada de la mini web en la vista previa de /empezar. Brand
 * define el vocabulario; los ids coinciden con los de `src/content/rubros` para que quien llama pase
 * el id del rubro tal cual. Un rubro sin escena (p. ej. "otro") dibuja el genérico.
 */
export const ESCENAS_RUBRO = [
  'peluqueria_estetica',
  'gastronomia',
  'comercio',
  'profesionales',
  'gimnasio_deportes',
  'servicios_tecnicos',
] as const;

export type EscenaRubro = (typeof ESCENAS_RUBRO)[number];

export function esEscenaRubro(valor: string): valor is EscenaRubro {
  return (ESCENAS_RUBRO as readonly string[]).includes(valor);
}
