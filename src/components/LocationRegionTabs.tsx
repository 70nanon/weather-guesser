import type { LocationRegion } from '../types/location'

interface Props {
  region: LocationRegion
  onChange: (region: LocationRegion) => void
}

export function LocationRegionTabs({ region, onChange }: Props) {
  return (
    <div className="region-tabs" role="tablist" aria-label="出題範囲">
      <button
        type="button"
        role="tab"
        aria-selected={region === 'japan'}
        className={`region-tab${region === 'japan' ? ' region-tab--on' : ''}`}
        onClick={() => onChange('japan')}
      >
        日本
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={region === 'world'}
        className={`region-tab${region === 'world' ? ' region-tab--on' : ''}`}
        onClick={() => onChange('world')}
      >
        世界
        <span className="region-tab__note">難しい</span>
      </button>
    </div>
  )
}
