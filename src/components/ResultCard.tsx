import type {
  AbsurdityResult,
  DailyWeather,
  Guess,
  ScoreBreakdown,
} from '../types/weather'
import { categoryLabel, codeToCategory } from '../logic/weatherCode'

interface Props {
  guess: Guess
  tomorrow: DailyWeather
  score: ScoreBreakdown
  absurdity: AbsurdityResult
  comment: string
  onReset: () => void
}

export function ResultCard({
  guess,
  tomorrow,
  score,
  absurdity,
  comment,
  onReset,
}: Props) {
  const actualWeather = codeToCategory(tomorrow.weatherCode)

  return (
    <section className="card result-card">
      <h2 className="card__title">結果</h2>

      <div className="scoreboard">
        <div className="score-big">
          <span className="score-big__value">{score.total}</span>
          <span className="score-big__unit">/ 100点</span>
          <span className="score-big__caption">予報スコア</span>
        </div>
        <div className="absurd-big">
          <span className="absurd-big__value">{absurdity.score}%</span>
          <span className="absurd-big__caption">ありえなさ</span>
        </div>
      </div>

      <p className="comment">{comment}</p>

      <table className="compare">
        <thead>
          <tr>
            <th>項目</th>
            <th>あなた</th>
            <th>実際の明日</th>
            <th>点</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>天気</th>
            <td>{categoryLabel(guess.weather)}</td>
            <td>{categoryLabel(actualWeather)}</td>
            <td>{score.weather}/25</td>
          </tr>
          <tr>
            <th>最高気温</th>
            <td>{guess.tempMax}℃</td>
            <td>{Math.round(tomorrow.tempMax)}℃</td>
            <td>{score.tempMax}/30</td>
          </tr>
          <tr>
            <th>最低気温</th>
            <td>{guess.tempMin}℃</td>
            <td>{Math.round(tomorrow.tempMin)}℃</td>
            <td>{score.tempMin}/30</td>
          </tr>
          <tr>
            <th>降水確率</th>
            <td>{guess.precipProb}%</td>
            <td>{Math.round(tomorrow.precipProbMax)}%</td>
            <td>{score.precip}/15</td>
          </tr>
        </tbody>
      </table>

      {absurdity.reasons.length > 0 && (
        <div className="reasons">
          <p className="reasons__title">ありえないポイント</p>
          <ul>
            {absurdity.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn--primary" type="button" onClick={onReset}>
        もう一度予想する
      </button>
    </section>
  )
}
