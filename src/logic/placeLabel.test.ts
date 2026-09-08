import { describe, expect, it } from 'vitest'
import { formatPlaceLabel } from './placeLabel'

describe('formatPlaceLabel', () => {
  it('国名があるとき地点名 / 国名になる', () => {
    expect(formatPlaceLabel('札幌', '日本')).toBe('札幌 / 日本')
  })

  it('国名が空なら地点名だけ', () => {
    expect(formatPlaceLabel('Tokyo', '')).toBe('Tokyo')
    expect(formatPlaceLabel('Tokyo', '   ')).toBe('Tokyo')
    expect(formatPlaceLabel('Tokyo')).toBe('Tokyo')
    expect(formatPlaceLabel('Tokyo', null)).toBe('Tokyo')
  })
})
