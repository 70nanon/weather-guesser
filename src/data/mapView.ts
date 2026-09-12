import type { LocationRegion } from '../types/location'

export type MapLatLng = readonly [number, number]
export type MapBounds = readonly [MapLatLng, MapLatLng]

export interface MapView {
  center: MapLatLng
  zoom: number
  bounds?: MapBounds
}

/** 北海道〜沖縄（石垣・小笠原が入る程度）が入る枠。 */
export const JAPAN_MAP_BOUNDS: MapBounds = [
  [24, 123],
  [46, 146],
]

export const JAPAN_MAP_VIEW: MapView = {
  center: [37.5, 137],
  zoom: 5,
  bounds: JAPAN_MAP_BOUNDS,
}

export const WORLD_MAP_VIEW: MapView = {
  center: [20, 10],
  zoom: 1,
}

export function mapViewForRegion(region: LocationRegion): MapView {
  return region === 'japan' ? JAPAN_MAP_VIEW : WORLD_MAP_VIEW
}

export function boundsContains(bounds: MapBounds, point: MapLatLng): boolean {
  const [[south, west], [north, east]] = bounds
  const [lat, lon] = point
  return lat >= south && lat <= north && lon >= west && lon <= east
}
