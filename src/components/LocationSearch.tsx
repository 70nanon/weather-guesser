import { useState } from 'react'
import type { GeoLocation } from '../types/weather'
import { searchLocations } from '../api/openMeteo'
import { formatPlaceLabel } from '../logic/placeLabel'

interface Props {
  onSelect: (location: GeoLocation) => void
  selected: GeoLocation | null
}

export function LocationSearch({ onSelect, selected }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim().length === 0) return
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

  return (
    <section className="card">
      <h2 className="card__title">1. 場所をさがす</h2>
      <form className="search" onSubmit={handleSearch}>
        <input
          className="search__input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例: 東京, London, ニューヨーク"
          aria-label="地名"
          autoComplete="off"
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? '検索中…' : '検索'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {!error && searched && !loading && results.length === 0 && (
        <p className="hint">見つかりませんでした。別の地名を試してください。</p>
      )}

      {results.length > 0 && (
        <ul className="results">
          {results.map((loc) => {
            const isSelected = selected?.id === loc.id
            return (
              <li key={loc.id}>
                <button
                  type="button"
                  className={`result${isSelected ? ' result--selected' : ''}`}
                  onClick={() => onSelect(loc)}
                >
                  <span className="result__name">
                    {formatPlaceLabel(loc.name, loc.country)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
