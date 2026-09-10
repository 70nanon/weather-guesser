import { describe, expect, it } from 'vitest'
import { JAPAN_CITIES } from './japanCities'
import { citiesForRegion, regionLabel } from './locationRegion'
import { WORLD_CITIES } from './targetCities'

describe('citiesForRegion', () => {
  it('日本モードは国内リストから選ぶ', () => {
    expect(citiesForRegion('japan')).toBe(JAPAN_CITIES)
  })

  it('世界モードは現行の世界リストから選ぶ', () => {
    expect(citiesForRegion('world')).toBe(WORLD_CITIES)
  })
})

describe('regionLabel', () => {
  it('結果表示用のラベルを返す', () => {
    expect(regionLabel('japan')).toBe('日本')
    expect(regionLabel('world')).toBe('世界')
  })
})
