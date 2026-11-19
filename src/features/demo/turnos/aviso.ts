/**
 * El aviso de reserva nueva del panel real (DEMO_SPEC_TURNOS §5.1): dos notas senoidales de 880 Hz y
 * 1318,5 Hz, de 0,35 s cada una, separadas 0,12 s, y vibración [30, 60, 30]. Sale después de un toque
 * del visitante (pagar la seña), así que el navegador lo deja sonar. Si no hay audio, no pasa nada.
 */
export function avisarNuevaReserva() {
  try {
    navigator.vibrate?.([30, 60, 30]);
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const nota = (frecuencia: number, desde: number) => {
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frecuencia;
      const t0 = ctx.currentTime + desde;
      vol.gain.setValueAtTime(0, t0);
      vol.gain.linearRampToValueAtTime(0.18, t0 + 0.02);
      vol.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);
      osc.connect(vol).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.36);
    };
    nota(880, 0);
    nota(1318.5, 0.47);
    setTimeout(() => void ctx.close(), 1200);
  } catch {
    // Sin audio o sin permiso: el cartel alcanza.
  }
}
