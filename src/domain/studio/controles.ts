/** Lo que la barra común de las demos necesita del estudio de cada una (contrato entre capas). */
export interface ControlesEstudio {
  deshacer: () => void;
  rehacer: () => void;
  reiniciar: () => void;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
  /** Link que abre esta misma configuración (sin fotos). */
  enlace: () => Promise<string>;
  /** Lo que armó la persona, en líneas cortas (para el resumen y el mensaje de WhatsApp). */
  resumen: readonly string[];
}
