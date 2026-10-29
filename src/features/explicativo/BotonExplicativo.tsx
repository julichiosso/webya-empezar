'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { buttonClasses } from '@/components/ui/Button';
import { ESCENAS_EXPLICATIVO } from '@/content/explicativo';
import { BOTON_EXPLICATIVO } from '@/content/explicativo/reproductor';
import { duracionTotalMs, etiquetaDuracion } from './narracion';
import type { OrigenExplicativo } from './Reproductor';

const cargar = () => import('./Reproductor').then((m) => m.Reproductor);
/** El video (escenas + reproductor) se descarga recién al tocar el botón: no pesa en la página. */
const Reproductor = dynamic(cargar, { ssr: false });

const DURACION = etiquetaDuracion(duracionTotalMs(ESCENAS_EXPLICATIVO.map((e) => e.narracion)));

/** "Mirá cómo funciona": abre el video explicativo. Empieza a bajarlo al pasar el mouse o enfocar. */
export function BotonExplicativo({
  origen,
  className,
}: {
  origen: OrigenExplicativo;
  className?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);
  const precargar = () => void cargar();
  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        onPointerEnter={precargar}
        onFocus={precargar}
        className={`${buttonClasses('secondary')} ${className ?? ''}`.trim()}
      >
        <Icon name="play" size={20} />
        {BOTON_EXPLICATIVO.texto}
        <span className="tabular text-small font-normal text-muted">{DURACION}</span>
      </button>
      {abierto && <Reproductor origen={origen} onCerrar={cerrar} />}
    </>
  );
}
