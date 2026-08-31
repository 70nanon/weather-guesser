# 天気ゲッサー (Weather Guesser)

今日の天気をヒントに「明日の天気」を予想して遊ぶ、スマホ向けの小さな Web ゲームです。
予想を Open-Meteo の明日予報と比べて **予報スコア（100点満点）** を出し、極端な予想には **ありえなさスコア** とネタコメントを返します。

公開 URL: https://70nanon.github.io/weather-guesser/

## 遊び方

1. 場所を検索して選ぶ
2. 今日の天気（気温・湿度・気圧など）を確認する
3. 明日の天気・最高/最低気温・降水確率を予想する
4. 判定すると、予報スコア・ありえなさスコア・実際の明日予報・項目ごとの差・ネタコメントが表示される

## 技術構成

- Vite + React + TypeScript
- 状態管理は React の `useState` のみ（外部ライブラリなし）
- スタイルは素の CSS（コンポーネントライブラリなし）
- バックエンド / DB / ログインなし。ブラウザから [Open-Meteo](https://open-meteo.com/) を直接呼ぶ（APIキー不要）
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
  components/   LocationSearch / CurrentWeather / ForecastForm / ResultCard
  api/          openMeteo.ts        Open-Meteo 呼び出し
  logic/        calculateScore / calculateAbsurdity / comments / weatherCode (+ test)
  types/        weather.ts
.github/workflows/deploy.yml        main push で GitHub Pages へデプロイ
```

## デプロイ (GitHub Pages)

`main` への push で GitHub Actions（`actions/deploy-pages`）が自動ビルド＆デプロイします。
初回のみ GitHub リポジトリの **Settings → Pages → Source** を **GitHub Actions** に設定してください。

Vite の `base` は `/weather-guesser/` に固定しています（サブパス配信のため）。
