/** 地図の調査ピンとタブ（調査1）を揃える。距離は含めない。 */
export function investigationPinLabel(index: number, name: string): string {
  return `調査${index + 1} · ${name}`
}
