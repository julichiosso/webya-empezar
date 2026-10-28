const PASOS = [
  {
    titulo: 'Contanos qué hacés',
    texto: 'Elegís tu rubro y lo que querés lograr. Son cuatro pasos y se hacen desde el celular.',
  },
  {
    titulo: 'Te armamos la propuesta',
    texto:
      'Con lo que nos contás, preparamos lo que tu negocio necesita y te escribimos por WhatsApp.',
  },
  {
    titulo: 'Lo ponemos en marcha',
    texto: 'Lo revisamos juntos, ajustamos lo que haga falta y lo dejamos funcionando.',
  },
] as const;

export function ComoFunciona() {
  return (
    <section aria-labelledby="como-title" className="reveal pt-24">
      <h2 id="como-title" className="text-title font-semibold text-balance">
        Cómo funciona
      </h2>
      <ol className="mt-8 flex flex-col">
        {PASOS.map((p, i) => (
          <li key={p.titulo} className="flex gap-4 border-t border-line py-6 first:border-t-0">
            <span
              aria-hidden="true"
              className="tabular flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-body font-semibold"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-heading font-semibold">{p.titulo}</h3>
              <p className="mt-2 text-muted">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
