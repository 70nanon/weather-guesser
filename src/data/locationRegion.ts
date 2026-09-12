import type { LocationRegion, TargetCity } from '../types/location'
import { JAPAN_CITIES } from './japanCities'
import { WORLD_CITIES } from './targetCities'

export function citiesForRegion(region: LocationRegion): readonly TargetCity[] {
  return region === 'japan' ? JAPAN_CITIES : WORLD_CITIES
}

export function regionLabel(region: LocationRegion): string {
  return region === 'japan' ? '日本' : '世界'
}
