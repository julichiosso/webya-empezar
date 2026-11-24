import { Anuncios } from './Anuncios';
import { BotonAsistente } from '../asistente/BotonAsistente';
import { Encabezado, ID_PRINCIPAL } from './Encabezado';
import { Pie } from './Pie';
import { SugerenciasDiferidas } from './SugerenciasDiferidas';
import { TecladoAbierto } from './TecladoAbierto';

/**
 * Esqueleto de toda página del sitio: header, contenido, pie y el asistente flotante (salvo
 * donde la página ya tiene la suya, como el configurador) con las sugerencias según la sección.
 */
export function Pagina({
  children,
  barra = true,
  headerEncima = false,
}: {
  children: React.ReactNode;
  barra?: boolean;
  /** La primera sección pasa por debajo del header transparente (la home). */
  headerEncima?: boolean;
}) {
  return (
    // Base blanca: el header transparente deja ver lo que pasa debajo, nunca el fondo oscuro global.
    <div className="tono-claro">
      <div aria-hidden="true" className="e-progreso-lectura" />
      <Anuncios />
      <Encabezado encima={headerEncima} />
      <main id={ID_PRINCIPAL} tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Pie />
      {barra ? <TecladoAbierto /> : null}
      {barra ? <BotonAsistente /> : null}
      {barra ? <SugerenciasDiferidas /> : null}
    </div>
  );
}
