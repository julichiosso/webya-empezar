import { cn } from '@/components/ui/clases';
import { TituloPalabras } from './TituloPalabras';

interface Props {
  rotulo: string;
  titulo: string;
  bajada?: string;
  idTitulo: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Cabeza de capítulo: línea fina que se extiende, rótulo a la izquierda (3 de 12
 * columnas), titular grande a la derecha. En celular se apila.
 */
export function CabezaSeccion({ rotulo, titulo, bajada, idTitulo, className, children }: Props) {
  return (
    <header className={cn('grid grid-cols-12 gap-x-6 gap-y-6', className)}>
      <p className="e-rotulo col-span-12 text-ed-muted md:col-span-3" data-reveal="">
        {rotulo}
      </p>
      <div className="col-span-12 md:col-span-9">
        <TituloPalabras lineas={[titulo]} id={idTitulo} className="e-h2 max-w-[18ch]" />
        {bajada ? (
          <p
            className="e-lead mt-4 max-w-[52ch] text-ed-muted"
            data-reveal=""
            style={{ '--i': 2 } as React.CSSProperties}
          >
            {bajada}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
