import type { LocationRegion } from '../types/location'

/**
 * Location Mode の距離スコア。
 * 近いほど高得点。最大 5000 点。
 *
 * score = round(5000 * e^(-distanceKm / D))
 * 世界 D=1500: 50km≈4836, 500km≈3585, 1000km≈2569, 3000km≈677
 * 日本 D=800: 50km≈4697, 400km≈3033, 800km≈1839, 2000km≈411
 */
export const MAX_LOCATION_SCORE = 5000

export const DECAY_KM_BY_REGION: Record<LocationRegion, number> = {
  world: 1500,
  japan: 800,
}

/**
 * 調査回数ボーナス（将来用）。初期版はすべて 0 で距離点のみ。
 * インデックス = 使った調査回数。
 */
export const INVESTIGATION_BONUS_BY_USED: readonly number[] = [0, 0, 0, 0]

export function distanceScore(
  distanceKm: number,
  region: LocationRegion = 'world',
): number {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) return 0
  const decayKm = DECAY_KM_BY_REGION[region]
  const raw = MAX_LOCATION_SCORE * Math.exp(-distanceKm / decayKm)
  return Math.max(0, Math.min(MAX_LOCATION_SCORE, Math.round(raw)))
}

export function locationScore(
  distanceKm: number,
  investigationsUsed: number = 0,
  region: LocationRegion = 'world',
): number {
  const bonus = INVESTIGATION_BONUS_BY_USED[investigationsUsed] ?? 0
  return Math.max(
    0,
    Math.min(MAX_LOCATION_SCORE, distanceScore(distanceKm, region) + bonus),
  )
}
