/**
 * Aviso sonoro de pedido nuevo, generado con Web Audio (sin archivos). Apagado por defecto: se
 * crea el contexto recién cuando la persona lo prende (los navegadores exigen un gesto).
 */
let contexto: AudioContext | null = null;

export function prepararSonido(): boolean {
  try {
    contexto ??= new AudioContext();
    void contexto.resume();
    return true;
  } catch {
    return false;
  }
}

/** Dos tonos cortos ("ding-dong" suave). Si no hay audio, no hace nada. */
export function sonarPedidoNuevo() {
  const ctx = contexto;
  if (!ctx) return;
  const t = ctx.currentTime;
  [880, 1320].forEach((frecuencia, i) => {
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frecuencia;
    const inicio = t + i * 0.16;
    vol.gain.setValueAtTime(0, inicio);
    vol.gain.linearRampToValueAtTime(0.18, inicio + 0.02);
    vol.gain.exponentialRampToValueAtTime(0.001, inicio + 0.15);
    osc.connect(vol).connect(ctx.destination);
    osc.start(inicio);
    osc.stop(inicio + 0.16);
  });
}
