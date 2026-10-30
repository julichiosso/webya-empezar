import { ESTADO_MODULO_UI } from '@/content/estados-modulo';
import type { NotaPendiente } from '@/content/modulos';

interface NotasPendientesProps {
  notas: readonly NotaPendiente[];
  className?: string;
}

/**
 * Lo que todavía no está confirmado de un grupo de módulos (los `TODO:` visibles), dicho UNA vez y
 * agrupado por nota, debajo del catálogo. Antes se repetía igual en cada tarjeta y ensuciaba la
 * lectura, sobre todo en el celular.
 */
export function NotasPendientes({ notas, className }: NotasPendientesProps) {
  if (notas.length === 0) return null;
  return (
    <div
      data-todo
      className={`rounded-card border border-dashed border-line-strong p-4 text-small text-subtle ${className ?? ''}`.trim()}
    >
      <p className="font-medium text-muted">{ESTADO_MODULO_UI.pendientes}</p>
      <ul className="mt-2 flex flex-col gap-2">
        {notas.map(({ nota, nombres }) => (
          <li key={nota}>{ESTADO_MODULO_UI.notaAgrupada(nombres, nota)}</li>
        ))}
      </ul>
    </div>
  );
}
