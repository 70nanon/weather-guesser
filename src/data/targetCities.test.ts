import { describe, expect, it } from 'vitest'
import { TARGET_CITIES, pickTargetCity } from './targetCities'

describe('TARGET_CITIES', () => {
  it('候補が十分ある', () => {
    expect(TARGET_CITIES.length).toBeGreaterThanOrEqual(30)
  })

  it('idは一意', () => {
    const ids = TARGET_CITIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('pickTargetCity', () => {
  it('excludeId以外から選ぶ', () => {
    const only = TARGET_CITIES.slice(0, 3)
    const picked = pickTargetCity(only, only[0].id)
    expect(picked.id).not.toBe(only[0].id)
    expect(only.slice(1).some((c) => c.id === picked.id)).toBe(true)
  })
})
