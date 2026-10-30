import { useId, type ReactNode } from 'react';
import type { ContratoEleccion } from './contratos';
import { cn, TOQUE_GRUPO } from './clases';
import { Encaje } from './Encaje';
import { Spinner } from './Spinner';

type Forma = ContratoEleccion['forma'];

interface EleccionProps extends ContratoEleccion {
  /** Mismo `name` para todas las opciones de un grupo `unica` (flechas de teclado nativas). */
  name?: string;
  value: string;
  checked: boolean;
  onCambio: (value: string, checked: boolean) => void;
  /** Ícono o arte (decorativo): lo pinta la opción según su estado. */
  icono?: ReactNode;
  /** Explica el estado del módulo ("Próximamente", "En demo"…), desde content. */
  textoEstado?: string;
  /** Error propio de esta opción. El error de todo el grupo va en `GrupoEleccion`. */
  error?: string;
  /** Esperando confirmación (p. ej. guardando): no acepta cambios y lo anuncia (aria-busy). */
  cargando?: boolean;
  className?: string;
}

const FORMAS: Record<Forma, string> = {
  tarjeta:
    'pop-on flex h-full min-h-32 flex-col justify-between gap-4 rounded-card p-4 shadow-raised',
  fila: 'pop-on flex h-full items-start gap-4 rounded-card p-4',
  chip: 'inline-flex min-h-tap items-center gap-2 rounded-full py-2 pr-6 pl-4 text-body font-medium',
};

const ETIQUETAS: Record<Forma, string> = {
  tarjeta: 'block text-body leading-tight font-semibold text-balance',
  fila: 'block font-semibold',
  chip: 'inline',
};

/**
 * Opción elegible (radio o checkbox nativo) con forma de tarjeta, fila o chip. El input real está
 * oculto pero es el que recibe foco y teclado (Espacio; flechas en un grupo `unica`); la forma se
 * pinta según el estado y el único indicador de selección es la pieza de `Encaje`.
 * Nombre accesible = `etiqueta`; descripción, insignia, estado del módulo y error se asocian con
 * aria-describedby. `estadoModulo='proximamente'` deshabilita la opción, la muestra como hueco
 * punteado y explica por qué con `textoEstado`.
 */
