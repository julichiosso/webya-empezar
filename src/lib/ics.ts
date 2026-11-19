/**
 * Evento de calendario (.ics) con una alarma antes: lo que descarga "Agregar al calendario". Formato
 * iCalendar mínimo, en hora local (sin zona), que abren Google Calendar, Apple y Outlook.
 */
export function crearIcs({
  uid,
  inicio,
  fin,
  titulo,
  lugar,
  alarmaMin = 30,
}: {
  uid: string;
  inicio: Date;
  fin: Date;
  titulo: string;
  lugar?: string;
  alarmaMin?: number;
}): string {
  const dos = (n: number) => String(n).padStart(2, '0');
  const fecha = (d: Date) =>
    `${d.getFullYear()}${dos(d.getMonth() + 1)}${dos(d.getDate())}T${dos(d.getHours())}${dos(d.getMinutes())}00`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Webya//Turnos//ES',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${fecha(inicio)}`,
    `DTEND:${fecha(fin)}`,
    `SUMMARY:${titulo}`,
    ...(lugar ? [`LOCATION:${lugar}`] : []),
    'BEGIN:VALARM',
    `TRIGGER:-PT${alarmaMin}M`,
    'ACTION:DISPLAY',
    `DESCRIPTION:${titulo}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Descarga un .ics en el navegador. */
export function descargarIcs(contenido: string, nombre = 'turno.ics') {
  const url = URL.createObjectURL(new Blob([contenido], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
