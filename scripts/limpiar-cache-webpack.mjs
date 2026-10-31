// Borra la caché persistente de webpack antes del build de la E2E. En Windows quedó corrupta más de
// una vez después de borrar o mover archivos ("Cannot read properties of undefined (reading
// 'length')" en WasmHash) y el servidor de la E2E no arrancaba. Cuesta unos segundos de build.
import { rmSync } from 'node:fs';

rmSync('.next/cache/webpack', { recursive: true, force: true });
