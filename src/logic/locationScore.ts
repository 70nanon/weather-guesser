/**
 * Location Mode の距離スコア。
 * 近いほど高得点。最大 5000 点。
 *
 * score = round(5000 * e^(-distanceKm / 1500))
 * 目安: 50km≈4836, 500km≈3585, 1000km≈2569, 3000km≈677, 5000km≈178
 */
export const MAX_LOCATION_SCORE = 5000
const DECAY_KM = 1500

/**
 * 調査回数ボーナス（将来用）。初期版はすべて 0 で距離点のみ。
 * インデックス = 使った調査回数。
 */
export const INVESTIGATION_BONUS_BY_USED: readonly number[] = [0, 0, 0, 0]

export function distanceScore(distanceKm: number): number {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) return 0
  const raw = MAX_LOCATION_SCORE * Math.exp(-distanceKm / DECAY_KM)
  return Math.max(0, Math.min(MAX_LOCATION_SCORE, Math.round(raw)))
}

export function locationScore(
  distanceKm: number,
  investigationsUsed: number = 0,
): number {
  const bonus = INVESTIGATION_BONUS_BY_USED[investigationsUsed] ?? 0
  return Math.max(
    0,
    Math.min(MAX_LOCATION_SCORE, distanceScore(distanceKm) + bonus),
  )
}
