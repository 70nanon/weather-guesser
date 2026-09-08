/** 調査結果カードと同じ「地点名 / 国名」。国名が空なら地点名だけ。 */
export function formatPlaceLabel(
  name: string,
  country?: string | null,
): string {
  const trimmedCountry = country?.trim() ?? ''
  if (trimmedCountry.length === 0) return name
  return `${name} / ${trimmedCountry}`
}
