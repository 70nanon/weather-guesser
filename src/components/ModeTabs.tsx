export type GameMode = 'forecast' | 'location'

interface Props {
  mode: GameMode
  onChange: (mode: GameMode) => void
}

export function ModeTabs({ mode, onChange }: Props) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="ゲームモード">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'forecast'}
        className={`mode-tab${mode === 'forecast' ? ' mode-tab--on' : ''}`}
        onClick={() => onChange('forecast')}
      >
        予報
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'location'}
        className={`mode-tab${mode === 'location' ? ' mode-tab--on' : ''}`}
        onClick={() => onChange('location')}
      >
        場所
      </button>
    </div>
  )
}
