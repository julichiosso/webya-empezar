'use client';

import { useEffect } from 'react';
import { iniciarMedicion } from '@/lib/medicion';

/** Enciende la medición del embudo una vez por carga. No dibuja nada. */
export function Medicion() {
  useEffect(() => iniciarMedicion(), []);
  return null;
}
