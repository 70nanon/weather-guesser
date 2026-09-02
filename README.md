# 天気ゲッサー (Weather Guesser)

スマホ向けの小さな Web ゲームです。同じアプリの中に、向きの違う 2 つのモードがあります。

- **予報モード**: ある地点の今日の天気を見て、明日の天気を当てる
- **場所モード**: 今日の天気だけを手がかりに、世界のどこかを当てる

公開 URL: https://70nanon.github.io/weather-guesser/

## 予報モード

場所を選んで今日の天気を確認し、明日の天気・最高/最低気温・降水確率を予想します。
予想を Open-Meteo の明日予報と比べて **予報スコア（100点満点）** を出し、極端な予想には **ありえなさスコア** とネタコメントを返します。

1. 場所を検索して選ぶ
2. 今日の天気（気温・湿度・気圧など）を確認する
3. 明日の天気・最高/最低気温・降水確率を予想する
4. 判定すると、予報スコア・ありえなさスコア・実際の明日予報・項目ごとの差・ネタコメントが表示される

## 場所モード

ゲーム開始時に、都市リストからランダムに「正解地点」が選ばれます。地点名は隠し、その現在の天気だけを見せます。
プレイヤーは最大 3 回まで任意の地点の天気を調査し、天気の差から場所を絞り込み、世界地図上で回答します。

- 調査地点との距離や方向は表示しない（比較できるのは天気のみ）
- 採点は正解地点と回答ピンの大円距離。近いほど高得点（最大 5000 点）
- ランキング・ログイン・戦績保存は未実装

## 技術構成

- Vite + React + TypeScript
- 状態管理は React の `useState` のみ（外部の状態管理ライブラリなし）
- スタイルは素の CSS（コンポーネントライブラリなし）
- バックエンド / DB / ログインなし。ブラウザから [Open-Meteo](https://open-meteo.com/) を直接呼ぶ（APIキー不要）
- 場所モードの地図は [Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/copyright) タイル
- スマホファースト（幅 390px 前後を第一対象）

## 開発

```bash
npm install      # 依存インストール
npm run dev      # 開発サーバ (http://localhost:5173/weather-guesser/)
npm run build    # 型チェック + 本番ビルド
npm test         # スコア計算のテスト (vitest)
npm run lint     # oxlint
```

## ディレクトリ

```
src/
  App.tsx / App.css / main.tsx / index.css
  modes/        ForecastMode / LocationMode
  components/   検索・天気カード・予想フォーム・地図・結果 など
  api/          openMeteo.ts        Open-Meteo 呼び出し
  data/         targetCities.ts     場所モードの正解候補
  logic/        予報スコア / ありえなさ / 距離 / 場所スコア (+ test)
  types/        weather.ts / location.ts
.github/workflows/deploy.yml        main push で GitHub Pages へデプロイ
```

## デプロイ (GitHub Pages)

`main` への push で GitHub Actions（`actions/deploy-pages`）が自動ビルド＆デプロイします。
初回のみ GitHub リポジトリの **Settings → Pages → Source** を **GitHub Actions** に設定してください。

Vite の `base` は `/weather-guesser/` に固定しています（サブパス配信のため）。
