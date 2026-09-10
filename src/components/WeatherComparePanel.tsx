import type { Investigation, WeatherSnapshot } from '../types/location'
import { WeatherSnapshotCard } from './WeatherSnapshotCard'

export type CompareTab = 'problem' | number

interface Props {
  problem: WeatherSnapshot
  investigations: Investigation[]
  selected: CompareTab
  onSelect: (tab: CompareTab) => void
}

export function WeatherComparePanel({
  problem,
  investigations,
  selected,
  onSelect,
}: Props) {
  const active: CompareTab =
    typeof selected === 'number' && selected >= investigations.length
      ? 'problem'
      : selected

  if (investigations.length === 0) {
    return <WeatherSnapshotCard title="現在の天気" snapshot={problem} />
  }

  return (
    <section className="card">
      <div className="compare-tabs" role="tablist" aria-label="問題と調査の天気">
        <button
          type="button"
          role="tab"
          aria-selected={active === 'problem'}
          className={`compare-tab${active === 'problem' ? ' compare-tab--on' : ''}`}
          onClick={() => onSelect('problem')}
        >
          問題
        </button>
        {investigations.map((item, index) => (
          <button
            type="button"
            role="tab"
            key={`${item.location.id}-${index}`}
            aria-selected={active === index}
            className={`compare-tab${active === index ? ' compare-tab--on' : ''}`}
            onClick={() => onSelect(index)}
          >
            調査{index + 1}
          </button>
        ))}
      </div>
      <p className="hint hint--inline">
        タブを切り替えて、問題の天気と調査結果を比べられます。
      </p>
      {active === 'problem' ? (
        <WeatherSnapshotCard title="現在の天気" snapshot={problem} framed={false} />
      ) : (
        <WeatherSnapshotCard
          title={`調査${active + 1}`}
          snapshot={investigations[active].snapshot}
          place={{
            name: investigations[active].location.name,
            country: investigations[active].location.country,
          }}
          framed={false}
        />
      )}
    </section>
  )
}
