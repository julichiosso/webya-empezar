'use client';

import { fuenteMarca } from '@/content/demos/studio';
import { estiloMarca, type Marca } from './marca';

/**
 * Vista previa en vivo de la marca para el asistente (al costado en la compu): el logo, el nombre con su
 * letra, una línea y un botón del color elegido, como lo vería un cliente.
 */
export function VistaMarca({
  marca,
  linea,
  boton,
}: {
  marca: Marca;
  linea: string;
  boton: string;
}) {
  return (
    <div
      style={estiloMarca(marca)}
      className="w-full max-w-80 overflow-hidden rounded-[2rem] border border-ed-line bg-ed-bg"
    >
      <div className="flex h-36 items-end bg-(--marca) p-5">
        {marca.logo ? (
          // Foto local (blob:) ya achicada.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={marca.logo}
            alt=""
            className="size-16 rounded-2xl border-2 border-ed-bg object-cover"
          />
        ) : (
          <span className="grid size-16 place-items-center rounded-2xl bg-ed-bg/90 text-[1.75rem] font-bold text-(--marca-texto)">
            {(marca.nombre.trim()[0] ?? '·').toUpperCase()}
          </span>
        )}
      </div>
      <div className="p-5">
        <p
          className="text-[1.5rem] leading-tight font-semibold break-words"
          style={{ fontFamily: fuenteMarca(marca.fuenteId).pila }}
        >
          {marca.nombre}
        </p>
        <p className="mt-1 text-[1rem] text-ed-muted">{linea}</p>
        <span className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-(--marca) text-[1rem] font-semibold text-(--marca-tinta)">
          {boton}
        </span>
      </div>
    </div>
  );
}
