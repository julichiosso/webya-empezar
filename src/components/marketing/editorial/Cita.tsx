/** Pull quote: una frase clave a todo el ancho, con autor. */
export function Cita({ texto, autor }: { texto: string; autor: string }) {
  return (
    <figure className="e-wrap">
      <blockquote className="e-h2 max-w-[22ch] font-medium" data-reveal="">
        <p>{texto}</p>
      </blockquote>
      <figcaption className="e-rotulo mt-8 text-ed-muted" data-reveal="">
        {autor}
      </figcaption>
    </figure>
  );
}
