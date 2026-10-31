'use client';

import { useEffect, useState, useSyncExternalStore, type ComponentType } from 'react';
import { MOVIMIENTO_REDUCIDO } from '@/brand/motion/presets';
import { PREVIEW } from '@/content/empezar/preview';
import { MarcoDispositivo } from './MarcoDispositivo';
import type { PreviewNegocioProps } from './PreviewNegocio';

type Preview = ComponentType<PreviewNegocioProps>;

/** Ya descargada: se dibuja en el primer render, sin pasar por el marco vacío. */
let cargada: Preview | null = null;
let pedido: Promise<Preview> | null = null;

/**
 * Descarga la vista previa por rubro (su propio chunk: plantillas, ilustraciones y paletas no entran
 * al JS inicial de /empezar). Se puede llamar las veces que sea: pide una sola vez. El wizard la
 * llama al elegir rubro y cuando el navegador está libre, así en la pantalla 3 ya está.
 */
export function precargarPreviewNegocio(): Promise<Preview> {
  pedido ??= import('./PreviewNegocio')
    .then((m) => (cargada = m.PreviewNegocio))
    .catch((e: unknown) => {
      pedido = null; // sin red: el próximo intento vuelve a pedirla
      throw e;
    });
  return pedido;
}

const consulta = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(MOVIMIENTO_REDUCIDO)
    : null;

function suscribir(avisar: () => void) {
  const mq = consulta();
  mq?.addEventListener('change', avisar);
  return () => mq?.removeEventListener('change', avisar);
}

/** prefers-reduced-motion, en vivo (en el servidor, sin preferencia). */
export function useMovimientoReducido(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => consulta()?.matches ?? false,
    () => false,
  );
}

type Props = Omit<PreviewNegocioProps, 'animar'>;

/**
 * La vista previa por rubro, descargada aparte. Mientras llega se ve el mismo marco vacío (mismas
 * medidas: sin layout shift). Con movimiento reducido las piezas aparecen quietas.
 */
export function PreviewNegocioDiferido(props: Props) {
  const [Preview, setPreview] = useState<Preview | null>(() => cargada);
  const reducido = useMovimientoReducido();

  useEffect(() => {
    if (Preview) return;
    let vivo = true;
    precargarPreviewNegocio()
      .then((p) => {
        if (vivo) setPreview(() => p);
      })
      .catch(() => {
        // Sin red: queda el marco vacío; se reintenta la próxima vez que se monte.
      });
    return () => {
      vivo = false;
    };
  }, [Preview]);

  if (!Preview) {
    return (
      <div aria-hidden="true" aria-busy="true" data-testid="preview-negocio-cargando">
        <MarcoDispositivo dispositivo={props.dispositivo} leyenda={PREVIEW.deEjemplo} />
      </div>
    );
  }
  return <Preview {...props} animar={!reducido} />;
}
