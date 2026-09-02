import { useState } from 'react'
import './App.css'
import { ModeTabs, type GameMode } from './components/ModeTabs'
import { ForecastMode } from './modes/ForecastMode'
import { LocationMode } from './modes/LocationMode'

const COPY: Record<GameMode, { title: string; subtitle: string }> = {
  forecast: {
    title: '天気ゲッサー',
    subtitle: '今日の天気をヒントに、明日を当てろ。',
  },
  location: {
    title: 'この天気はどこ？',
    subtitle: '天気だけを手がかりに、世界のどこかを当てろ。',
  },
}

function App() {
  const [mode, setMode] = useState<GameMode>('forecast')
  const copy = COPY[mode]

  return (
    <div className={`app${mode === 'location' ? ' app--location' : ''}`}>
      <header className="app__header">
        <h1 className="app__title">{copy.title}</h1>
        <p className="app__subtitle">{copy.subtitle}</p>
        <ModeTabs mode={mode} onChange={setMode} />
      </header>

      <main className="app__main">
        {mode === 'forecast' ? <ForecastMode /> : <LocationMode />}
      </main>

      <footer className="app__footer">
        天気データ:{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
        {mode === 'location' && (
          <>
            {' · '}
            地図:{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
            >
              OpenStreetMap
            </a>
          </>
        )}
      </footer>
    </div>
  )
}

export default App
