const COMPASS_8 = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'] as const

/** 風向（度, 0=北, 90=東）を8方位の日本語に変換する。 */
export function windDirectionLabel(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  const index = Math.round(normalized / 45) % 8
  return COMPASS_8[index]
}

export function formatWind(speedMs: number, directionDeg: number): string {
  return `${windDirectionLabel(directionDeg)} ${speedMs.toFixed(1)}m/s`
}
