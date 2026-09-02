import { useState } from 'react'
import type {
  AbsurdityResult,
  ForecastData,
  GeoLocation,
  Guess,
  ScoreBreakdown,
} from '../types/weather'
import { fetchForecast } from '../api/openMeteo'
import { calculateScore } from '../logic/calculateScore'
import { calculateAbsurdity } from '../logic/calculateAbsurdity'
import { pickComment } from '../logic/comments'
import { LocationSearch } from '../components/LocationSearch'
import { CurrentWeather } from '../components/CurrentWeather'
import { ForecastForm } from '../components/ForecastForm'
import { ResultCard } from '../components/ResultCard'

interface Result {
  guess: Guess
  score: ScoreBreakdown
  absurdity: AbsurdityResult
  comment: string
}

export function ForecastMode() {
  const [location, setLocation] = useState<GeoLocation | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  async function handleSelectLocation(loc: GeoLocation) {
    setLocation(loc)
    setForecast(null)
    setResult(null)
    setError(null)
    setLoading(true)
    try {
      const data = await fetchForecast(loc)
      setForecast(data)
    } catch {
      setError('天気予報の取得に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  function handleGuess(guess: Guess) {
    if (!forecast) return
    const score = calculateScore(guess, forecast.tomorrow)
    const absurdity = calculateAbsurdity(guess, forecast.today)
    const comment = pickComment(absurdity.score)
    setResult({ guess, score, absurdity, comment })
  }

  function handleReset() {
    setResult(null)
  }

  return (
    <>
      <LocationSearch onSelect={handleSelectLocation} selected={location} />

      {loading && <p className="loading">天気を取得中…</p>}
      {error && <p className="error error--block">{error}</p>}

      {forecast && location && (
        <CurrentWeather location={location} forecast={forecast} />
      )}

      {forecast && !result && <ForecastForm onSubmit={handleGuess} />}

      {forecast && result && (
        <ResultCard
          guess={result.guess}
          tomorrow={forecast.tomorrow}
          score={result.score}
          absurdity={result.absurdity}
          comment={result.comment}
          onReset={handleReset}
        />
      )}
    </>
  )
}
