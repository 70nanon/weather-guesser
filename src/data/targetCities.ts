import type { TargetCity } from '../types/location'

/** 初期版の正解候補。観測しやすい都市を気候帯・大陸ごとにばらけさせている。 */
export const TARGET_CITIES: TargetCity[] = [
  { id: 1, name: '札幌', country: '日本', latitude: 43.06, longitude: 141.35 },
  { id: 2, name: '東京', country: '日本', latitude: 35.68, longitude: 139.76 },
  { id: 3, name: '那覇', country: '日本', latitude: 26.21, longitude: 127.68 },
  { id: 4, name: 'ソウル', country: '韓国', latitude: 37.57, longitude: 126.98 },
  { id: 5, name: '北京', country: '中国', latitude: 39.9, longitude: 116.4 },
  { id: 6, name: '上海', country: '中国', latitude: 31.23, longitude: 121.47 },
  { id: 7, name: '台北', country: '台湾', latitude: 25.03, longitude: 121.57 },
  { id: 8, name: '香港', country: '中国', latitude: 22.32, longitude: 114.17 },
  { id: 9, name: 'マニラ', country: 'フィリピン', latitude: 14.6, longitude: 120.98 },
  { id: 10, name: 'シンガポール', country: 'シンガポール', latitude: 1.35, longitude: 103.82 },
  { id: 11, name: 'バンコク', country: 'タイ', latitude: 13.76, longitude: 100.5 },
  { id: 12, name: 'ジャカルタ', country: 'インドネシア', latitude: -6.21, longitude: 106.85 },
  { id: 13, name: 'ムンバイ', country: 'インド', latitude: 19.08, longitude: 72.88 },
  { id: 14, name: 'デリー', country: 'インド', latitude: 28.61, longitude: 77.21 },
  { id: 15, name: 'ドバイ', country: 'アラブ首長国連邦', latitude: 25.2, longitude: 55.27 },
  { id: 16, name: 'ウランバートル', country: 'モンゴル', latitude: 47.92, longitude: 106.92 },
  { id: 17, name: 'ロンドン', country: 'イギリス', latitude: 51.51, longitude: -0.13 },
  { id: 18, name: 'パリ', country: 'フランス', latitude: 48.86, longitude: 2.35 },
  { id: 19, name: 'ベルリン', country: 'ドイツ', latitude: 52.52, longitude: 13.4 },
  { id: 20, name: 'マドリード', country: 'スペイン', latitude: 40.42, longitude: -3.7 },
  { id: 21, name: 'ローマ', country: 'イタリア', latitude: 41.9, longitude: 12.5 },
  { id: 22, name: 'アテネ', country: 'ギリシャ', latitude: 37.98, longitude: 23.73 },
  { id: 23, name: 'レイキャビク', country: 'アイスランド', latitude: 64.15, longitude: -21.94 },
  { id: 24, name: 'ヘルシンキ', country: 'フィンランド', latitude: 60.17, longitude: 24.94 },
  { id: 25, name: 'イスタンブール', country: 'トルコ', latitude: 41.01, longitude: 28.98 },
  { id: 26, name: 'カイロ', country: 'エジプト', latitude: 30.04, longitude: 31.24 },
  { id: 27, name: 'ラゴス', country: 'ナイジェリア', latitude: 6.52, longitude: 3.38 },
  { id: 28, name: 'ナイロビ', country: 'ケニア', latitude: -1.29, longitude: 36.82 },
  { id: 29, name: 'ケープタウン', country: '南アフリカ', latitude: -33.92, longitude: 18.42 },
  { id: 30, name: 'カサブランカ', country: 'モロッコ', latitude: 33.57, longitude: -7.59 },
  { id: 31, name: 'ニューヨーク', country: 'アメリカ', latitude: 40.71, longitude: -74.01 },
  { id: 32, name: 'シカゴ', country: 'アメリカ', latitude: 41.88, longitude: -87.63 },
  { id: 33, name: 'マイアミ', country: 'アメリカ', latitude: 25.76, longitude: -80.19 },
  { id: 34, name: 'バンクーバー', country: 'カナダ', latitude: 49.28, longitude: -123.12 },
  { id: 35, name: 'メキシコシティ', country: 'メキシコ', latitude: 19.43, longitude: -99.13 },
  { id: 36, name: 'リマ', country: 'ペルー', latitude: -12.05, longitude: -77.04 },
  { id: 37, name: 'ブエノスアイレス', country: 'アルゼンチン', latitude: -34.6, longitude: -58.38 },
  { id: 38, name: 'サンティアゴ', country: 'チリ', latitude: -33.45, longitude: -70.67 },
  { id: 39, name: 'サンパウロ', country: 'ブラジル', latitude: -23.55, longitude: -46.63 },
  { id: 40, name: 'アンカレッジ', country: 'アメリカ', latitude: 61.22, longitude: -149.9 },
  { id: 41, name: 'シドニー', country: 'オーストラリア', latitude: -33.87, longitude: 151.21 },
  { id: 42, name: 'オークランド', country: 'ニュージーランド', latitude: -36.85, longitude: 174.76 },
  { id: 43, name: 'パース', country: 'オーストラリア', latitude: -31.95, longitude: 115.86 },
  { id: 44, name: 'ホノルル', country: 'アメリカ', latitude: 21.31, longitude: -157.86 },
  { id: 45, name: 'ラパス', country: 'ボリビア', latitude: -16.5, longitude: -68.15 },
  { id: 46, name: 'モスクワ', country: 'ロシア', latitude: 55.76, longitude: 37.62 },
]

export function pickTargetCity(
  cities: readonly TargetCity[] = TARGET_CITIES,
  excludeId?: number,
): TargetCity {
  const pool =
    excludeId == null ? cities : cities.filter((city) => city.id !== excludeId)
  const list = pool.length > 0 ? pool : cities
  return list[Math.floor(Math.random() * list.length)]
}
