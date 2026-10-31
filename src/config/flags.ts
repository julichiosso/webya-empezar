/**
 * Interruptores de secciones que dependen de una confirmación del usuario. Se prenden a mano, con
 * un commit, cuando la condición se cumple; los tests verifican que sigan apagados mientras tanto.
 */
export const FLAGS = {
  /**
   * Caso real de Micio's Pizzería en /empezar ("Hecho para negocios reales"). APAGADO hasta tener
   * el permiso ESCRITO de Micio's para usar su marca y sus fotos. Sin permiso, no se publica.
   */
  casoMicios: false,
} as const;
