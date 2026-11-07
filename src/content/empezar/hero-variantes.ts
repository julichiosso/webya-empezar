/**
 * Variantes del hero de /empezar para A/B (skill webya-copy-comercial). Se publica UNA: la marcada con
 * `elegida: true`, que es la que está en HERO (content/empezar/hero.ts). Las otras quedan documentadas
 * para probarlas cuando haya tráfico suficiente para medir.
 *
 * Reglas que cumplen las tres: cada línea del titular con hasta 8 palabras, voseo, un solo CTA, sin
 * cifras, clientes ni plazos, y la promesa "todo lo digital" siempre con su salvedad "lo armamos a medida".
 */
export interface VarianteHero {
  id: 'atiende_solo' | 'pieza_por_pieza' | 'objecion_tecnologia';
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
    id: 'atiende_solo',
    formula: 'Resultado en la vida del dueño, sin nombrar la categoría',
    titulo: 'Tu negocio atiende mientras vos trabajás.',
    subtitulo: 'Pedidos, turnos con bot y tu sitio.',
    bajada:
      'Carta con QR y pedidos para gastronomía. Bot de turnos con agenda y estadísticas para peluquerías. Si lo tuyo es otra cosa, lo armamos a medida.',
    cta: 'Crear mi sistema',
    razonamiento:
      'Nombra el dolor real de quien corta el pelo o cocina y no puede contestar el teléfono, y vale igual para los dos productos que ya existen. Dice el resultado y no "sitio" ni "sistema", que suenan a trabajo. Riesgo: en un rubro que solo necesita presencia promete de más; por eso la bajada aclara qué es y dice que lo demás se arma a medida.',
    elegida: true,
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
  {
    id: 'objecion_tecnologia',
    formula: 'Pregunta de objeción',
    titulo: '¿No sabés de tecnología? Mejor.',
    subtitulo: 'Vos contás tu negocio, nosotros lo armamos.',
    bajada: 'Tienda, turnos, carta, pedidos, pagos… y si lo tuyo no está, lo armamos a medida.',
    cta: 'Crear mi sistema',
    razonamiento:
      'Ataca la objeción más común del dueño de un local y suena a persona, no a empresa. Funciona mejor con tráfico de Instagram, que llega sin saber qué es WebYa pero con esa duda. Riesgo: el titular no dice qué se obtiene; todo el peso cae en la bajada, que en celular queda debajo del mockup.',
    elegida: false,
  },
];
