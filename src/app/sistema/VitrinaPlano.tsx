import type { ReactNode } from 'react';
import { CLASES_SECCION, Seccion, type FondoSeccion } from '@/components/patterns/Seccion';
import { SlotImagen, type EscenaPlano } from '@/components/patterns/SlotImagen';
import { buttonClasses } from '@/components/ui/boton-clases';
import { TituloEncastre } from '@/components/ui/TituloEncastre';
import { SISTEMA } from '@/content/sistema';

const T = SISTEMA.plano;
const FONDOS: readonly FondoSeccion[] = ['tinta', 'crema', 'brasa', 'imagen'];
const ESCENAS: readonly EscenaPlano[] = ['hero', 'como-funciona', 'cierre'];

function Bloque({
  titulo,
  bajada,
  children,
}: {
  titulo: string;
  bajada: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-10">
      <h3 className="text-body font-semibold">{titulo}</h3>
      <p className="mt-1 max-w-2xl text-small text-muted">{bajada}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Muestra({ nombre, children }: { nombre: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-2 border-t border-line pt-4">
      <p className="text-small text-subtle">{nombre}</p>
      {children}
    </div>
  );
}

/**
 * Vitrina del Plano (componente de servidor: TituloEncastre en modo carga y las secciones no
 * mandan JS; solo la muestra "vista" hidrata su isla). Las secciones rompen el `main` angosto de
 * /sistema y llegan a los bordes de la ventana.
 */
export function VitrinaPlano() {
  return (
    <>
      <Bloque titulo={T.titular.titulo} bajada={T.titular.bajada}>
        <div className="grid gap-8">
          <Muestra nombre={T.titular.carga}>
            <TituloEncastre
              texto={T.titular.muestraCarga}
              nivel={4}
              className="text-display font-semibold"
            />
          </Muestra>
          <Muestra nombre={T.titular.letras}>
            <TituloEncastre
              texto={T.titular.muestraLetras}
              nivel={4}
              partir="letras"
              className="text-title font-semibold"
            />
          </Muestra>
          <Muestra nombre={T.titular.vista}>
            <TituloEncastre
              texto={T.titular.muestraVista}
              nivel={4}
              entrada="vista"
              className="text-title font-semibold"
            />
            <p className="text-small text-muted">{T.titular.repetir}</p>
          </Muestra>
        </div>
      </Bloque>

      <Bloque titulo={T.secciones.titulo} bajada={T.secciones.bajada}>
        <div>
          {FONDOS.map((fondo) => {
            const id = `plano-seccion-${fondo}`;
            const c = CLASES_SECCION[fondo];
            const contenido = (
              <div className="grid max-w-2xl gap-4">
                <h4 id={id} className="text-title font-semibold text-balance">
                  {T.secciones.fondos[fondo]}
                </h4>
                <p className={c.secundario}>{T.secciones.texto}</p>
                <div>
                  <a href="#plano" className={buttonClasses('primario')}>
                    {T.secciones.accion}
                  </a>
                </div>
              </div>
            );
            return fondo === 'imagen' ? (
              <Seccion
                key={fondo}
                fondo="imagen"
                aria-labelledby={id}
                imagen={{ fuente: null, alt: '', escena: 'cierre' }}
              >
                {contenido}
              </Seccion>
            ) : (
              <Seccion
                key={fondo}
                fondo={fondo}
                aria-labelledby={id}
                plano={fondo === 'crema' ? undefined : fondo === 'tinta' ? 'cotas' : 'grilla'}
              >
                {contenido}
              </Seccion>
            );
          })}
        </div>
      </Bloque>

      <Bloque titulo={T.imagen.titulo} bajada={T.imagen.bajada}>
        <div className="grid gap-6 lg:grid-cols-3">
          {ESCENAS.map((escena) => (
            <SlotImagen
              key={escena}
              fuente={null}
              alt=""
              escena={escena}
              proporcion={[4, 3]}
              className="rounded-card"
            >
              <p className="p-4 text-small font-semibold">{T.imagen.escenas[escena]}</p>
            </SlotImagen>
          ))}
        </div>
      </Bloque>
    </>
  );
}
