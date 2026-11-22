'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';

export type EstadoSimulador = 'quieto' | 'corriendo' | 'pausa' | 'fin';

/**
 * "Simular un día de trabajo": reproduce una lista de eventos de a uno, con su ritmo (`espera` en ms antes
 * de cada uno) y velocidad normal o rápida. Se puede pausar, seguir y terminar. Con movimiento reducido
 * corre igual (son datos, no animaciones). Al desmontar o pausar, el reloj se corta solo.
 */
export function useSimulador<T>({
  demo,
  eventos,
  onEvento,
}: {
  demo: string;
  /** Se pide al iniciar: así cada simulación arranca del estado actual de la demo. */
  eventos: () => readonly { espera: number; dato: T }[];
  onEvento: (dato: T) => void;
}) {
  const [estado, setEstado] = useState<EstadoSimulador>('quieto');
  const [rapido, setRapido] = useState(false);
  const [hechos, setHechos] = useState(0);
  const [total, setTotal] = useState(0);
  const cola = useRef<readonly { espera: number; dato: T }[]>([]);
  const alEvento = useRef(onEvento);

  useEffect(() => {
    alEvento.current = onEvento;
  });

  // Un evento por vez: cada vez que avanza (o cambia la velocidad), se programa el siguiente.
  useEffect(() => {
    if (estado !== 'corriendo') return;
    const siguiente = cola.current[hechos];
    const t = setTimeout(
      () => {
        if (!siguiente) {
          setEstado('fin');
          track('demo_simulacion', { demo, accion: 'fin' });
          return;
        }
        alEvento.current(siguiente.dato);
        setHechos((h) => h + 1);
      },
      siguiente ? siguiente.espera / (rapido ? 3 : 1) : 0,
    );
    return () => clearTimeout(t);
  }, [demo, estado, hechos, rapido]);

  const iniciar = () => {
    cola.current = eventos();
    setTotal(cola.current.length);
    setHechos(0);
    setEstado('corriendo');
    track('demo_simulacion', { demo, accion: 'inicio' });
  };
  const pausar = () => {
    setEstado('pausa');
    track('demo_simulacion', { demo, accion: 'pausa' });
  };
  const seguir = () => setEstado('corriendo');
  const detener = () => setEstado('quieto');

  return { estado, rapido, setRapido, hechos, total, iniciar, pausar, seguir, detener };
}
