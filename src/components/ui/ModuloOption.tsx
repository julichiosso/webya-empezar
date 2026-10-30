import type { ModuloId } from '@/content/modulos';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { MICROCOPY } from '@/content/microcopy';
import { Eleccion } from './Eleccion';

interface ModuloOptionProps {
  id: ModuloId;
  nombre: string;
  descripcion: string;
  checked: boolean;
  /** El rubro elegido lo sugiere: se aclara para que se entienda por qué ya viene marcado. */
  sugerido: boolean;
  onToggle: (id: ModuloId) => void;
}

/** Módulo activable (checkbox con forma de fila). Envoltorio de `Eleccion` con la API de siempre. */
export function ModuloOption({
  id,
  nombre,
  descripcion,
  checked,
  sugerido,
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
      insignia={sugerido ? MICROCOPY.sugeridoParaTuRubro : undefined}
      icono={<Icon name={id} size={28} draw active={checked} />}
    />
  );
}
