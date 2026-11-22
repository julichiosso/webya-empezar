'use client';

import { useEffect, useRef } from 'react';
import {
  COLORES_PROTECTORA as K,
  ORG,
  TAMANOS,
  UI_PROTECTORA,
  type Animal,
} from '@/content/demos/protectora';
import { Ilustracion } from './Ilustracion';

const C = UI_PROTECTORA.compartir;
const LADO = 1080;

/**
 * La ficha de un animal como imagen cuadrada para Instagram y WhatsApp. Se dibuja en SVG (lo que se ve) y
 * se convierte a PNG en el navegador al descargar: no sube nada a ningún lado.
 */
export function Compartir({ animal, onCerrar }: { animal: Animal; onCerrar: () => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cerrar.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onCerrar]);

  const descargar = () => {
    const nodo = svg.current;
    if (!nodo) return;
    const texto = new XMLSerializer().serializeToString(nodo);
    const img = new Image();
    img.onload = () => {
      const lienzo = document.createElement('canvas');
      lienzo.width = LADO;
      lienzo.height = LADO;
      lienzo.getContext('2d')?.drawImage(img, 0, 0, LADO, LADO);
      lienzo.toBlob((b) => {
        if (!b) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = `${animal.id}-busca-familia.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }, 'image/png');
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(texto)}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compartir-titulo"
      className="fixed inset-0 z-50 grid place-items-center bg-(--pr-tinta)/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div className="pr-paleta w-full max-w-sm rounded-3xl p-5">
        <h3 id="compartir-titulo" className="pr-titulo text-[1.25rem] font-semibold">
          {C.titulo}
        </h3>
        <p className="text-[0.875rem] text-(--pr-tinta-2)">{C.texto}</p>
        <svg
          ref={svg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${LADO} ${LADO}`}
          role="img"
          aria-label={`${C.busca}: ${animal.nombre}`}
          className="mt-4 w-full rounded-2xl"
        >
          <rect width={LADO} height={LADO} fill={K.tonos[animal.tono]} />
          <g transform="translate(300 90)" color={K.tinta}>
            <Ilustracion
              especie={animal.especie}
              semilla={animal.id}
              tamano={animal.tamano}
              tam={480}
              ojos={K.tonos[animal.tono]}
            />
          </g>
          <text
            x="80"
            y="760"
            fill={K.acento}
            fontSize="44"
            fontWeight="700"
            fontFamily="Georgia, serif"
          >
            {C.busca.toUpperCase()}
          </text>
          <text
            x="80"
            y="860"
            fill={K.tinta}
            fontSize="110"
            fontWeight="700"
            fontFamily="Georgia, serif"
          >
            {animal.nombre}
          </text>
          <text
            x="80"
            y="930"
            fill={K.tinta2}
            fontSize="40"
            fontFamily="Helvetica, Arial, sans-serif"
          >
            {`${UI_PROTECTORA.ficha.edad(animal.edadMeses)} · ${TAMANOS[animal.tamano]} · ${animal.caracter}`}
          </text>
          <text
            x="80"
            y="1010"
            fill={K.tinta}
            fontSize="36"
            fontWeight="700"
            fontFamily="Helvetica, Arial, sans-serif"
          >
            {ORG.nombre}
          </text>
        </svg>
        <div className="mt-4 grid gap-2">
          <button type="button" onClick={descargar} className="pr-boton">
            {C.descargar}
          </button>
          <button ref={cerrar} type="button" onClick={onCerrar} className="pr-boton-2">
            {C.cerrar}
          </button>
        </div>
      </div>
    </div>
  );
}
