import type { WeatherCategory } from '../types/weather'

// WMO weather_code を大分類（晴れ / 曇り / 雨 / 雪 / その他）に変換する。
// 参考: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
export function codeToCategory(code: number): WeatherCategory {
  if (code === 0 || code === 1) return 'clear'
  if (code === 2 || code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'other' // 霧
  if (code >= 51 && code <= 67) return 'rain' // 霧雨・雨
  if (code >= 71 && code <= 77) return 'snow' // 雪
  if (code >= 80 && code <= 82) return 'rain' // にわか雨
  if (code === 85 || code === 86) return 'snow' // にわか雪
  if (code >= 95) return 'rain' // 雷雨
  return 'other'
}

const LABELS: Record<WeatherCategory, string> = {
  clear: '晴れ',
  cloudy: '曇り',
  rain: '雨',
  snow: '雪',
  other: 'その他',
}

const EMOJI: Record<WeatherCategory, string> = {
  clear: '☀️',
  cloudy: '☁️',
  rain: '🌧️',
  snow: '❄️',
  other: '🌫️',
}

export function categoryLabel(category: WeatherCategory): string {
  return LABELS[category]
}

export function categoryEmoji(category: WeatherCategory): string {
  return EMOJI[category]
}
