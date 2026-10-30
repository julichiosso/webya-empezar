import type { InputHTMLAttributes, Ref, TextareaHTMLAttributes } from 'react';
import { Campo, CampoArea } from './Campo';

/** API anterior de los campos (en inglés). Siguen funcionando: son envoltorios de `Campo`. */
interface FieldProps {
  label: string;
  hint?: string;
  /** Mensaje de error ya redactado para la persona (amable y específico). */
  error?: string;
  /** Muestra "Opcional" junto a la etiqueta. */
  optional?: boolean;
  /** Campo ya tocado y válido: muestra el check de éxito. */
  valid?: boolean;
}

type InputProps = FieldProps &
  InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> };

export function Input({ label, hint, error, optional, valid, ...rest }: InputProps) {
  return (
    <Campo
      etiqueta={label}
      ayuda={hint}
      error={error}
      opcional={optional}
      valido={valid}
      {...rest}
    />
  );
}

type TextareaProps = FieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> };

export function Textarea({ label, hint, error, optional, valid, ...rest }: TextareaProps) {
  return (
    <CampoArea
      etiqueta={label}
      ayuda={hint}
      error={error}
      opcional={optional}
      valido={valid}
      {...rest}
    />
  );
}
