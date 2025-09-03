export function getCurrentTime(): string {
  // Create a Date object representing the current moment
  const now = new Date();

  // Extract hours, minutes, and seconds, ensuring two-digit formatting
  const hours = String(now.getHours()).padStart(2, "0"); // HH
  const minutes = String(now.getMinutes()).padStart(2, "0"); // MM
  const seconds = String(now.getSeconds()).padStart(2, "0"); // SS

  // Return formatted time string in HH:MM:SS format
  return `${hours}:${minutes}:${seconds}`;
}
