import { SCRIPT_TEMA } from './tema';

/**
 * Aplica el tema guardado antes del primer pintado (sin destello). Componente de servidor: es un
 * `<script>` en línea de ~0,1 KB gzip y nada más. Montalo una vez, arriba de todo, en el layout
 * (con `suppressHydrationWarning` en <html>, porque el script le cambia `data-theme`).
 */
export function ScriptTema() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />;
}
