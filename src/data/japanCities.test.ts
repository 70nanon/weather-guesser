import { describe, expect, it } from 'vitest'
import { JAPAN_CITIES } from './japanCities'
import { WORLD_CITIES } from './targetCities'

describe('JAPAN_CITIES', () => {
  it('47都道府県庁所在地で、すべて日本', () => {
    expect(JAPAN_CITIES.length).toBeGreaterThanOrEqual(47)
    expect(JAPAN_CITIES.every((c) => c.country === '日本')).toBe(true)
    expect(JAPAN_CITIES.some((c) => c.name === '札幌')).toBe(true)
    expect(JAPAN_CITIES.some((c) => c.name === '東京')).toBe(true)
    expect(JAPAN_CITIES.some((c) => c.name === '大阪')).toBe(true)
    expect(JAPAN_CITIES.some((c) => c.name === '那覇')).toBe(true)
  })

  it('idは一意で、世界リストと衝突しない', () => {
    const ids = JAPAN_CITIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    const worldIds = new Set(WORLD_CITIES.map((c) => c.id))
    expect(ids.every((id) => !worldIds.has(id))).toBe(true)
    expect(ids.every((id) => id >= 2001)).toBe(true)
  })
})
