export function getFormattedDate(): string {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0"); // dd
  const month = String(today.getMonth() + 1).padStart(2, "0"); // mm (0 indexado)
  const year = today.getFullYear(); // yyyy

  return `${day}-${month}-${year}`;
}
