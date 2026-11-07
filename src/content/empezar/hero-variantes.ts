/**
 * Variantes del hero de /empezar para A/B (skill webya-copy-comercial). Se publica UNA: la marcada con
 * `elegida: true`, que es la que está en HERO (content/empezar/hero.ts). Las otras quedan documentadas
 * para probarlas cuando haya tráfico suficiente para medir.
 *
 * Reglas que cumplen las tres: cada línea del titular con hasta 8 palabras, voseo, un solo CTA, sin
 * cifras, clientes ni plazos, y la promesa "todo lo digital" siempre con su salvedad "lo armamos a medida".
 */
export interface VarianteHero {
  id: 'parte_digital' | 'atiende_solo' | 'pieza_por_pieza';
  /** Fórmula de titular que usa (webya-copy-comercial → "Fórmulas de titular"). */
  formula: string;
  titulo: string;
  subtitulo: string;
  bajada: string;
  cta: string;
  /** Por qué podría ganar y qué arriesga. */
  razonamiento: string;
  elegida: boolean;
}

export const HERO_VARIANTES: readonly VarianteHero[] = [
  {
    id: 'parte_digital',
    formula: 'Quiénes somos + qué lugar ocupamos en tu negocio',
    titulo: 'Somos la parte digital de tu negocio.',
    subtitulo: 'Sitios, cartas, pedidos y turnos que funcionan.',
    bajada:
      'WebYa diseña, programa y deja andando lo que tu negocio necesita. Hablás con una persona y nada sale online sin tu visto bueno.',
    cta: 'Crear mi sistema',
    razonamiento:
      'Dice que WebYa es una empresa y qué hace, en vez de sonar a herramienta o a formulario: es lo que el dueño pidió después de ver el hero anterior. Se apoya en los sitios reales de los clientes, que están a la vista en la misma pantalla. Riesgo: "digital" es una palabra genérica; por eso el subtítulo la baja a cosas concretas.',
    elegida: true,
  },
  {
    id: 'atiende_solo',
    formula: 'Resultado en la vida del dueño, sin nombrar la categoría',
    titulo: 'Tu negocio atiende mientras vos trabajás.',
    subtitulo: 'Pedidos, turnos con bot y tu sitio.',
    bajada:
      'Carta con QR y pedidos para gastronomía. Bot de turnos con agenda y estadísticas para peluquerías. Si lo tuyo es otra cosa, lo armamos a medida.',
    cta: 'Crear mi sistema',
    razonamiento:
      'Nombra el dolor real de quien corta el pelo o cocina y no puede contestar el teléfono, y vale igual para los dos productos que ya existen. Dice el resultado y no "sitio" ni "sistema", que suenan a trabajo. Riesgo: en un rubro que solo necesita presencia promete de más; por eso la bajada aclara qué es y dice que lo demás se arma a medida.',
    elegida: false,
  },
  {
    id: 'pieza_por_pieza',
    formula: 'Acción + objeto + facilidad',
    titulo: 'Armá tu negocio online, pieza por pieza.',
    subtitulo: 'Lo que no esté, lo hacemos a medida.',
    bajada: 'Elegí tu rubro, activá lo que necesitás y lo armamos con vos.',
    cta: 'Crear mi sistema',
    razonamiento:
      'Es el concepto Encastre dicho tal cual y conversa con el mockup de al lado, donde las piezas se activan. Es la más cercana al hero anterior ("Creá tu negocio online"), así que es la de menor riesgo. Pierde la amplitud de "todo lo digital": alguien que busca un sistema o una automatización puede pensar que solo hacemos webs.',
    elegida: false,
  },
];
