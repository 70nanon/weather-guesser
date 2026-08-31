import type { AbsurdityResult, DailyWeather, Guess } from '../types/weather'

// 予想「そのもの」の物理的なおかしさを加点する。上限なし（%表示）。
// 実際の予報とは比較しない点が予報スコアと異なる。
export function calculateAbsurdity(
  guess: Guess,
  today: DailyWeather,
): AbsurdityResult {
  const reasons: string[] = []
  let score = 0

  if (guess.tempMin > guess.tempMax) {
    score += 40
    reasons.push('最低気温が最高気温より高い')
  }
  if (guess.weather === 'snow' && guess.tempMax >= 30) {
    score += 50
    reasons.push('雪なのに最高気温が30℃以上')
  }
  if (guess.tempMax >= 50) {
    score += 40
    reasons.push('最高気温が50℃以上')
  }
  if (guess.tempMin <= -50) {
    score += 40
    reasons.push('最低気温が-50℃以下')
  }
  if (guess.precipProb < 0 || guess.precipProb > 100) {
    score += 30
    reasons.push('降水確率が0〜100%の範囲外')
  }
  const swing = Math.abs(guess.tempMax - today.tempMax)
  if (swing >= 20) {
    score += 30
    reasons.push(`今日から最高気温が${Math.round(swing)}℃も変化`)
  }

  return { score, reasons }
}
