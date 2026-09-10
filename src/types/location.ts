import type { GeoLocation } from './weather'

export interface TargetCity {
  id: number
  name: string
  country: string
  latitude: number
  longitude: number
  aliases?: string[]
}

export interface LatLng {
  latitude: number
  longitude: number
}

/** Location Mode 用の現在天気。地点名・国名・タイムゾーンは含めない。 */
export interface WeatherSnapshot {
  temperature: number
  tempMax: number
  tempMin: number
  weatherCode: number
  humidity: number
  precipitationMm: number
  windSpeedMs: number
  windDirectionDeg: number
  pressure: number
  sunrise: string | null
  sunset: string | null
}

export interface Investigation {
  location: GeoLocation
  snapshot: WeatherSnapshot
}

export type LocationRegion = 'japan' | 'world'

export interface LocationRoundResult {
  target: TargetCity
  guess: LatLng
  distanceKm: number
  score: number
  investigationsUsed: number
  region: LocationRegion
}
