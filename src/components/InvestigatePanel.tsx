import { useState } from 'react'
import type { GeoLocation } from '../types/weather'
import { searchLocations } from '../api/openMeteo'

export const MAX_INVESTIGATIONS = 3

interface Props {
  remaining: number
  disabled: boolean
  onInvestigate: (location: GeoLocation) => Promise<void>
}

export function InvestigatePanel({
  remaining,
  disabled,
  onInvestigate,
}: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [investigatingId, setInvestigatingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const locked = disabled || remaining <= 0

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim().length === 0 || locked) return
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const found = await searchLocations(query)
      setResults(found)
    } catch {
      setError('検索に失敗しました。通信環境を確認してください。')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSelect(loc: GeoLocation) {
    if (locked || investigatingId != null) return
    setInvestigatingId(loc.id)
    setError(null)
    try {
      await onInvestigate(loc)
      setResults([])
      setQuery('')
      setSearched(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      setError(
        message === 'already-investigated'
          ? 'その地点は調査済みです。別の地点を選んでください。'
          : '天気の取得に失敗しました。別の地点を試してください。',
      )
    } finally {
      setInvestigatingId(null)
    }
  }

  return (
    <section className="card">
      <h2 className="card__title">調査する</h2>
      <p className="hint hint--inline">
        任意の地点の天気を見て、秘密の地点と比べられます。距離や方向は教えません。
      </p>
      <p className="investigate-count">
        残り調査回数 <strong>{remaining}</strong> / {MAX_INVESTIGATIONS}
      </p>

      <form className="search" onSubmit={handleSearch}>
        <input
          className="search__input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例: 札幌, 大阪, Singapore"
          aria-label="調査する地名"
          autoComplete="off"
          disabled={locked}
        />
        <button className="btn" type="submit" disabled={locked || loading}>
          {loading ? '検索中…' : '検索'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {!error && searched && !loading && results.length === 0 && (
        <p className="hint">見つかりませんでした。別の地名を試してください。</p>
      )}

      {remaining <= 0 && !disabled && (
        <p className="hint">調査回数を使い切りました。地図で回答してください。</p>
      )}

      {results.length > 0 && (
        <ul className="results">
          {results.map((loc) => (
            <li key={loc.id}>
              <button
                type="button"
                className="result"
                onClick={() => void handleSelect(loc)}
                disabled={locked || investigatingId != null}
              >
                <span className="result__name">{loc.name}</span>
                <span className="result__country">
                  {investigatingId === loc.id ? '取得中…' : '調査する'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
