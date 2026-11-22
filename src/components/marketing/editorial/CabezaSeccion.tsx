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
 * Cabeza de sección centrada, como en la página de un producto: el rótulo chico arriba, el titular
 * grande y, si hace falta, una línea de bajada.
 */
export function CabezaSeccion({ rotulo, titulo, bajada, idTitulo, className, children }: Props) {
  return (
    <header className={cn('flex flex-col items-center text-center', className)}>
      <p className="a-ceja text-ed-muted" data-reveal="">
        {rotulo}
      </p>
      <TituloPalabras lineas={[titulo]} id={idTitulo} className="a-titulo mt-2 max-w-[20ch]" />
      {bajada ? (
        <p
          className="a-sub mt-3 max-w-[36ch] text-ed-muted"
          data-reveal=""
          style={{ '--i': 2 } as React.CSSProperties}
        >
          {bajada}
        </p>
      ) : null}
      {children}
    </header>
  );
}
