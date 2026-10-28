import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { aFila, type LeadRepository, type LeadRow, type NuevoLead } from './types';

// Una cola de escrituras por archivo: evita que dos requests simultáneos se pisen.
const colas = new Map<string, Promise<unknown>>();

/**
 * Repositorio en archivo JSON (`.data/leads.json`): para desarrollo y E2E sin Supabase.
 * NO sirve en producción serverless (disco efímero): env.ts lo rechaza en Vercel.
 */
export class FileLeadRepository implements LeadRepository {
  private readonly ruta: string;

  constructor(
    ruta: string,
    private readonly ahora: () => Date = () => new Date(),
  ) {
    this.ruta = resolve(process.cwd(), ruta);
  }

  async leer(): Promise<LeadRow[]> {
    try {
      return JSON.parse(await readFile(this.ruta, 'utf8')) as LeadRow[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
  }

  private encolar<T>(tarea: () => Promise<T>): Promise<T> {
    const previa = colas.get(this.ruta) ?? Promise.resolve();
    const siguiente = previa.then(tarea, tarea);
    colas.set(
      this.ruta,
      siguiente.catch(() => undefined),
    );
    return siguiente;
  }

  crear(lead: NuevoLead): Promise<{ id: string }> {
    return this.encolar(async () => {
      const filas = await this.leer();
      const fila = aFila(lead, randomUUID(), this.ahora());
      filas.push(fila);
      await mkdir(dirname(this.ruta), { recursive: true });
      // Escritura atómica: archivo temporal + rename, para no dejar un JSON a medias.
      const temporal = `${this.ruta}.${process.pid}.tmp`;
      await writeFile(temporal, JSON.stringify(filas, null, 2), 'utf8');
      await rename(temporal, this.ruta);
      return { id: fila.id };
    });
  }

  async contarRecientesPorIp(ipHash: string, desde: Date): Promise<number> {
    const filas = await this.leer();
    return filas.filter(
      (l) => l.ip_hash === ipHash && new Date(l.created_at).getTime() >= desde.getTime(),
    ).length;
  }
}
