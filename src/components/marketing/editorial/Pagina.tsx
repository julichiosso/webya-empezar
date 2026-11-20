import { BarraCelular } from './BarraCelular';
import { Encabezado, ID_PRINCIPAL } from './Encabezado';
import { Pie } from './Pie';

/**
 * Esqueleto de toda página del sitio: header, contenido, pie y la barra de atajos del celular (salvo
 * donde la página ya tiene la suya, como el configurador).
 */
export function Pagina({ children, barra = true }: { children: React.ReactNode; barra?: boolean }) {
  return (
    <>
      <Encabezado />
      <main id={ID_PRINCIPAL} tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Pie />
      {barra ? <BarraCelular /> : null}
    </>
  );
}
