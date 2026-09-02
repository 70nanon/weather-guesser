import { describe, expect, it } from 'vitest'
import { searchLocalCities } from './searchCities'

describe('searchLocalCities', () => {
  it('日本語の東京でヒットする', () => {
    const hits = searchLocalCities('東京')
    expect(hits.some((h) => h.name === '東京')).toBe(true)
  })

  it('札幌・大阪も日本語でヒットする', () => {
    expect(searchLocalCities('札幌')[0]?.name).toBe('札幌')
    expect(searchLocalCities('大阪')[0]?.name).toBe('大阪')
  })

  it('ローマ字の Tokyo でもヒットする', () => {
    expect(searchLocalCities('Tokyo')[0]?.name).toBe('東京')
  })

  it('空文字は空配列', () => {
    expect(searchLocalCities('   ')).toEqual([])
  })
})
