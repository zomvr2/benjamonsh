export function formatReadingTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let result = "";
  if (hours > 0) {
    result += `${hours}h`;
  }
  if (minutes > 0) {
    result += `${minutes}m`;
  }
  if (seconds > 0) {
    result += ` ${seconds}s`;
  }
  result += " de lectura";

  return result;
}