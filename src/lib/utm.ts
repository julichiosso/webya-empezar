export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

const MAX_UTM_LENGTH = 100;
const STORAGE_KEY = 'webya:utm';

/** Extrae los UTM de una query string. Solo conserva caracteres razonables y acota el largo. */
export function parseUtm(search: string): Utm {
  const params = new URLSearchParams(search);
  const utm: Utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim().slice(0, MAX_UTM_LENGTH);
    if (value && /^[\w\-.+~% ]+$/u.test(value)) utm[key] = value;
  }
  return utm;
}

/**
 * Captura los UTM de la URL actual y los guarda en sessionStorage para que sobrevivan a una
 * recarga sin parámetros. Los de la URL tienen prioridad sobre los guardados.
 */
export function captureUtm(search: string, storage: Pick<Storage, 'getItem' | 'setItem'>): Utm {
  const fromUrl = parseUtm(search);
  try {
    if (Object.keys(fromUrl).length > 0) {
      storage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const saved = storage.getItem(STORAGE_KEY);
    if (saved) return parseUtm(new URLSearchParams(JSON.parse(saved) as Utm).toString());
  } catch {
    // sessionStorage puede no estar disponible (navegadores in-app, modo privado)
  }
  return fromUrl;
}
