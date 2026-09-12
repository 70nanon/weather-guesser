import { describe, expect, it } from 'vitest'
import { JAPAN_CITIES } from './japanCities'
import { SEARCH_ONLY_CITIES, searchCityCatalog, searchLocalCities } from './searchCities'
import { WORLD_CITIES } from './targetCities'

describe('searchCityCatalog', () => {
  it('世界リストと日本リストを含む', () => {
    const catalog = searchCityCatalog()
    expect(catalog).toEqual([...WORLD_CITIES, ...JAPAN_CITIES, ...SEARCH_ONLY_CITIES])
    expect(catalog.some((c) => c.name === 'ロンドン')).toBe(true)
    expect(catalog.some((c) => c.name === '大阪')).toBe(true)
    expect(catalog.some((c) => c.name === '金沢')).toBe(true)
  })
})

describe('searchLocalCities', () => {
  it('日本語の東京でヒットする', () => {
    const hits = searchLocalCities('東京')
    expect(hits.some((h) => h.name === '東京')).toBe(true)
    expect(hits.filter((h) => h.name === '東京')).toHaveLength(1)
  })

  it('札幌・大阪も日本語でヒットする', () => {
    expect(searchLocalCities('札幌')[0]?.name).toBe('札幌')
    expect(searchLocalCities('大阪')[0]?.name).toBe('大阪')
  })

  it('県庁所在地の日本語・ローマ字でもヒットする', () => {
    expect(searchLocalCities('金沢')[0]?.name).toBe('金沢')
    expect(searchLocalCities('Kanazawa')[0]?.name).toBe('金沢')
  })

  it('世界都市の日本語・ローマ字でもヒットする', () => {
    expect(searchLocalCities('ロンドン')[0]?.name).toBe('ロンドン')
    expect(searchLocalCities('London')[0]?.name).toBe('ロンドン')
  })

  it('ローマ字の Tokyo でもヒットする', () => {
    expect(searchLocalCities('Tokyo')[0]?.name).toBe('東京')
  })

  it('空文字は空配列', () => {
    expect(searchLocalCities('   ')).toEqual([])
  })
})
