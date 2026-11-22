import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { HOME3D } from '@/brand/tokens/colores';
import { GRILLA_FRAGMENTO, GRILLA_VERTICE } from '@/lib/home3d/grilla.glsl';
import { PIEZAS, extruir, formaCorchete, formaW } from './geometria';
import { ASPECTO } from './progreso';
import { texturaCepillado } from './textura';

export interface OpcionesEscena {
  /** Progreso de los tres estados (0 Creá, 0,5 Digitalizá, 1 Crecé). Se lee en cada cuadro. */
  progreso: () => number;
  /** Fondo transparente y sin movimiento propio: para renderizar los posters. */
  captura?: boolean;
  /** Llamado después del primer cuadro dibujado (el poster se puede esconder). */
  alPintar?: () => void;
  /** Llamado si el rendimiento no alcanza ni con la calidad mínima: vuelve el poster. */
  alRendirse?: () => void;
}

export interface Escena {
  destruir: () => void;
  /** Para pruebas y capturas: dibuja ya, con el progreso dado. */
  dibujar: (p?: number) => void;
}

const suave = (a: number, b: number, x: number) => MathUtils.smoothstep(x, a, b);


/** Grilla fina en espacio de objeto: el "modo digital" que aparece sobre el metal. */
function materialGrilla(cantidad: { value: number }): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
    uniforms: {
      uCantidad: cantidad,
      uColor: { value: new Color(HOME3D.grilla) },
    },
    vertexShader: GRILLA_VERTICE,
    fragmentShader: GRILLA_FRAGMENTO,
  });
}

/**
 * Monta la escena del símbolo `<w>` en el canvas y devuelve cómo destruirla. three.js puro (sin React):
 * el componente que la usa la importa diferida, después de que la página es interactiva.
 */
