import { describe, expect, it } from 'vitest'
import { formatDistanceKm, haversineKm } from './haversine'

describe('haversineKm', () => {
  it('同一地点は0km', () => {
    const p = { latitude: 35.68, longitude: 139.76 }
    expect(haversineKm(p, p)).toBe(0)
  })

  it('東京〜大阪は約400km', () => {
    const tokyo = { latitude: 35.68, longitude: 139.76 }
    const osaka = { latitude: 34.69, longitude: 135.5 }
    const km = haversineKm(tokyo, osaka)
    expect(km).toBeGreaterThan(380)
    expect(km).toBeLessThan(430)
  })

  it('東京〜ニューヨークは約1万km超', () => {
    const tokyo = { latitude: 35.68, longitude: 139.76 }
    const nyc = { latitude: 40.71, longitude: -74.01 }
    const km = haversineKm(tokyo, nyc)
    expect(km).toBeGreaterThan(10000)
    expect(km).toBeLessThan(11500)
  })
})

describe('formatDistanceKm', () => {
  it('10km未満は小数1桁', () => {
    expect(formatDistanceKm(3.24)).toBe('3.2 km')
  })
})
