import { describe, expect, it } from 'vitest'
import { investigationPinLabel } from './investigationPin'

describe('investigationPinLabel', () => {
  it('調査番号と地点名だけを出す', () => {
    expect(investigationPinLabel(0, '札幌')).toBe('調査1 · 札幌')
    expect(investigationPinLabel(2, 'ロンドン')).toBe('調査3 · ロンドン')
  })
})
