export function compareHours(hora1: string, hora2: string) {
  const fecha1 = new Date(`1970-01-01T${hora1}`);
  const fecha2 = new Date(`1970-01-01T${hora2}`);
  if (fecha1 > fecha2) return 1;
  if (fecha1 < fecha2) return -1;
  return 0;
}
