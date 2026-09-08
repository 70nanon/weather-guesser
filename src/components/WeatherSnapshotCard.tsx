import type { WeatherSnapshot } from '../types/location'
import { formatPlaceLabel } from '../logic/placeLabel'
import { categoryEmoji, categoryLabel, codeToCategory } from '../logic/weatherCode'
import { formatWind } from '../logic/wind'

interface PlaceLabel {
  name: string
  country?: string
}

interface Props {
  title: string
  snapshot: WeatherSnapshot
  place?: PlaceLabel
}

export function WeatherSnapshotCard({ title, snapshot, place }: Props) {
  const category = codeToCategory(snapshot.weatherCode)

  return (
    <section className="card">
      <h2 className="card__title">{title}</h2>
      {place && (
        <p className="place">{formatPlaceLabel(place.name, place.country)}</p>
      )}

      <div className="current">
        <div className="current__main">
          <span className="current__emoji" aria-hidden="true">
            {categoryEmoji(category)}
          </span>
          <div>
            <div className="current__temp">{Math.round(snapshot.temperature)}℃</div>
            <div className="current__label">{categoryLabel(category)}</div>
          </div>
        </div>
      </div>

      <dl className="stats">
        <div className="stat">
          <dt>最高気温</dt>
          <dd>{Math.round(snapshot.tempMax)}℃</dd>
        </div>
        <div className="stat">
          <dt>最低気温</dt>
          <dd>{Math.round(snapshot.tempMin)}℃</dd>
        </div>
        <div className="stat">
          <dt>湿度</dt>
          <dd>{Math.round(snapshot.humidity)}%</dd>
        </div>
        <div className="stat">
          <dt>降水量</dt>
          <dd>{snapshot.precipitationMm.toFixed(1)}mm</dd>
        </div>
        <div className="stat">
          <dt>風</dt>
          <dd>{formatWind(snapshot.windSpeedMs, snapshot.windDirectionDeg)}</dd>
        </div>
        <div className="stat">
          <dt>気圧</dt>
          <dd>{Math.round(snapshot.pressure)}hPa</dd>
        </div>
        {snapshot.sunrise && (
          <div className="stat">
            <dt>日の出</dt>
            <dd>{snapshot.sunrise}</dd>
          </div>
        )}
        {snapshot.sunset && (
          <div className="stat">
            <dt>日の入り</dt>
            <dd>{snapshot.sunset}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
