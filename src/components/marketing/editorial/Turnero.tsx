import { MOCKUPS } from '@/content/mockups';
import { SECCIONES, TURNERO } from '@/content/home';
import { Boton } from './Boton';
import { CabezaSeccion } from './CabezaSeccion';
import { PasosTurnero } from './PasosTurnero';

/**
 * Turnero con seña: los cinco pasos en una sola pantalla (lista + teléfono que muestra el activo). Antes
 * era un recorrido con scroll de cinco pantallas: ahora se entiende de un vistazo.
 */
export function Turnero({ numero = 2, conCta = true }: { numero?: number; conCta?: boolean }) {
  const S = SECCIONES.turnero;
  return (
    <section id={S.id} className="tono-oscuro e-seccion" aria-labelledby="titulo-turnero">
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={S.rotulo}
          titulo={S.titulo}
          idTitulo="titulo-turnero"
        />
        <div className="mt-10 md:mt-14">
          <PasosTurnero pasos={TURNERO.pasos} etiqueta={MOCKUPS.turnero.alt} />
        </div>
        <div className="mt-10 grid grid-cols-12 gap-6 border-t border-ed-line pt-8">
          <p className="e-lead col-span-12 flex items-start gap-3 md:col-span-7">
            <span className="e-punto mt-2.5" aria-hidden="true" />
            <span>{TURNERO.prueba}</span>
          </p>
          {conCta ? (
            <div className="col-span-12 flex flex-col gap-3 sm:flex-row md:col-span-5 md:justify-end">
              <Boton href="#armar" armar="turnero">
                {TURNERO.cta}
              </Boton>
              <Boton href="/demo/turnos" variante="secundario" externo>
                {TURNERO.demo}
              </Boton>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
