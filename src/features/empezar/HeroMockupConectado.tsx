'use client';

import { HeroMockup } from '@/components/marketing/HeroMockup';
import { alternarModuloStore, hayDecisionesManuales, useModulos } from './modulos-store';

/**
 * El mockup del hero conectado al estado compartido con el wizard (modulos-store). Lo que se activa
 * acá llega pre-seleccionado al paso de módulos.
 */
export function HeroMockupConectado() {
  const { seleccionados } = useModulos();
  return (
    <HeroMockup
      seleccionados={seleccionados}
      alternarModulo={alternarModuloStore}
      hayDecisionesManuales={hayDecisionesManuales}
    />
  );
}
