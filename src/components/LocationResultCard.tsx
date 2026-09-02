import type { LocationRoundResult } from '../types/location'
import { formatDistanceKm } from '../logic/haversine'
import { MAX_LOCATION_SCORE } from '../logic/locationScore'

interface Props {
  result: LocationRoundResult
  onNext: () => void
}

export function LocationResultCard({ result, onNext }: Props) {
  return (
    <section className="card result-card">
      <h2 className="card__title">結果</h2>

      <div className="scoreboard">
        <div className="score-big">
          <span className="score-big__value">{result.score.toLocaleString('ja-JP')}</span>
          <span className="score-big__unit">/ {MAX_LOCATION_SCORE.toLocaleString('ja-JP')}点</span>
          <span className="score-big__caption">距離スコア</span>
        </div>
        <div className="absurd-big">
          <span className="absurd-big__value">{formatDistanceKm(result.distanceKm)}</span>
          <span className="absurd-big__caption">ずれ</span>
        </div>
      </div>

      <table className="compare">
        <thead>
          <tr>
            <th>項目</th>
            <th>内容</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>正解地点</th>
            <td>
              {result.target.name}
              {result.target.country ? ` / ${result.target.country}` : ''}
            </td>
          </tr>
          <tr>
            <th>あなたの回答</th>
            <td>
              {result.guess.latitude.toFixed(2)}, {result.guess.longitude.toFixed(2)}
            </td>
          </tr>
          <tr>
            <th>調査回数</th>
            <td>{result.investigationsUsed} 回</td>
          </tr>
        </tbody>
      </table>

      <button className="btn btn--primary" type="button" onClick={onNext}>
        次の問題
      </button>
    </section>
  )
}
