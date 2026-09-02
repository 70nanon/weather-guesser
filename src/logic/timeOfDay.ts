/** Open-Meteo の sunrise/sunset（例: 2026-09-02T06:12）から HH:MM を取り出す。 */
export function formatClockTime(isoLocal: string | null | undefined): string | null {
  if (!isoLocal) return null
  const timePart = isoLocal.includes('T') ? isoLocal.split('T')[1] : isoLocal
  if (!timePart) return null
  return timePart.slice(0, 5)
}
