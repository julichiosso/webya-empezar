import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CAMPO } from '@/content/paginas';
import { CabezaSeccion } from './CabezaSeccion';
import { TextoBoton } from './Boton';
import { FondoGrilla } from './FondoGrilla';

/** /campo: cada problema del campo con el sistema que lo resuelve (y el link a ese producto). */
export function SolucionesCampo() {
  const S = CAMPO.soluciones;
  return (
    <section className="tono-claro e-seccion e-con-fondo" aria-labelledby="titulo-soluciones">
      <FondoGrilla />
      <div className="e-wrap">
        <CabezaSeccion rotulo={S.rotulo} titulo={S.titulo} idTitulo="titulo-soluciones" />
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 md:gap-4 lg:grid-cols-3">
          {S.items.map((x, i) => (
            <li key={x.titulo} data-reveal="" style={{ '--i': i % 3 } as CSSProperties}>
              <Link
                href={x.href}
                className="e-celda group flex h-full flex-col rounded-2xl border border-ed-line bg-ed-bg p-5 active:opacity-70 md:p-7"
              >
                <span className="e-rotulo text-ed-muted">{x.producto}</span>
                <span className="e-h3 mt-3">
                  <TextoBoton>{x.titulo}</TextoBoton>
                </span>
                <span className="e-cuerpo mt-2 text-ed-muted">{x.texto}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="e-cuerpo mt-8 max-w-[60ch] text-ed-muted">{CAMPO.nota}</p>
      </div>
    </section>
  );
}
