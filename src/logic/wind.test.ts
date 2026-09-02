import { describe, expect, it } from 'vitest'
import { formatWind, windDirectionLabel } from './wind'

describe('windDirectionLabel', () => {
  it('0度は北', () => {
    expect(windDirectionLabel(0)).toBe('北')
  })

  it('45度は北東', () => {
    expect(windDirectionLabel(45)).toBe('北東')
  })

  it('90度は東', () => {
    expect(windDirectionLabel(90)).toBe('東')
  })

  it('350度は北に丸める', () => {
    expect(windDirectionLabel(350)).toBe('北')
  })

  it('負の角度も正規化する', () => {
    expect(windDirectionLabel(-90)).toBe('西')
  })
})

describe('formatWind', () => {
  it('方位と風速を結合する', () => {
    expect(formatWind(2.4, 45)).toBe('北東 2.4m/s')
  })
})
