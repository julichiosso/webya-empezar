import type { EstadoModulo, ModuloId } from '@/content/modulos';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { Eleccion } from './Eleccion';

interface ModuloOptionProps {
  id: ModuloId;
  nombre: string;
  descripcion: string;
  checked: boolean;
  /** Por qué ya viene marcado ("Sugerido para tu rubro", "Va con lo que necesitás"), desde content. */
  insignia?: string;
  /** Estado honesto del módulo: `proximamente` lo deshabilita. */
  estado?: EstadoModulo;
  /** El estado dicho en palabras, con su aclaración pendiente si la tiene (desde content). */
  textoEstado?: string;
  onToggle: (id: ModuloId) => void;
}

/** Módulo activable (checkbox con forma de fila). Envoltorio de `Eleccion` con la API de siempre. */
export function ModuloOption({
  id,
  nombre,
  descripcion,
  checked,
  insignia,
  estado,
  textoEstado,
  onToggle,
}: ModuloOptionProps) {
  return (
    <Eleccion
      tipo="multiple"
      forma="fila"
      value={id}
      checked={checked}
      onCambio={() => onToggle(id)}
      etiqueta={nombre}
      descripcion={descripcion}
      insignia={insignia}
      estadoModulo={estado}
      textoEstado={textoEstado}
      icono={<Icon name={id} size={28} draw active={checked} />}
    />
  );
}
