export function compareHours(hora1: string, hora2: string) {
  // Create Date objects using a common date and the input time strings
  const fecha1 = new Date(`1970-01-01T${hora1}`);
  const fecha2 = new Date(`1970-01-01T${hora2}`);

  // Compare times and return 1 if hora1 is later, -1 if hora2 is later, 0 if equal
  if (fecha1 > fecha2) return 1;
  if (fecha1 < fecha2) return -1;
  return 0;
}
