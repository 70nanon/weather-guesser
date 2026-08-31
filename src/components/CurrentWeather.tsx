import type { ForecastData, GeoLocation } from '../types/weather'
import { categoryEmoji, categoryLabel, codeToCategory } from '../logic/weatherCode'

interface Props {
  location: GeoLocation
  forecast: ForecastData
}

export function CurrentWeather({ location, forecast }: Props) {
  const { current, today } = forecast
  const category = codeToCategory(current.weatherCode)

  return (
    <section className="card">
      <h2 className="card__title">2. 今日の天気</h2>
      <p className="place">
        {location.name}
        {location.country && <span className="place__country"> / {location.country}</span>}
      </p>

      <div className="current">
        <div className="current__main">
          <span className="current__emoji" aria-hidden="true">
            {categoryEmoji(category)}
          </span>
          <div>
            <div className="current__temp">{Math.round(current.temperature)}℃</div>
            <div className="current__label">{categoryLabel(category)}</div>
          </div>
        </div>
      </div>

      <dl className="stats">
        <div className="stat">
          <dt>今日の最高</dt>
          <dd>{Math.round(today.tempMax)}℃</dd>
        </div>
        <div className="stat">
          <dt>今日の最低</dt>
          <dd>{Math.round(today.tempMin)}℃</dd>
        </div>
        <div className="stat">
          <dt>湿度</dt>
          <dd>{Math.round(current.humidity)}%</dd>
        </div>
        <div className="stat">
          <dt>気圧</dt>
          <dd>{Math.round(current.pressure)}hPa</dd>
        </div>
      </dl>
    </section>
  )
}
