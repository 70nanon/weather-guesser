import type {
  DailyWeather,
  Guess,
  ScoreBreakdown,
  WeatherCategory,
} from '../types/weather'
import { codeToCategory } from './weatherCode'

const MAX_TEMP_POINTS = 30
const MAX_WEATHER_POINTS = 25
const MAX_PRECIP_POINTS = 15

// 気温は差が小さいほど高得点。10℃以上ずれるとほぼ0点。
// 0℃差=満点, 1℃≈27, 3℃≈21, 5℃=15, 10℃以上=0。
function tempPoints(guess: number, actual: number): number {
  const diff = Math.abs(guess - actual)
  const ratio = Math.max(0, 1 - diff / 10)
  return Math.round(MAX_TEMP_POINTS * ratio)
}

// 完全一致で満点。晴れ↔曇り、雨↔雪など近い天気は部分点。
function weatherPoints(
  guess: WeatherCategory,
  actual: WeatherCategory,
): number {
  if (guess === actual) return MAX_WEATHER_POINTS
  const nearPairs: Record<string, number> = {
    'clear-cloudy': 12,
    'cloudy-clear': 12,
    'rain-snow': 10,
    'snow-rain': 10,
    'cloudy-rain': 8,
    'rain-cloudy': 8,
  }
  return nearPairs[`${guess}-${actual}`] ?? 0
}

// 降水確率も差に応じて減点（差100でほぼ0点）。
function precipPoints(guess: number, actual: number): number {
  const diff = Math.abs(guess - actual)
  const ratio = Math.max(0, 1 - diff / 100)
  return Math.round(MAX_PRECIP_POINTS * ratio)
}

export function calculateScore(
  guess: Guess,
  tomorrow: DailyWeather,
): ScoreBreakdown {
  const actualWeather = codeToCategory(tomorrow.weatherCode)
  const tempMax = tempPoints(guess.tempMax, tomorrow.tempMax)
  const tempMin = tempPoints(guess.tempMin, tomorrow.tempMin)
  const weather = weatherPoints(guess.weather, actualWeather)
  const precip = precipPoints(guess.precipProb, tomorrow.precipProbMax)
  const total = tempMax + tempMin + weather + precip
  return { tempMax, tempMin, weather, precip, total }
}
