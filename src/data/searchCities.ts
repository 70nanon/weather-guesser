import type { TargetCity } from '../types/location'
import type { GeoLocation } from '../types/weather'
import { WORLD_CITIES } from './targetCities'

/**
 * 正解リストに含まれないが、調査・予報の日本語検索で使いたい都市。
 * 世界正解リストとは別に持つ。LM-4 の日本リスト追加後も残してよい。
 */
export const SEARCH_ONLY_CITIES: TargetCity[] = [
  { id: 1001, name: '大阪', country: '日本', latitude: 34.69, longitude: 135.5, aliases: ['osaka', 'おおさか'] },
  { id: 1002, name: '名古屋', country: '日本', latitude: 35.18, longitude: 136.91, aliases: ['nagoya', 'なごや'] },
  { id: 1003, name: '福岡', country: '日本', latitude: 33.59, longitude: 130.4, aliases: ['fukuoka', 'ふくおか'] },
  { id: 1004, name: '京都', country: '日本', latitude: 35.01, longitude: 135.77, aliases: ['kyoto', 'きょうと'] },
  { id: 1005, name: '横浜', country: '日本', latitude: 35.44, longitude: 139.64, aliases: ['yokohama', 'よこはま'] },
  { id: 1006, name: '神戸', country: '日本', latitude: 34.69, longitude: 135.2, aliases: ['kobe', 'こうべ'] },
  { id: 1007, name: '広島', country: '日本', latitude: 34.39, longitude: 132.46, aliases: ['hiroshima', 'ひろしま'] },
  { id: 1008, name: '仙台', country: '日本', latitude: 38.27, longitude: 140.87, aliases: ['sendai', 'せんだい'] },
]

/** 正解リストの id に依存しない。日本リスト追加後も世界都市の検索が残る。 */
const SEARCH_ALIASES_BY_NAME: Record<string, string[]> = {
  札幌: ['sapporo', 'さっぽろ'],
  東京: ['tokyo', 'とうきょう'],
  那覇: ['naha', 'なは', 'okinawa', '沖縄'],
  ソウル: ['seoul'],
  北京: ['beijing', 'peking'],
  上海: ['shanghai'],
  台北: ['taipei'],
  香港: ['hong kong', 'hongkong'],
  マニラ: ['manila'],
  シンガポール: ['singapore'],
  バンコク: ['bangkok'],
  ジャカルタ: ['jakarta'],
  ムンバイ: ['mumbai', 'bombay'],
  デリー: ['delhi', 'new delhi'],
  ドバイ: ['dubai'],
  ウランバートル: ['ulaanbaatar', 'ulan bator'],
  ロンドン: ['london'],
  パリ: ['paris'],
  ベルリン: ['berlin'],
  マドリード: ['madrid'],
  ローマ: ['rome', 'roma'],
  アテネ: ['athens'],
  レイキャビク: ['reykjavik'],
  ヘルシンキ: ['helsinki'],
  イスタンブール: ['istanbul'],
  カイロ: ['cairo'],
  ラゴス: ['lagos'],
  ナイロビ: ['nairobi'],
  ケープタウン: ['cape town', 'capetown'],
  カサブランカ: ['casablanca'],
  ニューヨーク: ['new york', 'newyork', 'ny'],
  シカゴ: ['chicago'],
  マイアミ: ['miami'],
  バンクーバー: ['vancouver'],
  メキシコシティ: ['mexico city', 'mexico'],
  リマ: ['lima'],
  ブエノスアイレス: ['buenos aires'],
  サンティアゴ: ['santiago'],
  サンパウロ: ['sao paulo', 'são paulo'],
  アンカレッジ: ['anchorage'],
  シドニー: ['sydney'],
  オークランド: ['auckland'],
  パース: ['perth'],
  ホノルル: ['honolulu'],
  ラパス: ['la paz'],
  モスクワ: ['moscow', 'moskva'],
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '')
}

/** 正解リストとは別に、検索で使う都市を集める。 */
export function searchCityCatalog(
  extra: readonly TargetCity[] = [],
): TargetCity[] {
  return [...WORLD_CITIES, ...SEARCH_ONLY_CITIES, ...extra]
}

function cityNames(city: TargetCity): string[] {
  return [
    city.name,
    ...(city.aliases ?? []),
    ...(SEARCH_ALIASES_BY_NAME[city.name] ?? []),
  ]
}

function toLocation(city: TargetCity): GeoLocation {
  return {
    id: city.id,
    name: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
  }
}

/** Open-Meteo の geocoding は日本語入力をほぼ返さないため、先にローカル照合する。 */
export function searchLocalCities(query: string): GeoLocation[] {
  const q = normalize(query)
  if (q.length === 0) return []

  const ranked: { city: TargetCity; rank: number }[] = []
  for (const city of searchCityCatalog()) {
    const names = cityNames(city).map(normalize)
    if (names.some((n) => n === q)) {
      ranked.push({ city, rank: 0 })
      continue
    }
    if (q.length >= 2 && names.some((n) => n.includes(q) || q.includes(n))) {
      ranked.push({ city, rank: 1 })
    }
  }

  ranked.sort((a, b) => a.rank - b.rank || a.city.name.localeCompare(b.city.name, 'ja'))
  const seen = new Set<number>()
  const results: GeoLocation[] = []
  for (const item of ranked) {
    if (seen.has(item.city.id)) continue
    seen.add(item.city.id)
    results.push(toLocation(item.city))
    if (results.length >= 5) break
  }
  return results
}
