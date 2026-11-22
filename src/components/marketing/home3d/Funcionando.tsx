import Link from 'next/link';
import { cn } from '@/components/ui/clases';

interface Cliente {
  id: string;
  nombre: string;
  href: string;
}

/**
 * "Funcionando en…": los clientes reales con su sistema en producción (verificados en TRUST_CLAIMS.md),
 * en tipografía (no hay logos autorizados). En el celular corre como marquesina lenta (la copia es
 * decorativa y no se enfoca); en la compu entran quietos en una fila.
 */
export function Funcionando({
  rotulo,
  clientes,
  className,
}: {
  rotulo: string;
  clientes: readonly Cliente[];
  className?: string;
}) {
  const fila = (copia: boolean) => (
    <ul className="h3d-marca-fila" aria-hidden={copia || undefined}>
      {clientes.map((c) => (
        <li key={c.id}>
          <Link href={c.href} prefetch={false} tabIndex={copia ? -1 : undefined}>
            {c.nombre}
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn('h3d-funcionando', className)}>
      <p className="h3d-funcionando-rotulo">{rotulo}</p>
      {/* El script de movimiento le pone .on antes de hidratar. */}
      <div className="h3d-marquesina" data-loop="" suppressHydrationWarning>
        <div className="h3d-marquesina-pista">
          {fila(false)}
          {fila(true)}
        </div>
      </div>
    </div>
  );
}
