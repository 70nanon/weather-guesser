import type { WeatherSnapshot } from '../types/location'
import type { ForecastData, GeoLocation } from '../types/weather'
import { searchLocalCities } from '../data/searchCities'
import { formatClockTime } from '../logic/timeOfDay'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

interface GeoApiResult {
  id: number
  name: string
  country?: string
  latitude: number
  longitude: number
  admin1?: string
}

// 地名検索。日本語は Open-Meteo geocoding がほぼヒットしないのでローカル都市表を先に見る。
export async function searchLocations(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim()
  if (trimmed.length === 0) return []

  const local = searchLocalCities(trimmed)
  if (local.length > 0) return local

  const params = new URLSearchParams({
    name: trimmed,
    count: '5',
    language: 'ja',
    format: 'json',
  })
  const res = await fetch(`${GEOCODING_URL}?${params.toString()}`)
  if (!res.ok) {
    throw new Error('地名の検索に失敗しました')
  }
  const data: { results?: GeoApiResult[] } = await res.json()
  if (!data.results) return []

  return data.results.map((r) => ({
    id: r.id,
    name: r.admin1 && r.admin1 !== r.name ? `${r.name}（${r.admin1}）` : r.name,
    country: r.country ?? '',
    latitude: r.latitude,
    longitude: r.longitude,
  }))
}

interface ForecastApiResponse {
  timezone: string
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    pressure_msl: number
    weather_code: number
  }
  daily: {
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: (number | null)[]
  }
}

// 今日・明日の予報を取得。daily 配列の index 0 が今日、1 が明日。
export async function fetchForecast(
  location: Pick<GeoLocation, 'latitude' | 'longitude'>,
): Promise<ForecastData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'temperature_2m,relative_humidity_2m,pressure_msl,weather_code',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '2',
  })
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`)
  if (!res.ok) {
    throw new Error('天気予報の取得に失敗しました')
  }
  const data: ForecastApiResponse = await res.json()

  const daily = (index: number) => ({
    weatherCode: data.daily.weather_code[index],
    tempMax: data.daily.temperature_2m_max[index],
    tempMin: data.daily.temperature_2m_min[index],
    precipProbMax: data.daily.precipitation_probability_max[index] ?? 0,
  })

  return {
    timezone: data.timezone,
    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      pressure: data.current.pressure_msl,
      weatherCode: data.current.weather_code,
    },
    today: daily(0),
    tomorrow: daily(1),
  }
}

interface SnapshotApiResponse {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
    pressure_msl: number
  }
  daily: {
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    sunrise: string[]
    sunset: string[]
    precipitation_sum: (number | null)[]
  }
}

/** Location Mode 用。地点特定につながる timezone は返さない。 */
export async function fetchWeatherSnapshot(
  location: Pick<GeoLocation, 'latitude' | 'longitude'>,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl',
    daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum',
    wind_speed_unit: 'ms',
    timezone: 'auto',
    forecast_days: '1',
  })
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`)
  if (!res.ok) {
    throw new Error('天気の取得に失敗しました')
  }
  const data: SnapshotApiResponse = await res.json()

  return {
    temperature: data.current.temperature_2m,
    tempMax: data.daily.temperature_2m_max[0],
    tempMin: data.daily.temperature_2m_min[0],
    weatherCode: data.current.weather_code,
    humidity: data.current.relative_humidity_2m,
    precipitationMm: data.daily.precipitation_sum[0] ?? data.current.precipitation ?? 0,
    windSpeedMs: data.current.wind_speed_10m,
    windDirectionDeg: data.current.wind_direction_10m,
    pressure: data.current.pressure_msl,
    sunrise: formatClockTime(data.daily.sunrise[0]),
    sunset: formatClockTime(data.daily.sunset[0]),
  }
}
