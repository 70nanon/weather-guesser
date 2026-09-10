import { useEffect, useRef, useState } from 'react'
import type { GeoLocation } from '../types/weather'
import type {
  Investigation,
  LatLng,
  LocationRoundResult,
  TargetCity,
  WeatherSnapshot,
} from '../types/location'
import { pickTargetCity } from '../data/targetCities'
import { fetchWeatherSnapshot } from '../api/openMeteo'
import { haversineKm } from '../logic/haversine'
import { locationScore } from '../logic/locationScore'
import { WeatherComparePanel, type CompareTab } from '../components/WeatherComparePanel'
import {
  InvestigatePanel,
  MAX_INVESTIGATIONS,
} from '../components/InvestigatePanel'
import { AnswerMap } from '../components/AnswerMap'
import { LocationResultCard } from '../components/LocationResultCard'

interface Round {
  target: TargetCity
  snapshot: WeatherSnapshot
}

export function LocationMode() {
  const [roundId, setRoundId] = useState(0)
  const [round, setRound] = useState<Round | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [investigations, setInvestigations] = useState<Investigation[]>([])
  const [guess, setGuess] = useState<LatLng | null>(null)
  const [answerError, setAnswerError] = useState<string | null>(null)
  const [result, setResult] = useState<LocationRoundResult | null>(null)
  const [compareTab, setCompareTab] = useState<CompareTab>('problem')
  const lastTargetIdRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    async function load() {
      let avoided = lastTargetIdRef.current
      for (let attempt = 0; attempt < 3; attempt++) {
        const target = pickTargetCity(undefined, avoided)
        try {
          const snapshot = await fetchWeatherSnapshot(target)
          if (cancelled) return
          lastTargetIdRef.current = target.id
          setRound({ target, snapshot })
          setLoading(false)
          setError(null)
          return
        } catch {
          avoided = target.id
        }
      }
      if (cancelled) return
      setRound(null)
      setError('天気の取得に失敗しました。もう一度お試しください。')
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [roundId])

  async function handleInvestigate(location: GeoLocation) {
    if (!round || result) return
    if (investigations.length >= MAX_INVESTIGATIONS) return
    if (investigations.some((item) => item.location.id === location.id)) {
      throw new Error('already-investigated')
    }
    const snapshot = await fetchWeatherSnapshot(location)
    setInvestigations((prev) => [...prev, { location, snapshot }])
    setCompareTab(investigations.length)
  }

  function handleAnswer() {
    if (!round) return
    if (!guess) {
      setAnswerError('地図をタップして回答位置を選んでください。')
      return
    }
    setAnswerError(null)
    const distanceKm = haversineKm(guess, round.target)
    const investigationsUsed = investigations.length
    setResult({
      target: round.target,
      guess,
      distanceKm,
      score: locationScore(distanceKm, investigationsUsed),
      investigationsUsed,
    })
  }

  function handleNext() {
    setRound(null)
    setInvestigations([])
    setGuess(null)
    setAnswerError(null)
    setResult(null)
    setCompareTab('problem')
    setError(null)
    setLoading(true)
    setRoundId((n) => n + 1)
  }

  const remaining = MAX_INVESTIGATIONS - investigations.length
  const answered = result != null

  return (
    <>
      {loading && <p className="loading">秘密の地点の天気を取得中…</p>}
      {error && (
        <div className="error error--block">
          <p className="error-block__text">{error}</p>
          <button className="btn btn--primary" type="button" onClick={handleNext}>
            再試行
          </button>
        </div>
      )}

      {round && (
        <WeatherComparePanel
          problem={round.snapshot}
          investigations={investigations}
          selected={compareTab}
          onSelect={setCompareTab}
        />
      )}

      {round && (
        <InvestigatePanel
          remaining={remaining}
          disabled={answered}
          onInvestigate={handleInvestigate}
        />
      )}

      {round && (
        <section className="card">
          <h2 className="card__title">地図で回答</h2>
          <p className="hint hint--inline">
            世界地図をタップして「ここだ」と思う場所にピンを置いてください。
          </p>
          <AnswerMap
            key={roundId}
            guess={guess}
            target={answered ? round.target : null}
            disabled={answered}
            onPick={(point) => {
              setGuess(point)
              setAnswerError(null)
            }}
          />
          {answerError && <p className="error">{answerError}</p>}
          {!answered && (
            <button className="btn btn--primary" type="button" onClick={handleAnswer}>
              ここで回答
            </button>
          )}
        </section>
      )}

      {result && <LocationResultCard result={result} onNext={handleNext} />}
    </>
  )
}
