import { z } from 'zod';

/**
 * zod 4 compila validadores con `new Function` y, para saber si puede, prueba `Function("")` apenas
 * se usa. La CSP no tiene 'unsafe-eval' (y no la va a tener): el navegador lo bloquea y lo reporta
 * como violación (Lighthouse "Buenas prácticas" 96 en la demo). `jitless` saltea la prueba y valida
 * sin compilar: para formularios de pocos campos la diferencia de velocidad no se nota.
 * Se importa antes de construir cualquier esquema (domain/leads, domain/pedidos).
 */
z.config({ jitless: true });