export function Eleccion({
  tipo,
  forma,
  etiqueta,
  descripcion,
  insignia,
  estadoModulo,
  deshabilitado,
  name,
  value,
  checked,
  onCambio,
  icono,
  textoEstado,
  error,
  cargando,
  className,
}: EleccionProps) {
  const id = useId();
  const proximamente = estadoModulo === 'proximamente';
  const bloqueado = Boolean(deshabilitado) || proximamente;
  const activo = checked && !proximamente;
  const ids = {
    etiqueta: `${id}-etiqueta`,
    descripcion: descripcion ? `${id}-descripcion` : undefined,
    insignia: insignia ? `${id}-insignia` : undefined,
    estado: textoEstado ? `${id}-estado` : undefined,
    error: error ? `${id}-error` : undefined,
  };

  const borde = error
    ? 'border-control-error bg-tarjeta-fondo'
    : activo
      ? 'border-seleccion-borde bg-seleccion-fondo'
      : proximamente
        ? 'border-dashed border-hueco-borde bg-transparent'
        : 'border-tarjeta-borde bg-tarjeta-fondo';

  const esChip = forma === 'chip';
  const pieza = cargando ? (
    <span className="flex size-6 shrink-0 items-center justify-center text-muted">
      <Spinner tamanio={esChip ? 18 : 20} />
    </span>
  ) : (
    <Encaje
      on={activo}
      size={esChip ? 'sm' : 'md'}
      className={forma === 'tarjeta' ? 'absolute top-4 right-4' : undefined}
    />
  );

  const textos = (
    <>
      <span id={ids.etiqueta} className={cn(ETIQUETAS[forma], proximamente && 'text-muted')}>
        {etiqueta}
      </span>
      {descripcion && (
        <span
          id={ids.descripcion}
          className={cn('text-small text-muted', esChip ? 'sr-only' : 'mt-1 block')}
        >
          {descripcion}
        </span>
      )}
      {insignia && (
        <span
          id={ids.insignia}
          className={cn('text-small font-medium text-fg', esChip ? 'sr-only' : 'mt-2 block')}
        >
          {insignia}
        </span>
      )}
      {textoEstado && (
        <span
          id={ids.estado}
          className={cn('text-small font-medium text-muted', esChip ? 'sr-only' : 'mt-2 block')}
        >
          {textoEstado}
        </span>
      )}
      {error && (
        <span id={ids.error} className="mt-2 block text-small text-danger">
          {error}
        </span>
      )}
    </>
  );

  return (
    <label
      data-forma={forma}
      data-estado-modulo={estadoModulo}
      className={cn(
        'group relative',
        esChip ? 'block' : 'block h-full',
        bloqueado ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type={tipo === 'unica' ? 'radio' : 'checkbox'}
        name={name}
        value={value}
        checked={activo}
        disabled={bloqueado}
        aria-labelledby={ids.etiqueta}
        aria-describedby={cn(ids.descripcion, ids.insignia, ids.estado, ids.error) || undefined}
        aria-invalid={error ? true : undefined}
        aria-busy={cargando || undefined}
        onChange={(e) => {
          if (cargando || bloqueado) return;
          onCambio(value, e.target.checked);
        }}
        className="peer sr-only"
      />
      <span
        data-on={activo}
        className={cn(
          'border',
          FORMAS[forma],
          borde,
          !bloqueado && !cargando && TOQUE_GRUPO,
          !bloqueado && !cargando && !activo && !error && 'group-hover:border-line-strong',
          deshabilitado && 'opacity-45',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foco',
        )}
      >
        {esChip && pieza}
        {icono && (
          <span
            className={cn(
              'flex shrink-0',
              // Ajuste óptico de 2 px: el ícono de 28 alinea con la primera línea del texto.
              forma === 'fila' && 'mt-0.5',
              activo ? 'text-accent' : proximamente ? 'text-muted' : 'text-fg',
            )}
          >
            {icono}
          </span>
        )}
        {esChip ? textos : <span className="min-w-0 flex-1">{textos}</span>}
        {forma === 'fila' && pieza}
      </span>
      {forma === 'tarjeta' && pieza}
    </label>
  );
}

interface GrupoEleccionProps {
  tipo: ContratoEleccion['tipo'];
  /** Nombre del grupo (legend). */
  leyenda: string;
  /** Si la leyenda ya está escrita como título del paso, se oculta visualmente (sigue nombrando). */
  leyendaOculta?: boolean;
  ayuda?: string;
  /** Error de todo el grupo ("Elegí al menos un módulo"): se anuncia y se asocia al grupo. */
  error?: string;
  /** Clases de la grilla o fila que acomoda las opciones. */
  claseLista?: string;
  className?: string;
  children: ReactNode;
}

/** Grupo de opciones: fieldset + legend (radiogroup si es `unica`), con ayuda y error anunciados. */
export function GrupoEleccion({
  tipo,
  leyenda,
  leyendaOculta,
  ayuda,
  error,
  claseLista,
  className,
  children,
}: GrupoEleccionProps) {
  const id = useId();
  return (
    <fieldset
      role={tipo === 'unica' ? 'radiogroup' : undefined}
      aria-describedby={cn(ayuda && `${id}-ayuda`, error && `${id}-error`) || undefined}
      className={className}
    >
      <legend className={leyendaOculta ? 'sr-only' : 'mb-2 text-small font-medium'}>
        {leyenda}
      </legend>
      {ayuda && (
        <p id={`${id}-ayuda`} className="mb-4 text-small text-control-ayuda">
          {ayuda}
        </p>
      )}
      <div className={claseLista}>{children}</div>
      {/* La región vive siempre en el DOM para que los lectores anuncien el error cuando aparece. */}
      <div id={`${id}-error`} aria-live="polite">
        {error && <p className="mt-2 text-small text-control-error">{error}</p>}
      </div>
    </fieldset>
  );
}
