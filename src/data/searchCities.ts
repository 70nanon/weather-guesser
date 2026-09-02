import type { TargetCity } from '../types/location'
import type { GeoLocation } from '../types/weather'
import { TARGET_CITIES } from './targetCities'

/** 正解候補以外でも調査・予報で日本語検索できるようにする都市。 */
const EXTRA_SEARCH_CITIES: TargetCity[] = [
  { id: 1001, name: '大阪', country: '日本', latitude: 34.69, longitude: 135.5, aliases: ['osaka', 'おおさか'] },
  { id: 1002, name: '名古屋', country: '日本', latitude: 35.18, longitude: 136.91, aliases: ['nagoya', 'なごや'] },
  { id: 1003, name: '福岡', country: '日本', latitude: 33.59, longitude: 130.4, aliases: ['fukuoka', 'ふくおか'] },
  { id: 1004, name: '京都', country: '日本', latitude: 35.01, longitude: 135.77, aliases: ['kyoto', 'きょうと'] },
  { id: 1005, name: '横浜', country: '日本', latitude: 35.44, longitude: 139.64, aliases: ['yokohama', 'よこはま'] },
  { id: 1006, name: '神戸', country: '日本', latitude: 34.69, longitude: 135.2, aliases: ['kobe', 'こうべ'] },
  { id: 1007, name: '広島', country: '日本', latitude: 34.39, longitude: 132.46, aliases: ['hiroshima', 'ひろしま'] },
  { id: 1008, name: '仙台', country: '日本', latitude: 38.27, longitude: 140.87, aliases: ['sendai', 'せんだい'] },
]

const ROMAJI_ALIASES: Record<number, string[]> = {
  1: ['sapporo', 'さっぽろ'],
  2: ['tokyo', 'とうきょう'],
  3: ['naha', 'なは', 'okinawa', '沖縄'],
  4: ['seoul'],
  5: ['beijing', 'peking'],
  6: ['shanghai'],
  7: ['taipei'],
  8: ['hong kong', 'hongkong'],
  9: ['manila'],
  10: ['singapore'],
  11: ['bangkok'],
  12: ['jakarta'],
  13: ['mumbai', 'bombay'],
  14: ['delhi', 'new delhi'],
  15: ['dubai'],
  16: ['ulaanbaatar', 'ulan bator'],
  17: ['london'],
  18: ['paris'],
  19: ['berlin'],
  20: ['madrid'],
  21: ['rome', 'roma'],
  22: ['athens'],
  23: ['reykjavik'],
  24: ['helsinki'],
  25: ['istanbul'],
  26: ['cairo'],
  27: ['lagos'],
  28: ['nairobi'],
  29: ['cape town', 'capetown'],
  30: ['casablanca'],
  31: ['new york', 'newyork', 'ny'],
  32: ['chicago'],
  33: ['miami'],
  34: ['vancouver'],
  35: ['mexico city', 'mexico'],
  36: ['lima'],
  37: ['buenos aires'],
  38: ['santiago'],
  39: ['sao paulo', 'são paulo'],
  40: ['anchorage'],
  41: ['sydney'],
  42: ['auckland'],
  43: ['perth'],
  44: ['honolulu'],
  45: ['la paz'],
  46: ['moscow', 'moskva'],
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '')
}

function allCities(): TargetCity[] {
  return [...TARGET_CITIES, ...EXTRA_SEARCH_CITIES]
}

function cityNames(city: TargetCity): string[] {
  return [city.name, ...(city.aliases ?? []), ...(ROMAJI_ALIASES[city.id] ?? [])]
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
  for (const city of allCities()) {
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
