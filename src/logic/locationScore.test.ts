import { describe, expect, it } from 'vitest'
import {
  MAX_LOCATION_SCORE,
  distanceScore,
  locationScore,
} from './locationScore'

describe('distanceScore（世界）', () => {
  it('0kmは満点', () => {
    expect(distanceScore(0, 'world')).toBe(MAX_LOCATION_SCORE)
  })

  it('50kmはほぼ満点', () => {
    const s = distanceScore(50, 'world')
    expect(s).toBeGreaterThan(4700)
    expect(s).toBeLessThan(MAX_LOCATION_SCORE)
  })

  it('500kmは高得点', () => {
    const s = distanceScore(500, 'world')
    expect(s).toBeGreaterThan(3300)
    expect(s).toBeLessThan(4200)
  })

  it('1000kmはそこそこ', () => {
    const s = distanceScore(1000, 'world')
    expect(s).toBeGreaterThan(2200)
    expect(s).toBeLessThan(3000)
  })

  it('3000kmは低得点', () => {
    const s = distanceScore(3000, 'world')
    expect(s).toBeGreaterThan(400)
    expect(s).toBeLessThan(1000)
  })

  it('5000km以上はかなり低い', () => {
    expect(distanceScore(5000, 'world')).toBeLessThan(250)
    expect(distanceScore(20000, 'world')).toBeLessThan(10)
  })

  it('region省略時は世界と同じ', () => {
    expect(distanceScore(500)).toBe(distanceScore(500, 'world'))
  })
})

describe('distanceScore（日本）', () => {
  it('50kmはほぼ満点', () => {
    const s = distanceScore(50, 'japan')
    expect(s).toBeGreaterThan(4500)
    expect(s).toBeLessThan(MAX_LOCATION_SCORE)
  })

  it('400km（東京−大阪級）は中〜高得点', () => {
    const s = distanceScore(400, 'japan')
    expect(s).toBeGreaterThan(2700)
    expect(s).toBeLessThan(3400)
  })

  it('800km（東京−札幌級）は世界より低い', () => {
    const japan = distanceScore(800, 'japan')
    const world = distanceScore(800, 'world')
    expect(japan).toBeGreaterThan(1500)
    expect(japan).toBeLessThan(2200)
    expect(japan).toBeLessThan(world)
  })

  it('2000km超はほぼ外れ', () => {
    expect(distanceScore(2000, 'japan')).toBeLessThan(500)
  })
})

describe('locationScore', () => {
  it('初期版は調査回数に関係なく距離点と同じ', () => {
    expect(locationScore(500, 0, 'world')).toBe(distanceScore(500, 'world'))
    expect(locationScore(500, 3, 'world')).toBe(distanceScore(500, 'world'))
    expect(locationScore(400, 1, 'japan')).toBe(distanceScore(400, 'japan'))
  })
})
