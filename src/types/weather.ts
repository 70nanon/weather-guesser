export type WeatherCategory = 'clear' | 'cloudy' | 'rain' | 'snow' | 'other'

// 予想フォームでユーザーが選べる天気（「その他」は選べない）
export type GuessableWeather = Exclude<WeatherCategory, 'other'>

export interface GeoLocation {
  id: number
  name: string
  country: string
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  temperature: number
  humidity: number
  pressure: number
  weatherCode: number
}

export interface DailyWeather {
  weatherCode: number
  tempMax: number
  tempMin: number
  precipProbMax: number
}

export interface ForecastData {
  current: CurrentWeather
  today: DailyWeather
  tomorrow: DailyWeather
  timezone: string
}

export interface Guess {
  weather: GuessableWeather
  tempMax: number
  tempMin: number
  precipProb: number
}

export interface ScoreBreakdown {
  tempMax: number
  tempMin: number
  weather: number
  precip: number
  total: number
}

export interface AbsurdityResult {
  score: number
  reasons: string[]
}
