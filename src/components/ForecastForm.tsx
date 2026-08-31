import { useState } from 'react'
import type { GuessableWeather, Guess } from '../types/weather'
import { categoryEmoji, categoryLabel } from '../logic/weatherCode'

interface Props {
  onSubmit: (guess: Guess) => void
}

const WEATHER_OPTIONS: GuessableWeather[] = ['clear', 'cloudy', 'rain', 'snow']

export function ForecastForm({ onSubmit }: Props) {
  const [weather, setWeather] = useState<GuessableWeather>('clear')
  const [tempMax, setTempMax] = useState('')
  const [tempMin, setTempMin] = useState('')
  const [precipProb, setPrecipProb] = useState('')
  const [error, setError] = useState<string | null>(null)

  function parseNumber(value: string): number | null {
    if (value.trim() === '') return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const max = parseNumber(tempMax)
    const min = parseNumber(tempMin)
    const precip = parseNumber(precipProb)

    if (max === null || min === null || precip === null) {
      setError('すべての項目に数値を入力してください。')
      return
    }
    setError(null)
    onSubmit({ weather, tempMax: max, tempMin: min, precipProb: precip })
  }

  return (
    <section className="card">
      <h2 className="card__title">3. 明日の天気を予想</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">天気</span>
          <div className="chips">
            {WEATHER_OPTIONS.map((w) => (
              <button
                type="button"
                key={w}
                className={`chip${weather === w ? ' chip--on' : ''}`}
                onClick={() => setWeather(w)}
                aria-pressed={weather === w}
              >
                <span aria-hidden="true">{categoryEmoji(w)}</span> {categoryLabel(w)}
              </button>
            ))}
          </div>
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">最高気温(℃)</span>
            <input
              className="field__input"
              type="text"
              inputMode="numeric"
              value={tempMax}
              onChange={(e) => setTempMax(e.target.value)}
              placeholder="例: 22"
            />
          </label>
          <label className="field">
            <span className="field__label">最低気温(℃)</span>
            <input
              className="field__input"
              type="text"
              inputMode="numeric"
              value={tempMin}
              onChange={(e) => setTempMin(e.target.value)}
              placeholder="例: 12"
            />
          </label>
        </div>

        <label className="field">
          <span className="field__label">降水確率(%)</span>
          <input
            className="field__input"
            type="text"
            inputMode="numeric"
            value={precipProb}
            onChange={(e) => setPrecipProb(e.target.value)}
            placeholder="0〜100"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn btn--primary" type="submit">
          この予想で判定する
        </button>
      </form>
    </section>
  )
}
