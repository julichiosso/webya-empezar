'use client';

import { useEffect, useState, type ComponentType } from 'react';

const ESPERA_MS = 1500;

/** Los tests automatizados no las ven (taparían botones), salvo el test que las prueba a propósito. */
function habilitadas(): boolean {
  if (!window.matchMedia('(max-width: 63.99rem)').matches) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!navigator.webdriver) return true;
  try {
    return sessionStorage.getItem('webya:sugerencias-e2e') === '1';
  } catch {
    return false;
  }
}

/**
 * Las sugerencias del celular se piden recién con la página cargada y quieta: no suman nada al
 * JavaScript inicial ni compiten con lo primero que se ve. En escritorio no se cargan.
 */
export function SugerenciasDiferidas() {
  const [Sugerencias, setSugerencias] = useState<ComponentType | null>(null);
  useEffect(() => {
    if (!habilitadas()) return;
    let vivo = true;
    const t = setTimeout(() => {
      import('./Sugerencias')
        .then((m) => {
          if (vivo) setSugerencias(() => m.Sugerencias);
        })
        .catch(() => {
          // Sin red: las sugerencias no son imprescindibles.
        });
    }, ESPERA_MS);
    return () => {
      vivo = false;
      clearTimeout(t);
    };
  }, []);
  return Sugerencias ? <Sugerencias /> : null;
}
