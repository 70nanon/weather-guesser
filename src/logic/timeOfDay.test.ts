import { describe, expect, it } from 'vitest'
import { formatClockTime } from './timeOfDay'

describe('formatClockTime', () => {
  it('ISOローカルからHH:MMを取り出す', () => {
    expect(formatClockTime('2026-09-02T06:12')).toBe('06:12')
  })

  it('秒付きでもHH:MMにする', () => {
    expect(formatClockTime('2026-09-02T18:45:00')).toBe('18:45')
  })

  it('空ならnull', () => {
    expect(formatClockTime(null)).toBeNull()
    expect(formatClockTime(undefined)).toBeNull()
  })
})
