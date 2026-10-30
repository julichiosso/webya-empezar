/**
 * Variantes del hero de /empezar para A/B (skill webya-copy-comercial). Se publica UNA: la marcada con
 * `elegida: true`, que es la que está en HERO (content/empezar/hero.ts). Las otras quedan documentadas
 * para probarlas cuando haya tráfico suficiente para medir.
 *
 * Reglas que cumplen las tres: cada línea del titular con hasta 8 palabras, voseo, un solo CTA, sin
 * cifras, clientes ni plazos, y la promesa "todo lo digital" siempre con su salvedad "lo armamos a medida".
 */
export interface VarianteHero {
  id: 'todo_lo_digital' | 'pieza_por_pieza' | 'objecion_tecnologia';
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
    id: 'todo_lo_digital',
    formula: 'Resultado + para quién, con la salvedad en el mismo titular',
    titulo: 'Todo lo digital para tu negocio.',
    subtitulo: 'Y si no está, lo armamos a medida.',
    bajada:
      'Tienda, turnos, carta con QR, pedidos y pagos. Activá solo lo que usás y lo armamos con vos.',
    cta: 'Empezar a crear',
    razonamiento:
      'Dice en cinco segundos qué es WebYa (el lugar donde un negocio consigue lo digital) y responde en la misma frase la duda que genera "todo": si no está, se arma. La bajada baja la promesa a cosas que se pueden tocar. Riesgo: "todo lo digital" suena amplio; por eso la salvedad va en el titular y no en letra chica.',
    elegida: true,
  },
  {
    id: 'pieza_por_pieza',
    formula: 'Acción + objeto + facilidad',
    titulo: 'Armá tu negocio online, pieza por pieza.',
    subtitulo: 'Lo que no esté, lo hacemos a medida.',
    bajada: 'Elegí tu rubro, activá lo que necesitás y lo armamos con vos.',
    cta: 'Empezar a crear',
    razonamiento:
      'Es el concepto Encastre dicho tal cual y conversa con el mockup de al lado, donde las piezas se activan. Es la más cercana al hero anterior ("Creá tu negocio online"), así que es la de menor riesgo. Pierde la amplitud de "todo lo digital": alguien que busca un sistema o una automatización puede pensar que solo hacemos webs.',
    elegida: false,
  },
  {
    id: 'objecion_tecnologia',
    formula: 'Pregunta de objeción',
    titulo: '¿No sabés de tecnología? Mejor.',
    subtitulo: 'Vos contás tu negocio, nosotros lo armamos.',
    bajada:
      'Tienda, turnos, carta, pedidos, pagos… y si lo tuyo no está, lo armamos a medida.',
    cta: 'Empezar a crear',
    razonamiento:
      'Ataca la objeción más común del dueño de un local y suena a persona, no a empresa. Funciona mejor con tráfico de Instagram, que llega sin saber qué es WebYa pero con esa duda. Riesgo: el titular no dice qué se obtiene; todo el peso cae en la bajada, que en celular queda debajo del mockup.',
    elegida: false,
  },
];
