/**
 * Preguntas frecuentes de /empezar. Texto plano (sin JSX) para poder reutilizarlo en el JSON-LD
 * de SEO. Regla: respuestas honestas; no se promete nada que el producto todavía no cumpla.
 */
import { PRECIO_SIN_DEFINIR } from '@/content/precios';

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export const FAQ: readonly Pregunta[] = [
  {
    pregunta: '¿Cuánto cuesta?',
    respuesta: PRECIO_SIN_DEFINIR,
  },
  {
    pregunta: '¿Cuánto tarda?',
    respuesta:
      'Elegir tu rubro y ver cómo queda lleva unos minutos. La puesta online la coordinamos por WhatsApp.',
  },
  {
    pregunta: '¿Puedo usar mi propio dominio?',
    respuesta: 'Contanos cuál es y lo vemos juntos.',
  },
  {
    pregunta: '¿Qué hacen con mis datos?',
    respuesta:
      'Los usamos solo para contactarte por tu negocio. No los compartimos ni los vendemos. Está todo en la política de privacidad.',
  },
  {
    pregunta: '¿Y si lo que necesito no está?',
    respuesta: 'Contanos qué te falta en "Otra cosa". Si se puede hacer, lo armamos con vos.',
  },
];
