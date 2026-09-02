import { describe, expect, it } from 'vitest'
import {
  MAX_LOCATION_SCORE,
  distanceScore,
  locationScore,
} from './locationScore'

describe('distanceScore', () => {
  it('0kmは満点', () => {
    expect(distanceScore(0)).toBe(MAX_LOCATION_SCORE)
  })

  it('50kmはほぼ満点', () => {
    const s = distanceScore(50)
    expect(s).toBeGreaterThan(4700)
    expect(s).toBeLessThan(MAX_LOCATION_SCORE)
  })

  it('500kmは高得点', () => {
    const s = distanceScore(500)
    expect(s).toBeGreaterThan(3300)
    expect(s).toBeLessThan(4200)
  })

  it('1000kmはそこそこ', () => {
    const s = distanceScore(1000)
    expect(s).toBeGreaterThan(2200)
    expect(s).toBeLessThan(3000)
  })

  it('3000kmは低得点', () => {
    const s = distanceScore(3000)
    expect(s).toBeGreaterThan(400)
    expect(s).toBeLessThan(1000)
  })

  it('5000km以上はかなり低い', () => {
    expect(distanceScore(5000)).toBeLessThan(250)
    expect(distanceScore(20000)).toBeLessThan(10)
  })
})

describe('locationScore', () => {
  it('初期版は調査回数に関係なく距離点と同じ', () => {
    expect(locationScore(500, 0)).toBe(distanceScore(500))
    expect(locationScore(500, 3)).toBe(distanceScore(500))
  })
})
