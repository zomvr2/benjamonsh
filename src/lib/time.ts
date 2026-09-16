const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];

export function formatReadingTime(milliseconds: number): string {
  const minutes = Math.max(1, Math.round(milliseconds / 60000));
  return `${minutes} min de lectura`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MESES[m - 1]} ${y}`;
}
