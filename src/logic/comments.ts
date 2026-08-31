// ネタコメント。ありえなさスコアに応じて選ぶ。
// 後から足しやすいよう、しきい値とメッセージだけをここに集約する。
interface CommentTier {
  minAbsurdity: number
  messages: string[]
}

const TIERS: CommentTier[] = [
  {
    minAbsurdity: 120,
    messages: [
      '物理法則との協議が必要です。',
      '気象予報士としては微妙ですが、終末予言者としては有望です。',
    ],
  },
  {
    minAbsurdity: 60,
    messages: [
      'スーパーコンピューターが困惑しています。',
      'この予報、宇宙のどこかでは当たっているかもしれません。',
    ],
  },
  {
    minAbsurdity: 20,
    messages: [
      '気象予報士が少し首をかしげています。',
      'なかなか攻めた予報ですね。',
    ],
  },
  {
    minAbsurdity: 0,
    messages: [
      'かなり現実的な予報です。',
      '手堅い予報です。プロの風格。',
    ],
  },
]

export function pickComment(absurdity: number): string {
  const tier = TIERS.find((t) => absurdity >= t.minAbsurdity) ?? TIERS[TIERS.length - 1]
  const index = Math.floor(Math.random() * tier.messages.length)
  return tier.messages[index]
}
