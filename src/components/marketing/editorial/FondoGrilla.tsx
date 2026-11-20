/**
 * Fondo técnico de las secciones claras: una grilla fina con marcas en las intersecciones, como un plano
 * de ingeniería. Negro muy tenue, sin color; se desvanece hacia los bordes. Detrás del contenido y oculto
 * a lectores. La sección que lo usa lleva `e-con-fondo`.
 */
export function FondoGrilla() {
  return <span aria-hidden="true" className="e-fondo-grilla" />;
}
