import { Anuncios } from './Anuncios';
import { BarraCelular } from './BarraCelular';
import { Encabezado, ID_PRINCIPAL } from './Encabezado';
import { Pie } from './Pie';
import { SugerenciasDiferidas } from './SugerenciasDiferidas';

/**
 * Esqueleto de toda página del sitio: header, contenido, pie y la barra de atajos del celular (salvo
 * donde la página ya tiene la suya, como el configurador) con las sugerencias según la sección.
 */
export function Pagina({ children, barra = true }: { children: React.ReactNode; barra?: boolean }) {
  return (
    <>
      <div aria-hidden="true" className="e-progreso-lectura" />
      <Anuncios />
      <Encabezado />
      <main id={ID_PRINCIPAL} tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Pie />
      {barra ? <BarraCelular /> : null}
      {barra ? <SugerenciasDiferidas /> : null}
    </>
  );
}
