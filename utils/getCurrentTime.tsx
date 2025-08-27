export function getCurrentTime(): string {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0"); // HH
  const minutes = String(now.getMinutes()).padStart(2, "0"); // MM
  const seconds = String(now.getSeconds()).padStart(2, "0"); // SS

  return `${hours}:${minutes}:${seconds}`;
}