export function montarEscena(canvas: HTMLCanvasElement, op: OpcionesEscena): Escena {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: !!op.captura,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  let dprMax = Math.min(window.devicePixelRatio || 1, op.captura ? 2 : 1.75);
  renderer.setPixelRatio(dprMax);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = entorno;
  scene.environmentIntensity = 1.25;

  // El canvas siempre mide 16:10 (igual que el poster): a esta distancia entran 8 unidades a lo ancho.
  const camara = new PerspectiveCamera(24, ASPECTO, 0.1, 100);
  camara.position.set(0, 0, 11.8);

  const clave = new DirectionalLight(0xffffff, 1.6);
  clave.position.set(-4, 6, 8);
  scene.add(clave);
  // Contraluz: dibuja el canto del bisel contra el fondo claro.
  const contra = new DirectionalLight(0xffffff, 2.2);
  contra.position.set(6, 2, -6);
  scene.add(contra);
  // La "marca" del puntero: una luz cálida que se mueve por delante del metal.
  const luz = new PointLight(new Color(HOME3D.luzPuntero), 0, 9, 1.6);
  luz.position.set(0, 0, 3.2);
  scene.add(luz);

  const textura = texturaCepillado();
  textura.repeat.set(0.9, 0.9);
  const metal = new MeshPhysicalMaterial({
    color: new Color(HOME3D.metal),
    metalness: 0.9,
    roughness: 0.3,
    roughnessMap: textura,
    bumpMap: textura,
    bumpScale: 0.35,
    clearcoat: 0.35,
    clearcoatRoughness: 0.5,
  });
  const cantidadGrilla = { value: 0 };
  const grilla = materialGrilla(cantidadGrilla);
  const bordes = new LineBasicMaterial({
    color: new Color(HOME3D.grilla),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });

  const formas = [formaCorchete(false), formaW(), formaCorchete(true)];
  const grupo = new Group();
  scene.add(grupo);
  const piezas = formas.map((f) => {
    const geo = extruir(f);
    const pieza = new Group();
    pieza.add(new Mesh(geo, metal));
    pieza.add(new Mesh(geo, grilla));
    const aristas = new EdgesGeometry(geo, 25);
    pieza.add(new LineSegments(aristas, bordes));
    grupo.add(pieza);
    return { pieza, geo, aristas };
  });

  // Puntero (−1 a 1) y arrastre táctil, suavizados.
  const puntero = new Vector2();
  const suavizado = new Vector2();
  let arrastre = 0;
  let arrastreSuave = 0;
  let luzSuave = 0;
  let dentro = false;
  const alMover = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    if (e.pointerType === 'mouse') {
      puntero.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
      dentro = true;
    }
  };
  const alSalir = () => {
    dentro = false;
    puntero.set(0, 0);
  };
  let toqueX: number | null = null;
  const alTocar = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') toqueX = e.clientX;
  };
  const alArrastrar = (e: PointerEvent) => {
    if (toqueX === null) return;
    arrastre = MathUtils.clamp(arrastre + (e.clientX - toqueX) / 260, -0.9, 0.9);
    toqueX = e.clientX;
  };
  const alSoltar = () => {
    toqueX = null;
  };
  // El mouse se escucha en toda la ventana (el canvas no captura nada); el toque, solo sobre el canvas y
  // con `touch-action: pan-y`, así el scroll vertical de la página nunca se bloquea.
  window.addEventListener('pointermove', alMover, { passive: true });
  document.addEventListener('pointerleave', alSalir);
  canvas.addEventListener('pointerdown', alTocar, { passive: true });
  canvas.addEventListener('pointermove', alArrastrar, { passive: true });
  window.addEventListener('pointerup', alSoltar, { passive: true });
  canvas.addEventListener('pointercancel', alSoltar, { passive: true });

  let ancho = 0;
  let alto = 0;
  const medir = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === ancho && h === alto) return;
    ancho = w;
    alto = h;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(medir);
  ro.observe(canvas);
  medir();

  const t0 = performance.now();
  function pose(p: number, t: number) {
    const separar = 1 - suave(0.02, 0.5, p);
    const digital = suave(0.18, 0.45, p) * (1 - suave(0.62, 0.9, p));
    const crecer = suave(0.62, 1, p);
    piezas.forEach(({ pieza }, i) => {
      const a = PIEZAS.armado[i]!;
      const s = PIEZAS.separado[i]!;
      const flota = op.captura ? 0 : Math.sin(t * 0.0006 + i * 2.1) * 0.08 * (0.4 + separar);
      pieza.position.set(
        MathUtils.lerp(a.x, s.x, separar),
        MathUtils.lerp(a.y, s.y, separar) + flota,
        MathUtils.lerp(a.z, s.z, separar),
      );
      pieza.rotation.set(
        MathUtils.lerp(a.rx, s.rx, separar),
        MathUtils.lerp(a.ry, s.ry, separar),
        MathUtils.lerp(a.rz, s.rz, separar),
      );
    });
    cantidadGrilla.value = digital;
    bordes.opacity = digital * 0.9;
    const escala = 1 + crecer * 0.08;
    grupo.scale.setScalar(escala);
    // Giro lento en reposo + puntero + arrastre.
    const reposo = op.captura ? 0 : Math.sin(t * 0.00025) * 0.12;
    suavizado.lerp(puntero, 0.06);
    arrastreSuave += (arrastre - arrastreSuave) * 0.08;
    arrastre *= 0.985;
    grupo.rotation.y = reposo + suavizado.x * 0.32 + arrastreSuave * 0.6 - 0.12 * (1 - p);
    grupo.rotation.x = -suavizado.y * 0.18 + 0.06;
    luzSuave += ((dentro ? 26 : 0) - luzSuave) * 0.05;
    luz.intensity = luzSuave;
    luz.position.x = suavizado.x * 4.2;
    luz.position.y = suavizado.y * 2.4;
  }

  let visible = true;
  let pestana = !document.hidden;
  let raf = 0;
  let pintado = false;
  // Calidad adaptativa: si 40 cuadros seguidos promedian más de 28 ms, baja la resolución; si ni así,
  // se rinde (vuelve el poster). Sin librerías: es lo que hace PerformanceMonitor.
  let previo = 0;
  let acumulado = 0;
  let cuadros = 0;
  let bajadas = 0;
  function cuadro(t: number) {
    raf = requestAnimationFrame(cuadro);
    if (previo) {
      acumulado += t - previo;
      cuadros++;
      if (cuadros === 40) {
        if (acumulado / cuadros > 28) {
          bajadas++;
          if (bajadas > 2) {
            op.alRendirse?.();
            return;
          }
          dprMax = Math.max(0.75, dprMax * 0.7);
          renderer.setPixelRatio(dprMax);
          ancho = 0;
          medir();
        }
        acumulado = 0;
        cuadros = 0;
      }
    }
    previo = t;
    pose(MathUtils.clamp(op.progreso(), 0, 1), t - t0);
    renderer.render(scene, camara);
    if (!pintado) {
      pintado = true;
      op.alPintar?.();
    }
  }
  const actualizar = () => {
    const corre = visible && pestana && !op.captura;
    if (corre && !raf) {
      previo = 0;
      raf = requestAnimationFrame(cuadro);
    } else if (!corre && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  const io = new IntersectionObserver((entradas) => {
    visible = entradas[0]?.isIntersecting ?? visible;
    actualizar();
  });
  io.observe(canvas);
  const alCambiarPestana = () => {
    pestana = !document.hidden;
    actualizar();
  };
  document.addEventListener('visibilitychange', alCambiarPestana);
  actualizar();

  const dibujar = (p = op.progreso()) => {
    medir();
    pose(p, 0);
    renderer.render(scene, camara);
    if (!pintado) {
      pintado = true;
      op.alPintar?.();
    }
  };
  if (op.captura) dibujar();

  return {
    dibujar,
    destruir() {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', alCambiarPestana);
      window.removeEventListener('pointermove', alMover);
      document.removeEventListener('pointerleave', alSalir);
      canvas.removeEventListener('pointerdown', alTocar);
      canvas.removeEventListener('pointermove', alArrastrar);
      window.removeEventListener('pointerup', alSoltar);
      canvas.removeEventListener('pointercancel', alSoltar);
      piezas.forEach(({ geo, aristas }) => {
        geo.dispose();
        aristas.dispose();
      });
      metal.dispose();
      grilla.dispose();
      bordes.dispose();
      textura.dispose();
      entorno.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
