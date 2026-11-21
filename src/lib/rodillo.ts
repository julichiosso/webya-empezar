/** Alto de cada renglón del rodillo, en em. */
const RENGLON = 1.15;

/**
 * Keyframes del rodillo y del pulso de los puntos, calculados para la cantidad de localidades: cada nombre
 * se queda quieto el 80 % de su turno y sube al siguiente con una curva firme. El punto de esa localidad se
 * enciende en el mismo turno. Un solo reloj para los dos: quedan sincronizados sin JavaScript.
 */
export function keyframesRodillo(n: number): string {
  const turno = 100 / n;
  const curva = 'animation-timing-function:cubic-bezier(.7,0,.2,1)';
  let rodillo = '';
  for (let i = 0; i < n; i++) {
    const inicio = (i * turno).toFixed(3);
    const quieto = (i * turno + turno * 0.8).toFixed(3);
    rodillo += `${inicio}%{transform:translate3d(0,${-i * RENGLON}em,0);animation-timing-function:linear}`;
    rodillo += `${quieto}%{transform:translate3d(0,${-i * RENGLON}em,0);${curva}}`;
  }
  rodillo += `100%{transform:translate3d(0,${-n * RENGLON}em,0)}`;
  const fin = (turno * 0.8).toFixed(3);
  const apaga = turno.toFixed(3);
  return (
    `@keyframes e-rodillo{${rodillo}}` +
    `@keyframes e-zona-pulso{0%,${fin}%{transform:scale(1.9);opacity:1}${apaga}%,100%{transform:scale(1);opacity:.45}}`
  );
}
