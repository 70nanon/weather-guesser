import { describe, expect, it } from 'vitest'
import { WORLD_CITIES, pickTargetCity } from './targetCities'

describe('WORLD_CITIES', () => {
  it('世界規模の候補が残っている', () => {
    expect(WORLD_CITIES.length).toBe(46)
    expect(WORLD_CITIES.some((c) => c.name === 'ロンドン')).toBe(true)
    expect(WORLD_CITIES.some((c) => c.name === 'ニューヨーク')).toBe(true)
    expect(WORLD_CITIES.some((c) => c.name === '東京')).toBe(true)
  })

  it('idは一意', () => {
    const ids = WORLD_CITIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('pickTargetCity', () => {
  it('渡した配列から選ぶ', () => {
    const only = WORLD_CITIES.slice(0, 3)
    const picked = pickTargetCity(only, only[0].id)
    expect(picked.id).not.toBe(only[0].id)
    expect(only.slice(1).some((c) => c.id === picked.id)).toBe(true)
  })
})
