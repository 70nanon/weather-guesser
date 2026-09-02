import { useCallback, useEffect } from 'react'
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import type { LatLng } from '../types/location'
import 'leaflet/dist/leaflet.css'

interface Props {
  guess: LatLng | null
  target?: LatLng | null
  disabled: boolean
  onPick: (point: LatLng) => void
}

function ClickCatcher({
  disabled,
  onPick,
}: {
  disabled: boolean
  onPick: (point: LatLng) => void
}) {
  const handlePick = useCallback(
    (point: LatLng) => {
      if (!disabled) onPick(point)
    },
    [disabled, onPick],
  )

  useMapEvents({
    click(e) {
      handlePick({ latitude: e.latlng.lat, longitude: e.latlng.lng })
    },
  })
  return null
}

function FitGuessAndTarget({ guess, target }: { guess: LatLng; target: LatLng }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(
      [
        [guess.latitude, guess.longitude],
        [target.latitude, target.longitude],
      ],
      { padding: [32, 32], maxZoom: 6 },
    )
  }, [map, guess, target])
  return null
}

export function AnswerMap({ guess, target, disabled, onPick }: Props) {
  const showTarget = target != null

  return (
    <div className="answer-map-wrap">
      <MapContainer
        className="answer-map"
        center={[20, 10]}
        zoom={1}
        minZoom={1}
        maxZoom={10}
        scrollWheelZoom
        worldCopyJump
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCatcher disabled={disabled} onPick={onPick} />
        {guess && (
          <CircleMarker
            center={[guess.latitude, guess.longitude]}
            radius={8}
            pathOptions={{
              color: '#fb8500',
              fillColor: '#ffb703',
              fillOpacity: 0.95,
              weight: 2,
            }}
          />
        )}
        {showTarget && (
          <CircleMarker
            center={[target.latitude, target.longitude]}
            radius={8}
            pathOptions={{
              color: '#126782',
              fillColor: '#219ebc',
              fillOpacity: 0.95,
              weight: 2,
            }}
          />
        )}
        {showTarget && guess && (
          <>
            <Polyline
              positions={[
                [guess.latitude, guess.longitude],
                [target.latitude, target.longitude],
              ]}
              pathOptions={{ color: '#d64550', weight: 2, dashArray: '6 6' }}
            />
            <FitGuessAndTarget guess={guess} target={target} />
          </>
        )}
      </MapContainer>
      <div className="map-legend">
        <span className="map-legend__item map-legend__item--guess">あなたのピン</span>
        {showTarget && (
          <span className="map-legend__item map-legend__item--target">正解地点</span>
        )}
      </div>
    </div>
  )
}
