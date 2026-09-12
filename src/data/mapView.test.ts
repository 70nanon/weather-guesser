import { describe, expect, it } from 'vitest'
import { JAPAN_CITIES } from './japanCities'
import {
  JAPAN_MAP_BOUNDS,
  JAPAN_MAP_VIEW,
  WORLD_MAP_VIEW,
  boundsContains,
  mapViewForRegion,
} from './mapView'

describe('mapViewForRegion', () => {
  it('日本モードは日本全体が見える初期表示', () => {
    expect(mapViewForRegion('japan')).toBe(JAPAN_MAP_VIEW)
    expect(JAPAN_MAP_VIEW.center).toEqual([37.5, 137])
    expect(JAPAN_MAP_VIEW.zoom).toBe(5)
    expect(JAPAN_MAP_VIEW.bounds).toEqual(JAPAN_MAP_BOUNDS)
  })

  it('世界モードは現行の世界表示のまま', () => {
    expect(mapViewForRegion('world')).toBe(WORLD_MAP_VIEW)
    expect(WORLD_MAP_VIEW).toEqual({ center: [20, 10], zoom: 1 })
  })

  it('日本の枠に北海道と沖縄が入る', () => {
    const sapporo = JAPAN_CITIES.find((c) => c.name === '札幌')
    const naha = JAPAN_CITIES.find((c) => c.name === '那覇')
    expect(sapporo).toBeDefined()
    expect(naha).toBeDefined()
    expect(boundsContains(JAPAN_MAP_BOUNDS, [sapporo!.latitude, sapporo!.longitude])).toBe(true)
    expect(boundsContains(JAPAN_MAP_BOUNDS, [naha!.latitude, naha!.longitude])).toBe(true)
  })
})
