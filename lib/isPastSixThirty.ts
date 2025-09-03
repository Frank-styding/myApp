export function isPastSixThirty() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours > 6 || (hours === 6 && minutes >= 30);
}

export function isPastSeventeenStrict() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours > 17 || (hours === 17 && minutes > 0);
}
