export function getFormattedDate(): string {
  // Create a Date object representing the current date
  const today = new Date();

  // Extract day, month, and year, ensuring two-digit formatting for day/month
  const day = String(today.getDate()).padStart(2, "0"); // dd
  const month = String(today.getMonth() + 1).padStart(2, "0"); // mm (months are 0-indexed)
  const year = today.getFullYear(); // yyyy

  // Return formatted date string in DD-MM-YYYY format
  return `${day}-${month}-${year}`;
}
